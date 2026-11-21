import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import chatService from "../services/chatService";
import type {Chat, ChatWithMessages, Message} from "@repo/types/index";
import {v4 as randomId} from "uuid";


export function useChatAgent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: chatService.callChatAgent,

    // runs when the query is pending
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

    // runs when the query is success
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

    // always runs either success or fail
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



export function useTogglePinnedChat() {
  const queryClient = useQueryClient();

  // onMutate is called before the mutation function is fired and is used to optimistically update the cache data
  const mutation = useMutation({
    mutationFn: (chatId: string) => chatService.togglePinnedUserChat(chatId),

    onMutate: async (chatId) => {
      // if any of the queries are pending, cancel them 
      await Promise.all([
        queryClient.cancelQueries({queryKey: ["chats"]}),
        queryClient.cancelQueries({queryKey: ["chat", chatId]}),
      ]);

      // and get the previous data from the cache
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);
      const previousChat = queryClient.getQueryData<ChatWithMessages>(["chat", chatId]);

      // optimistically update the cache data to reflect the new pinned state
      queryClient.setQueryData<Chat[]>(["chats"], (chats) =>
        chats?.map((chat) =>
          chat.id === chatId ? {...chat, pinned: !chat.pinned} : chat
        )
      );

      queryClient.setQueryData<ChatWithMessages>(["chat", chatId], (chat) =>
        chat ? {...chat, pinned: !chat.pinned} : chat
      );

      // the returned data is accessible in the onError, onSettled, onSuccess callback as context,
      return {previousChats, previousChat};
    },

    onSuccess: (chat, chatId) => {
      queryClient.setQueryData<Chat[]>(["chats"], (chats) =>
        chats?.map((item) => item.id === chatId ? {...item, pinned: chat.pinned} : item)
      );

      queryClient.setQueryData<ChatWithMessages>(["chat", chatId], (currentChat) =>
        currentChat ? {...currentChat, pinned: chat.pinned} : currentChat
      );
    },

    // runs when the query fails, and is used to rollback the cache data to the previous state
    // the context parameter is the data returned from onMutate
    onError: (_error, chatId, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
      if (context?.previousChat) {
        queryClient.setQueryData(["chat", chatId], context.previousChat);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["chats"]});
    }
  });

  return mutation;
}



export function useDeleteChat() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (chatId: string) => chatService.deleteUserChatById(chatId),

    onMutate: async (chatId) => {
      // cancel chat pending request of chat and chats
      await Promise.all([
        queryClient.cancelQueries({queryKey: ["chats"]}),
        queryClient.cancelQueries({queryKey: ["chat", chatId]}),
      ])

      // get the old data so we return that data and it is accessible in onSuccess, onError, onSettled
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);
      const previousChat = queryClient.getQueryData<ChatWithMessages>(["chat", chatId]);

      queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
        return chats?.filter((chat) => chat.id !== chatId);
      })

      // this data is accessed in context of onError, onSuccess, onSettled
      return {previousChats, previousChat}
    },

    onError: (_error, chatId, context) => {
      if (context?.previousChats !== undefined) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
      if (context?.previousChat !== undefined) {
        queryClient.setQueryData(["chat", chatId], context.previousChat);
      }
    },

    onSuccess: (_data, chatId) => {
      // Only remove the single-chat cache once deletion actually succeeded
      queryClient.removeQueries({ queryKey: ["chat", chatId] });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  })

  return mutation;
}
