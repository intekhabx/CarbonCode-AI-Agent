
import { pgTable, uuid, text, pgEnum, customType, timestamp, real } from "drizzle-orm/pg-core";
import { usersTable } from "../../modules/auth/auth.schema.js";
import { messagesTable } from "../../modules/chat/chat.schema.js";


// Memory types
export const memoryTypeEnum = pgEnum("memory_type", ["factual", "episodic", "semantic", "procedural"]);

// Memory status
export const memoryStatusEnum = pgEnum("memory_status", ["active", "archived", "superseded", "deleted"]);


// pgvector custom type
const vector = customType<{ data: number[]; driverData: string; }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
  fromDriver(value) {
    return JSON.parse(value);
  },
});



export const memoriesTable = pgTable("memories", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  type: memoryTypeEnum("type").notNull(),

  content: text("content").notNull(),

  vector: vector("vector"),

  confidence: real("confidence").default(1), //reliablility of extracted information

  importance: real("importance").default(0.5), //usefullness of the memory

  status: memoryStatusEnum("status").default("active").notNull(), //memory status

  sourceMessageId: uuid("source_message_id")
    .references(() => messagesTable.id, { onDelete: "set null" }), //trace to the original message

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),

  lastAccessedAt: timestamp("last_accessed_at"), //last time fetched or used by llm
});
