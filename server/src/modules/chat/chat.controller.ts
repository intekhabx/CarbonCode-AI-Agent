import ApiResponse from "../../lib/api-response.js";
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/async-handler.js";
import type { AuthRequest } from "../../types/auth.type.js";
import { callChatAgentLLM } from "../../agent/chat-agent/agent.js";
import db from "../../db/db.js";
import { chatsTable, messagesTable } from "./chat.schema.js";
import { and, desc, eq } from "drizzle-orm";
import ApiError from "../../lib/api-error.js";


const findOrCreateNewChat = async ({userId, chatId, title}: {userId: string, chatId: string, title: string}) => {
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


export const callChatAgent = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // step:1 extract the prompt and chatId from body
    const { prompt, chatId } = req.body as {prompt: string, chatId: string};
    const userId = req.user?.sub.toString()!;

    // step:2 find the existing chat if exists,  otherwise create new one
    const title = prompt.length > 30 ? prompt.slice(0, 30) : prompt;
    const chat = await findOrCreateNewChat({userId, chatId, title});

    // step:3 create new message
    await db.insert(messagesTable).values({
      content: prompt,
      role: "user",
      chatId: chat.id,
    });

    // ? we should add this in the queue and work do it
    // step:4 
    const result = await callChatAgentLLM(prompt);
    console.log(result);
    if(!result){
      throw ApiError.badRequest("Agent is getting high traffic");
    }

    // step:5 
    await db.insert(messagesTable).values({
      content: result,
      role: "assistant",
      chatId: chat.id,
    });

    ApiResponse.ok(res, "Agent res genereated", { result });
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
  const chatId = req.params.chatId?.toString()!;

  // step:2 find the chat in the db
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
    createdAt: chatAndMsgObjArray[0]?.chats.createdAt,
    updatedAt: chatAndMsgObjArray[0]?.chats.updatedAt,
    owner : chatAndMsgObjArray[0]?.chats.owner,
    messages,
  }

  ApiResponse.ok(res, "Chat is fetched", {chat});
});


export const getUserChatMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 extract the userId from user and chatId from params
  const userId = req.user?.sub.toString()!;
  const chatId = req.params.chatId?.toString()!;

  // step:2 find all messages of the chatId
  const messages = await db.select().from(messagesTable)
    .innerJoin(
      chatsTable,
      eq(messagesTable.chatId, chatsTable.id)
    )
    .where(
      and(
        eq(messagesTable.chatId, chatId),
        eq(chatsTable.owner, userId)
      )
    );
  
  ApiResponse.ok(res, "Messages of Chat fetchted successfully", {messages});
})
