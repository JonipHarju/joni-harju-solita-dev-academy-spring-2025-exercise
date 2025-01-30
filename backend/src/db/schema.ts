import {
  pgTable,
  integer,
  date,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const electricityData = pgTable("electricity", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  date: date("date").notNull(),
  startTime: timestamp("startTime", { withTimezone: false }).notNull(),
  productionAmount: numeric("productionAmount", { precision: 11, scale: 5 }),
  consumptionAmount: numeric("consumptionAmount", { precision: 11, scale: 3 }),
  hourlyPrice: numeric("hourlyPrice", { precision: 6, scale: 3 }),
});
