CREATE TYPE "message_role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"owner" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"chat_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_owner_users_id_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE;