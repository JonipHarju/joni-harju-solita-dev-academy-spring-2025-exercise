import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/electricity";
import { config } from "./env";

// setup a database connection  using pg and drizzle

const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
});

// event listener for database errors
pool.on("error", (err) => {
  console.error("Database error", err);
});

export const db = drizzle(pool, { schema });
