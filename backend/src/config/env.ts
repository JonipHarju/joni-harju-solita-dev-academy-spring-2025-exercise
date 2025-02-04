import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3010,
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://academy:academy@localhost:5432/electricity",
};
