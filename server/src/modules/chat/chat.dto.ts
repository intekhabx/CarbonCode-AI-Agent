import { z } from "zod";


export const callChatAgentInputSchemaDto = z.object({
  prompt: z.string().min(1, "Prompt must be at least 1 character"),
  chatId: z.uuidv4("Invalid chatId format"),
})
