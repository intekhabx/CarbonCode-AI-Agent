import ApiResponse from "../../lib/api-response.js";
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/async-handler.js";
import type { AuthRequest } from "../../types/auth.type.js";
import { callChatAgentLLM } from "../../agent/chat-agent/agent.js";
import db from "../../db/db.js";
import { chatsTable, messagesTable } from "./chat.schema.js";
import { and, desc, eq, sql } from "drizzle-orm";
import ApiError from "../../lib/api-error.js";
import { analyzeUserMemoryWithLLM, createOrUpdateMemoriesInDB, generateVectorEmbeddings, searchUserMemories } from "../../agent/memory/memory.js";


export const findOrCreateNewChat = async ({userId, chatId, title}: {userId: string, chatId: string, title: string}) => {
  // step:1 find the existing chat and return it
    const [existingChat] = await db.select().from(chatsTable)
        .where(and(eq(chatsTable.id, chatId), eq(chatsTable.owner, userId)))
        .limit(1);

    if(existingChat){
      return existingChat;
    }

  // step:2 if existing chat doesn't exist then create a new chat
  const [newChat] = await db.insert(chatsTable).values({
    id: chatId,
    owner: userId,
    title,
    type: "chat",
  }).returning();

  if(!newChat){
    throw ApiError.internalError("Something went wrong while creating chat");
  }

  return newChat;
}

export const getUserShortTermChatContext = async (chatId: string) => {
  // step:1 find previous 20 messages chat history to add in the history context
  const messagesArray = await db.select().from(messagesTable)
      .where(eq(messagesTable.chatId, chatId)).limit(20);

  // step:2 if the first msge was of assistant in last 20 then remove 1st one (msge should be start form user)
  const history = messagesArray.slice(messagesArray[0]?.role === "assistant" ? 1 : 0 , messagesArray.length);

  return history;
}

export const addUserOrAgentMessageInChat = async ({chatId, content, role}: {chatId: string, content: string, role: "user" | "assistant"}) => {
  // step:1 create new message (add message in the chat)
  const [message] = await db.insert(messagesTable).values({
    content,
    role,
    chatId,
  }).returning();

  if(!message){
    throw ApiError.internalError("Something went wrong while creating message");
  }

  return message;
}






export const callChatAgent = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // step:1 extract the prompt and chatId from body
    const { prompt, chatId } = req.body as {prompt: string, chatId: string};
    const userId = req.user?.sub.toString()!;

    // step:2 find the existing chat if exists,  otherwise create new one
    const title = prompt.length > 30 ? prompt.slice(0, 30) : prompt;
    const chat = await findOrCreateNewChat({userId, chatId, title});

    // step:3 get previous 20 messages chat history to add in the history context
    const history = await getUserShortTermChatContext(chat.id);

    // step:4 create new message (add message in the chat)
    const message = await addUserOrAgentMessageInChat({chatId: chat.id, content: prompt, role: "user"});

    // LONGTERM MEMORY WORKER1 STARTS
    // step:5 generate embeddings of the user prompt
    const embeddings = await generateVectorEmbeddings(prompt);
    console.log("Embedding: ", embeddings);

    // step:6 use embeddings to get the similar or related memories from DB
    const memories = await searchUserMemories(embeddings!, userId);

    // step:7 send both prompt and memories as userPrompt
    const userPrompt = JSON.stringify({
      currentUserPrompt: prompt,
      existingMemories: memories,
    });

    // stpe:8 call the LLM with userPrompt to check that current user prompt has any longterm data to add or update in memories
    const analysisResult = await analyzeUserMemoryWithLLM(userPrompt, history);
    
    // step:9 if analysisResult.shouldStore is true then store or update the memories in DB
    await createOrUpdateMemoriesInDB(analysisResult, userId, message.id);
    // LONGTERM MEMEORY WORKER1 ENDS

    // LONGTERM MEMORY WORKER2 STARTS
    // step:10 generate userPrompt embedding and search similar or related memories
    const updatedUserPrompt = JSON.stringify({ // here we don't redo because we have already on above 👆
      currentUserPrompt: prompt,
      existingMemories: memories
    });

    // step:11 call the chat agent with user prompt and chatHistory to get the response 
    const result = await callChatAgentLLM(updatedUserPrompt, history);
    if(!result){
      throw ApiError.badRequest("Agent is getting high traffic");
    }

    // step:12 insert the agent response in the db for chat history 
    await addUserOrAgentMessageInChat({chatId: chat.id, content: result, role: "assistant"});

    ApiResponse.ok(res, "Agent res generated", { result });
  },
);



