CREATE TYPE "chat_type" AS ENUM('chat', 'app');--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "type" "chat_type" NOT NULL;