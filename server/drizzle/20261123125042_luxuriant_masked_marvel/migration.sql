CREATE TYPE "memory_status" AS ENUM('active', 'archived', 'superseded', 'deleted');--> statement-breakpoint
CREATE TYPE "memory_type" AS ENUM('factual', 'episodic', 'semantic', 'procedural');--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" "memory_type" NOT NULL,
	"content" text NOT NULL,
	"vector" vector(1536),
	"confidence" real DEFAULT 1,
	"importance" real DEFAULT 0.5,
	"status" "memory_status" DEFAULT 'active'::"memory_status" NOT NULL,
	"source_message_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_source_message_id_messages_id_fkey" FOREIGN KEY ("source_message_id") REFERENCES "messages"("id") ON DELETE SET NULL;