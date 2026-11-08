
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";



export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);


export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    password: text("password"),

    salt: text("salt"),

    profileUrl: text("profile_url"),

    googleId: varchar("google_id", { length: 255 }).unique(),

    githubId: varchar("github_id", { length: 255 }).unique(),

    role: userRoleEnum("role").default("user").notNull(),

    refreshToken: text("refresh_token"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
);
