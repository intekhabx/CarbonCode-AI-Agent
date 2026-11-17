import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import chatService from "../services/chatService";
import type {Chat, ChatWithMessages, Message} from "../../../types/chat-types.js";
import {v4 as randomId} from "uuid";


export function useChatAgent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: chatService.callChatAgent,

    onMutate: async ({prompt, chatId}) => {

      await queryClient.cancelQueries({queryKey: ["chat", chatId]});

      const previousChat = queryClient.getQueryData(["chat", chatId]);

      const userMessage: Message = {id: randomId(), content: prompt, role: "user", timestamp: new Date()};

      queryClient.setQueryData<ChatWithMessages>(["chat", chatId], (prev) => {
        if(!prev) {
          return {
            id: randomId(),
            title: prompt.slice(0, 30),
            pinned: false,
            type: "chat",
            createdAt: new Date(),
            updatedAt: new Date(),
            owner: "",
            messages: [userMessage]
          }
        }

        return {
          ...prev,
          messages: [...prev.messages, userMessage]
        }
      })

      return {previousChat}
    },

    onSuccess: (result, params) => {
      console.log(result);
      const assistantMessage: Message = {id: randomId(), content: result, role: "assistant", timestamp: new Date()};

      queryClient.setQueryData<ChatWithMessages>(["chat", params.chatId], (prev)=> {
        if(!prev) return;

        return {
          ...prev,
          messages: [...prev.messages, assistantMessage]
        }
      })
    },

    onSettled: (_data, _error) => {
      queryClient.invalidateQueries({queryKey: ["chats"] });
    },

  });

  return mutation;
}




export function useGetAllChats(enabled: boolean = true) {
  const query = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: chatService.getAllUserChats,

    enabled: enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return query;
}





export function useGetChatById(chatId: string, enabled: boolean = true) {
  const query = useQuery<ChatWithMessages>({
    queryKey: ["chat", chatId],
    queryFn: () => chatService.getUserChatById(chatId),

    retry: false,
    enabled: enabled && Boolean(chatId),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    isPending: query.isPending,
    chat: query.data,
    messages: query.data?.messages,
  };
}
