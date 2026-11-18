import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../config/env.js';
import {Pool} from "pg";

const pool: Pool = new Pool({
  connectionString: env.DATABASE_URL,
  // ssl: true,
});

const db = drizzle({client: pool});

export default db;
