import express, { Request, Response } from "express";
import { db } from "../db/connection";
import { electricityData } from "../db/schema";
import { sql, sum, avg, eq, desc, lt, asc } from "drizzle-orm";

const router = express.Router();

router.get("/first", async (req, res) => {
  try {
    const result = await db.select().from(electricityData).limit(1);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/daily-stats", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const orderByColumn = (req.query.orderBy as string) || "date";
    const orderDirection = req.query.order === "asc" ? "ASC" : "DESC";
    const searchQuery = req.query.search as string;
    const minProduction = req.query.minProduction
      ? parseFloat(req.query.minProduction as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;

    const stats = await db.execute(sql`
      SELECT
        date,
        SUM(productionamount) AS totalproduction,
        SUM(consumptionamount) AS totalconsumption,
        AVG(hourlyprice) AS avgprice
      FROM electricitydata
      ${searchQuery ? sql`WHERE date = ${searchQuery}` : sql``}
      GROUP BY date
      ${
        minProduction !== undefined
          ? sql`HAVING SUM(productionamount) >= ${minProduction}`
          : sql``
      }
      ${
        maxPrice !== undefined
          ? sql`HAVING AVG(hourlyprice) <= ${maxPrice}`
          : sql``
      }
      ORDER BY 
        ${
          orderByColumn !== "longest_negative_streak"
            ? sql.identifier(orderByColumn)
            : sql.identifier("date")
        }
        ${sql.raw(orderDirection)};
    `);

    console.log("RAW RESPONSE FROM DB:", stats.rows);

    const negativeStreaks = await db.execute(sql`
      WITH negative_price_streaks AS (
        SELECT
          date,
          starttime,
          hourlyprice,
          starttime - INTERVAL '1 hour' * ROW_NUMBER() OVER (PARTITION BY date ORDER BY starttime) AS grp
        FROM electricitydata
        WHERE hourlyprice < 0
      )
      SELECT
        date,
        MAX(COUNT(*)) OVER (PARTITION BY date) AS longest_negative_streak
      FROM negative_price_streaks
      GROUP BY date, grp;
    `);

    const streakData = negativeStreaks.rows as {
      date: string;
      longest_negative_streak: number;
    }[];
    const streakMap = new Map(
      streakData.map((row) => [row.date, row.longest_negative_streak])
    );

    let finalResult = stats.rows.map((row) => ({
      ...row,
      totalproduction: row.totalproduction
        ? parseFloat(row.totalproduction as string)
        : 0,
      totalconsumption: row.totalconsumption
        ? parseFloat(row.totalconsumption as string)
        : 0,
      avgprice: row.avgprice ? parseFloat(row.avgprice as string) : 0,
      longest_negative_streak: streakMap.get(row.date as string) || 0,
    }));

    if (orderByColumn === "longest_negative_streak") {
      finalResult = finalResult.sort((a, b) =>
        orderDirection === "ASC"
          ? a.longest_negative_streak - b.longest_negative_streak
          : b.longest_negative_streak - a.longest_negative_streak
      );
    }

    const paginatedResult = finalResult.slice(offset, offset + limit);

    res.json({
      page,
      limit,
      orderBy: orderByColumn,
      order: req.query.order,
      totalCount: finalResult.length,
      data: paginatedResult,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/day/:date", async (req: Request, res: any) => {
  try {
    const { date } = req.params;

    // Validate the date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    const stats = await db
      .select({
        totalProduction: sum(electricityData.productionAmount),
        totalConsumption: sum(electricityData.consumptionAmount),
        avgPrice: avg(electricityData.hourlyPrice),
      })
      .from(electricityData)
      .where(eq(electricityData.date, date));

    const peakConsumptionHour = await db
      .select({
        startTime: electricityData.startTime,
        consumptionProductionDiff: sql`${electricityData.consumptionAmount} - ${electricityData.productionAmount}`,
      })
      .from(electricityData)
      .where(eq(electricityData.date, date))
      .orderBy(
        desc(
          sql`${electricityData.consumptionAmount} - ${electricityData.productionAmount}`
        )
      )
      .limit(1);

    const cheapestHours = await db
      .select({
        startTime: electricityData.startTime,
        price: electricityData.hourlyPrice,
      })
      .from(electricityData)
      .where(eq(electricityData.date, date))
      .orderBy(asc(electricityData.hourlyPrice))
      .limit(1); // This gets the cheapest hour. Although there could be multiple hours with the same low price, but in this case just he first one is returned.

    // Merge all data into a single response
    res.json({
      date,
      totalProduction: stats[0]?.totalProduction
        ? parseFloat(stats[0].totalProduction as string)
        : 0,
      totalConsumption: stats[0]?.totalConsumption
        ? parseFloat(stats[0].totalConsumption as string)
        : 0,
      avgPrice: stats[0]?.avgPrice
        ? parseFloat(stats[0].avgPrice as string)
        : 0,
      peakConsumptionHour: peakConsumptionHour[0]
        ? {
            startTime: peakConsumptionHour[0].startTime,
            consumptionProductionDiff: peakConsumptionHour[0]
              .consumptionProductionDiff
              ? parseFloat(
                  peakConsumptionHour[0].consumptionProductionDiff as string
                )
              : 0,
          }
        : null,
      cheapestHour: cheapestHours[0]
        ? {
            startTime: cheapestHours[0].startTime,
            price: cheapestHours[0].price
              ? parseFloat(cheapestHours[0].price as string)
              : 0,
          }
        : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
