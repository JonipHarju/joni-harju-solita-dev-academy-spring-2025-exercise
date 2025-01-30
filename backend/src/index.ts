import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import dotenv from "dotenv"; // Add this!

dotenv.config();
const app = express();
const PORT = 3000;
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

const db = drizzle(
  process.env.DATABASE_URL ||
    "postgres://postgres:password@localhost:5432/postgres"
);

app.get("/test", async (req, res) => {
  try {
    console.log("inside try");
    const result = await db.execute(
      sql`SELECT * FROM electricityData LIMIT 50;`
    );
    res.json(result);
    console.log(res, "im the res");
  } catch (error: any) {
    console.log("error here sad.");
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  console.log("beep boop");
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
