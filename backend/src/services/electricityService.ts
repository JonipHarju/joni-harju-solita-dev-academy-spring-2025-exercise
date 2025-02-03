import { db } from "../config/db";
import { electricityData } from "../models/electricity";
import { sql, sum, avg, eq, desc, asc } from "drizzle-orm";

//Fetches daily electricity statistics with optional filtering, pagination, and sorting.
export const getDailyStats = async (
  page: number = 1,
  limit: number = 10,
  searchQuery?: string,
  minProduction?: number,
  maxProduction?: number,
  minConsumption?: number,
  maxConsumption?: number,
  minPrice?: number,
  maxPrice?: number,
  minNegativeStreak?: number,
  maxNegativeStreak?: number,
  orderByColumn: string = "date",
  orderDirection: "ASC" | "DESC" = "DESC"
) => {
  const offset = (page - 1) * limit; // pagination offset

  /**
   * Overview of the query:
   *
   * 1. **Identify consecutive negative price streaks (`negative_price_streaks`)**
   *    - Selects electricity price (`hourlyprice`) where the price is negative (`hourlyprice < 0`).
   *    - Uses `ROW_NUMBER()` to track each row's position within its date group.
   *    - Subtracts the row number multiplied by 1 hour from the `starttime` to create a "group" identifier for consecutive negative price periods.
   *    - Example:
   *
   *       starttime         | hourlyprice | ROW_NUMBER() | Adjusted Time
   *       ------------------|------------|-------------|------------------
   *        2024-01-01 10:00 | -5.00       | 1           | 2024-01-01 09:00
   *        2024-01-01 11:00 | -3.00       | 2           | 2024-01-01 09:00
   *        2024-01-01 12:00 | -1.00       | 3           | 2024-01-01 09:00
   *        2024-01-01 14:00 | -2.00       | 4           | 2024-01-01 10:00  <-- (gap creates new group)
   *        2024-01-01 15:00 | -4.00       | 5           | 2024-01-01 10:00
   *       ------------------|------------|-------------|------------------
   *    - This helps in detecting streaks of negative prices occurring across multiple hours.
   *
   * 2. **Count the number of hours in each negative price streak (`streak_counts`)**
   *    - Groups the previous result (`negative_price_streaks`) by `date` and the generated group identifier.
   *    - Counts the number of consecutive hours where the price is negative for each streak.
   *
   * 3. **Aggregate the daily electricity statistics (`e`)**
   *    - Calculates:
   *      - `SUM(productionamount)`: Total electricity production per day.
   *      - `SUM(consumptionamount)`: Total electricity consumption per day.
   *      - `AVG(hourlyprice)`: Average electricity price per day.
   *
   * 4. **Join with the negative price streaks data**
   *    - Uses a `LEFT JOIN` to merge daily electricity statistics with the maximum negative price streak per day.
   *    - Ensures that days without any negative price streaks get a default value (`COALESCE(MAX(s.negative_hours), 0)`).
   *
   * 5. **Apply filtering conditions dynamically based on user input**
   *    - Filters out rows where the aggregated statistics do not meet the provided filter criteria:
   *      - `minProduction`, `maxProduction`
   *      - `minConsumption`, `maxConsumption`
   *      - `minPrice`, `maxPrice`
   *      - `minNegativeStreak`, `maxNegativeStreak`
   *
   * 6. **Group the results by date**
   *    - Ensures each row represents a single date with aggregated electricity data.
   *
   * 7. **Apply additional filters**
   *    - Filters the data further using SQL `HAVING` for constraints on sums, averages, and streak calculations.
   *
   * 8. **Pagination and sorting**
   *    - Orders results by `orderByColumn` (default is `date`).
   *    - Sorts ascending (`ASC`) or descending (`DESC`) as per request.
   *    - Uses `LIMIT` and `OFFSET` for pagination to return only the requested amount of data.
   */
  return db.execute(sql`
    WITH negative_price_streaks AS (
      SELECT
        date,
        starttime,
        hourlyprice,
        starttime - INTERVAL '1 hour' * ROW_NUMBER() OVER (PARTITION BY date ORDER BY starttime) AS grp
      FROM electricitydata
      WHERE hourlyprice < 0
    ),
    streak_counts AS (
      SELECT
        date,
        COUNT(*) AS negative_hours
      FROM negative_price_streaks
      GROUP BY date, grp
    )
    SELECT
      e.date,
      COALESCE(SUM(e.productionamount), 0) AS totalproduction,
      SUM(e.consumptionamount) AS totalconsumption,
      COALESCE(AVG(e.hourlyprice), 0) AS avgprice,
      COALESCE(MAX(s.negative_hours), 0) AS longestnegativestreak
    FROM electricitydata e
LEFT JOIN (
  SELECT date, MAX(negative_hours) AS negative_hours
  FROM streak_counts
  GROUP BY date
) s ON e.date = s.date
    WHERE 1=1
      ${searchQuery ? sql`AND e.date = ${searchQuery}` : sql``}
    GROUP BY e.date
    HAVING
      ${
        minProduction !== undefined
          ? sql`SUM(e.productionamount) >= ${minProduction} AND`
          : sql``
      }
      ${
        maxProduction !== undefined
          ? sql`SUM(e.productionamount) <= ${maxProduction} AND`
          : sql``
      }
      ${
        minConsumption !== undefined
          ? sql`SUM(e.consumptionamount) >= ${minConsumption} AND`
          : sql``
      }
      ${
        maxConsumption !== undefined
          ? sql`SUM(e.consumptionamount) <= ${maxConsumption} AND`
          : sql``
      }
      ${
        minPrice !== undefined
          ? sql`AVG(e.hourlyprice) >= ${minPrice} AND`
          : sql``
      }
      ${
        maxPrice !== undefined
          ? sql`AVG(e.hourlyprice) <= ${maxPrice} AND`
          : sql``
      }
      ${
        minNegativeStreak !== undefined
          ? sql`COALESCE(MAX(s.negative_hours), 0) >= ${minNegativeStreak} AND`
          : sql``
      }
      ${
        maxNegativeStreak !== undefined
          ? sql`COALESCE(MAX(s.negative_hours), 0) <= ${maxNegativeStreak} AND`
          : sql``
      }
      1=1
    ORDER BY ${sql.identifier(orderByColumn)} ${sql.raw(
    orderDirection
  )} NULLS LAST
    LIMIT ${limit} OFFSET ${offset};
  `);
};

