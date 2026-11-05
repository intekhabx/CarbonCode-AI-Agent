import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../config/env.js';


// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: env.DATABASE_URL,
    // ssl: true
  }
});

export default db;
