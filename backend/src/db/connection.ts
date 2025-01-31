import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

// Creates a new pool of connections. Works like a cache of connections.
// so that new connections are not created every time a query is made
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

// event listener for database errors.
pool.on("error", (err) => {
  console.error("Database error", err);
});

export const db = drizzle(pool, { schema });
