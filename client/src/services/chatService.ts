import api from "./apiService";


const chatService = {
  
  callChatAgent: async({prompt, chatId}: {prompt: string, chatId: string}) => {
    const {data} = await api.post("/api/agent/chat", {prompt, chatId});
    // console.log(data);
    return data.data.result;
  },

  getAllUserChats: async () => {
    const {data} = await api.get("/api/agent/chat");
    console.log(data);
    return data.data.chats;
  },

  getUserChatById: async (chatId: string) => {
    const {data} = await api.get(`/api/agent/chat/${chatId}`);
    console.log(data);
    return data.data.chat;
  },

}


export default chatService;
