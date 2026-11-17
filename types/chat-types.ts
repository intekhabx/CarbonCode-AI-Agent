
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chatId?: string;
};


export type Chat = {
  id: string;
  title: string;
  pinned: boolean;
  type: "app" | "chat";
  createdAt: Date;
  updatedAt: Date;
  owner: string;
};


export type ChatWithMessages = {
  id: string;
  title: string;
  pinned: boolean;
  type: "app" | "chat";
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  messages: Message[];
};


