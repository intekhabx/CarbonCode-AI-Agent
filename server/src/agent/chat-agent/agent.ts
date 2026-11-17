import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";
import { env } from "../../config/env.js";
import { createAndWriteFileTool } from "../tools/writefile.tool.js";
import executeTool from "../tools/index.js";



const openai = new OpenAI({
  apiKey: env.GEMINI_API_KEY,
  baseURL: env.GEMINI_BASE_URL,
});

export async function callChatAgentLLM(userPrompt: string) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful assistant and you have tools you can use.",
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const tools = [createAndWriteFileTool];

  const MAX_ITERATION = 5;

  for (let i = 0; i < MAX_ITERATION; i++) {
    let response = await openai.chat.completions.create({
      model: env.CHAT_AGENT_MODEL,
      messages,
      tool_choice: "auto",
      tools,
    });

    const assistantResponse = response.choices[0]?.message;
    if (!assistantResponse) {
      throw new Error("No response from LLM");
    }

    // Preserve assistant message and tool calls
    messages.push(assistantResponse);

    const toolCalls = assistantResponse.tool_calls ?? [];
    if (toolCalls.length === 0) {
      console.log("Final Response:", assistantResponse.content);
      return assistantResponse.content;
    }

    for (const toolCall of toolCalls) {
      if (toolCall.type !== "function") continue;

      const name = toolCall.function.name;
      const toolFunction = executeTool[name as keyof typeof executeTool];

      let result: unknown;

      try {
        if (!toolFunction) {
          throw new Error(`Unknown tool: ${name}`);
        }

        result = await toolFunction(JSON.parse(toolCall.function.arguments));
      } catch (error) {
        result = {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }

      // resend tool result in the message
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
        name, //genimi me name v dena jaroori hai
      } as any);
    }
  }
}
