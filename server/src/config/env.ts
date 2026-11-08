// src/config/env.ts
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8000),

  // CORS ke liye frontend ka URL (comma se alag karke kai URL de sakte ho)
  CLIENT_URL: z.string().default("http://localhost:5173"),

  DATABASE_URL: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("900"), //15m
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default("604800"), //7d


  GEMINI_BASE_URL: z.url().default("https://generativelanguage.googleapis.com/v1beta/openai/"),
  MAIN_LLM_API_KEY: z.string(),
  MAIN_LLM_MODEL: z.string().default("gemini-2.5-flash"),
});


const parsed = envSchema.safeParse(process.env);


if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}



export const env = parsed.data;

// Type bhi export kar do, kisi function me config pass karna ho to kaam aayega
export type Env = z.infer<typeof envSchema>;

// Helper: CLIENT_URL ko array me badalta hai (CORS origin ke liye)
export const clientOrigins = env.CLIENT_URL.split(",").map((u) => u.trim());