// Fetches daily electricity statistics for a specific date.
export const getDayStats = async (date: string) => {
  return db
    .select({
      totalProduction: sum(electricityData.productionAmount),
      totalConsumption: sum(electricityData.consumptionAmount),
      avgPrice: avg(electricityData.hourlyPrice),
    })
    .from(electricityData)
    .where(eq(electricityData.date, date));
};
// query the peak consumption hour of the day.
export const getPeakConsumptionHour = async (date: string) => {
  return db
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
};

// query the cheapest hour of the day.
// sort the day by hourly price in ascending order and return the first row(cheapest hour)
export const getCheapestHour = async (date: string) => {
  return db
    .select({
      startTime: electricityData.startTime,
      price: electricityData.hourlyPrice,
    })
    .from(electricityData)
    .where(eq(electricityData.date, date))
    .orderBy(asc(electricityData.hourlyPrice))
    .limit(1);
};

// get hour by hour data for a date. used for the day view graphs
export const getHourlyData = async (date: string) => {
  return db
    .select({
      startTime: electricityData.startTime,
      productionAmount: electricityData.productionAmount,
      consumptionAmount: electricityData.consumptionAmount,
      hourlyPrice: electricityData.hourlyPrice,
    })
    .from(electricityData)
    .where(eq(electricityData.date, date))
    .orderBy(electricityData.startTime); // Ensure proper order
};
