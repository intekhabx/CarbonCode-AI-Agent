import { callChatAgentLLM } from "../../agent/chat-agent/agent.js";
import { addUserOrAgentMessageInChat, findOrCreateNewChat, getUserShortTermChatContext } from "../../modules/chat/chat.controller.js";
import inngest from "../client.js";

export const chatAgentFunction = inngest.createFunction(
  {
    id: "chat-agent",
    retries: 3,
    triggers: [{event: "call.chat.agent"}]
  },
  async ({event, step}) => {
    // destructuring the event to get the payload that is comming when this fnc is triggered
    const {userId, chatId, title, prompt} = event.data;

    // step1
    const chat = await step.run("find-or-create-newchat", async () => {
      return await findOrCreateNewChat({userId, chatId, title});
    })

    // step2
    const history = await step.run("get-short-term-chat-history", async () => {
      return await getUserShortTermChatContext(chat.id);
    })

    // we are conveting the timestamp's datatype into Date because when we return data from inngest step Date becomes string (so we reconvert into Date)
    const formattedHistory = history.map((message) => {
      return {
        ...message,
        timestamp: new Date(message.timestamp),
      }
    });

    // step3
    const message = await step.run("add-user-message-in-chat", async () => {
      return await addUserOrAgentMessageInChat({chatId: chat.id, content: prompt, role: "user"});
    });

    // step4
    const result = await step.run("call-chat-agent-llm", async () => {
      return await callChatAgentLLM(prompt, formattedHistory);
    })

    if(!result){
      throw new Error("Hllo Err")
    }

    // step5
    await step.run("add-agent-response-in-chat", async () => {
      await addUserOrAgentMessageInChat({chatId: chat.id, content: result, role: "assistant"});
    })

    return { result }
  }
)
