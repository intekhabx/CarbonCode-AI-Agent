import OpenAI from "openai";
import { env } from "../../config/env.js";
import type { Message } from "@repo/types/chat-types.js";
import db from "../../db/db.js";
import { inArray, sql } from "drizzle-orm";
import type { MemoryAnalysisResult, MemorySearchResult } from "../../types/memory.type.js";
import { memoriesTable } from "./schema.js";
import { MEMEORY_ANALYZER_SYSTEM_PROMPT } from "./prompt.js";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";



const client = new OpenAI({
  apiKey: env.GEMINI_API_KEY,
  baseURL: env.GEMINI_BASE_URL,
})




export async function generateVectorEmbeddings(text: string) {
  // step:1 call the embedding LLM model and convert text into embedding
  const response = await client.embeddings.create({
    model: env.MEMORY_EMBEDDING_MODEL,
    input: text,
    dimensions: 1536,
  });

  return response.data[0]?.embedding;
}



export async function searchUserMemories(embedding: number[], userId: string) {
  // step:1 execute the sql query and find the user's longterm memories
  const results: {rows: MemorySearchResult[]} = await db.execute(sql`
    SELECT
      id,
      user_id,
      type,
      content,
      confidence,
      importance,
      status,
      source_message_id,
      vector <=> ${JSON.stringify(embedding)}::vector AS distance,
      created_at,
      updated_at,
      last_accessed_at
    FROM memories
    WHERE user_id = ${userId}
      AND status = 'active'
      AND vector IS NOT NULL
    ORDER BY distance ASC
    LIMIT 10
  `);


  // step:2 after finding all the memories, extract all memory ids
  const memoryIds = results.rows.map(
    (memory) => memory.id
  );

  // step:3 after extracting all memory ids, update lastAccessedAt of all memory
  if (memoryIds.length > 0) {
    await db.update(memoriesTable)
    .set({
      lastAccessedAt: new Date(),
    })
    .where(inArray(memoriesTable.id, memoryIds));
  }

  // step:4 return the retrived memories
  console.log("Search Results:", results.rows);
  return results.rows;
}



export async function createOrUpdateMemoriesInDB(data: MemoryAnalysisResult, userId: string, messageId: string) {
  const logs: {operation: "create" | "update", memory: any}[] = []; //we are collecting the logs of the operations performed on the memories

  // step:1 shouldStore is false or memories array has no element then just return
  if(!data.shouldStore || data.memories.length < 0){
    console.log("No changes in the longterm memory data, so no need to store or update in DB");
    return;
  }

  // step:2 loop the memories array and extract each memory object
  for (const memory of data.memories) {

    // step:3 if there is no changes in the in the longterm memory data
    if(memory.operation === "no_action"){
      continue;
    }

    // step:4 (if user updated something in the longterm data) || (if user provided a new longterm data) in both cases we need to generate embeddings
    const embedding = await generateVectorEmbeddings(memory.content);

    // step:5 if there is a new longterm data provided by user
    if(memory.operation === "create"){
      const [created] = await db.insert(memoriesTable).values({
        content: memory.content,
        type: memory.type,
        userId: userId,
        confidence: memory.confidence,
        importance: memory.importance,
        status: memory.status,
        vector: embedding,
        sourceMessageId: messageId ?? null,
      }).returning();

      logs.push({
        operation: "create",
        memory: created,
      })
      continue;
    }

    // step:6 if userPrompt has longterm data (like name, age etc) and data shouldn't be duplicated so we have to update
    if(memory.operation === "update"){
      const [updated] = await db.update(memoriesTable).set({
        content: memory.content,
        vector: embedding,
        confidence: memory.confidence,
        importance: memory.importance,
        sourceMessageId: messageId ?? null,
        status: memory.status,
        type: memory.type,
      }).returning();

      logs.push({
        operation: "update",
        memory: updated,
      })
      continue;
    }
  }

  console.log("Processed Logs:", logs);
  return;
}







// structred response format for memory analysis result
export const MemoryAnalysisResultStructure = z.object({
  shouldStore: z.boolean(),
  memories: z.array(
    z.object({
      type: z.enum(["factual", "episodic", "semantic", "procedural"]),
      content: z.string(),
      confidence: z.number(),
      importance: z.number(),
      operation: z.enum(["create", "update", "no_action"]),
      existingMemoryId: z.string().nullable(),
      status: z.enum([ "active", "archived", "superseded", "deleted"]),
      reason: z.string(),
    })
  ),
});



export async function analyzeUserMemoryWithLLM(userPrompt: string, history: Message[]) {
  // we are using parse inseated of created beause we use response_format
  const response = await client.chat.completions.parse({
    model: env.MEMORY_AGENT_MODEL,
    messages: [
      {
        role: "system",
        content: MEMEORY_ANALYZER_SYSTEM_PROMPT,
      },
      ...history,
      {
        role: "user",
        content: userPrompt,
      }
    ],
    response_format: zodResponseFormat(MemoryAnalysisResultStructure, "memory_analysis"), //"memory_analysis" is a identifier that tells structured response format name
  })

  const result = response.choices[0]?.message;

  if (!result || result.refusal || !result.parsed) {
    throw new Error("Memory analysis failed or was refused");
  }

  return result.parsed
}