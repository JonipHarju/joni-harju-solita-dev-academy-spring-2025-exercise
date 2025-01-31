import {
  pgTable,
  integer,
  date,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const electricityData = pgTable("electricitydata", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  date: date("date").notNull(),
  startTime: timestamp("starttime", { withTimezone: false }).notNull(),
  productionAmount: numeric("productionamount", { precision: 11, scale: 5 }),
  consumptionAmount: numeric("consumptionamount", { precision: 11, scale: 3 }),
  hourlyPrice: numeric("hourlyprice", { precision: 6, scale: 3 }),
});