export const getAllUserChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 extract the userId 
  const userId = req.user?.sub.toString()!;

  // step:2 find all the chats of the user
  const chats = await db.select().from(chatsTable).where(eq(chatsTable.owner, userId))
    .orderBy(desc(chatsTable.createdAt));

  if(chats.length < 1){
    throw ApiError.notFound("User doesn't have any chats");
  }

  ApiResponse.ok(res, "All chats have been fetched", {chats});
});



export const getUserChatById = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 extract the userId from user and chatId from params
  const userId = req.user?.sub.toString()!;
  const chatId = req.params.chatId?.toString();
  if(!chatId || chatId.length !== 36){
    throw ApiError.badRequest("missing or invalid chatId params");
  }

  // step:2 find the chat and messages of it in the db
  const chatAndMsgObjArray = await db.select().from(chatsTable)
    .leftJoin(messagesTable, eq(chatsTable.id, messagesTable.chatId))
    .where(and(eq(chatsTable.owner, userId), eq(chatsTable.id, chatId)));

  if(chatAndMsgObjArray.length < 1){
    throw ApiError.notFound("Chat and Messages doesn't found");
  }

  // step:3 extract the messages and chat
  const messages = chatAndMsgObjArray.map((obj) => {
    return obj.messages
  })

  const chat = {
    id: chatAndMsgObjArray[0]?.chats.id,
    title: chatAndMsgObjArray[0]?.chats.title,
    pinned: chatAndMsgObjArray[0]?.chats.pinned,
    type: chatAndMsgObjArray[0]?.chats.type,
    createdAt: chatAndMsgObjArray[0]?.chats.createdAt,
    updatedAt: chatAndMsgObjArray[0]?.chats.updatedAt,
    owner : chatAndMsgObjArray[0]?.chats.owner,
    messages,
  }

  ApiResponse.ok(res, "Chat is fetched", {chat});
});



export const togglePinnedUserChat = asyncHandler( async (req: AuthRequest, res: Response) => {
  // step:1 extract chatId from params and chatId length is 36 because we use uuidv4
  const userId = req.user?.sub.toString()!;
  const chatId = req.params.chatId?.toString();
  if(!chatId || chatId.length !== 36){
    throw ApiError.badRequest("missing or invalid chatId params");
  }

  // step:2 find the chat and update the pinned value, if found
  const [chat] = await db.update(chatsTable)
    .set({pinned: sql`NOT ${chatsTable.pinned}`})
    .where(and(eq(chatsTable.id, chatId), eq(chatsTable.owner, userId)))
    .returning();

  if(!chat){
    throw ApiError.notFound("Chat doestn't exists");
  }

  // step:3 creating messages for pinned and unpinned
  const message = chat.pinned ? "Chat Pinned Successfully" : "Chat UnPinned Successfully";

  ApiResponse.ok(res, message, {chat});
})




export const deleteUserChatById = asyncHandler( async (req: AuthRequest, res: Response) => {
  // step:1 extract chatId from params and userId
  const userId = req.user?.sub.toString()!;
  const chatId = req.params.chatId?.toString();
  if(!chatId || chatId.length !== 36){
    throw ApiError.badRequest("missing or invalid chatId params");
  }

  // step:2 find the chat of the user and delete, if found
  const [chat] = await db.delete(chatsTable)
    .where(and(eq(chatsTable.id, chatId), eq(chatsTable.owner, userId)))
    .returning();

  if(!chat){
    throw ApiError.notFound("Chat doesn't exists");
  }

  ApiResponse.ok(res, "Chat has deleted successfully");
})
