import { pgTable, uuid, varchar, text, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "../auth/auth.schema.js";


// Message role enum
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);
export const chatType = pgEnum("chat_type", ["chat", "app"]);


// Chats table
export const chatsTable = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(), //agar uuid provide nhi krte ha to ye khud add kr dega

  title: varchar("title", { length: 255 }).notNull(),

  owner: uuid("owner").notNull().references(() => usersTable.id, { onDelete: "cascade" }),

  pinned: boolean("pinned").default(false).notNull(),
  type: chatType("type").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});


// Messages table
export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  role: messageRoleEnum("role").notNull(),

  content: text("content").notNull(),

  timestamp: timestamp("timestamp").defaultNow().notNull(),

  chatId: uuid("chat_id").notNull().references(() => chatsTable.id, { onDelete: "cascade" }),
});
