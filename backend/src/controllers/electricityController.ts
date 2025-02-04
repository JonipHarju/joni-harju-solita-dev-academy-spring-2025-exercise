import { NextFunction, Request, Response } from "express";
import {
  getDailyStats,
  getDayStats,
  getPeakConsumptionHour,
  getCheapestHour,
  getHourlyData,
} from "../services/electricityService";
import { QueryParamsDailyStats, QueryParamsDayStats } from "../interfaces";
import { validateDailyStatsQuery } from "../validators/validateDailyStats";
// Define the expected query parameters

// fetches daily stats for multiple days. supports pagination, filtering, sorting and searching by date
export const fetchDailyStats = async (
  req: Request<{}, {}, {}, QueryParamsDailyStats>,
  res: any,
  next: NextFunction
) => {
  try {
    const {
      page,
      limit,
      searchQuery,
      minProduction,
      maxProduction,
      minConsumption,
      maxConsumption,
      minPrice,
      maxPrice,
      minNegativeStreak,
      maxNegativeStreak,
      orderByColumn,
      orderDirection,
    } = validateDailyStatsQuery(req);

    // fetch all daily stats based on the query parameters
    const stats = await getDailyStats(
      page,
      limit,
      searchQuery,
      minProduction,
      maxProduction,
      minConsumption,
      maxConsumption,
      minPrice,
      maxPrice,
      minNegativeStreak,
      maxNegativeStreak,
      orderByColumn,
      orderDirection
    );

    res.json(stats);
  } catch (error: any) {
    next(error);
  }
};

// fetches  statistic for a given date.
export const fetchDayStats = async (
  req: Request<QueryParamsDayStats>,
  res: any,
  next: NextFunction
) => {
  try {
    // get the date parameter from the url
    const { date } = req.params;

    // validate for the correct date format. (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    // fetch the daily stats for the given date
    const stats = await getDayStats(date);
    const peakHour = await getPeakConsumptionHour(date);
    const cheapestHour = await getCheapestHour(date);
    const hourlyData = await getHourlyData(date);

    // return an error if no data is found for the given date
    if (
      !stats[0]?.totalProduction &&
      !stats[0]?.totalConsumption &&
      !stats[0]?.avgPrice
    ) {
      return res.status(404).json({ error: "No data found for this date." });
    }

    // response with the formatted data
    res.json({
      date,
      totalProduction: stats[0]?.totalProduction || 0,
      totalConsumption: stats[0]?.totalConsumption || 0,
      avgPrice: stats[0]?.avgPrice || 0,
      peakConsumptionHour: peakHour[0] || null,
      cheapestHour: cheapestHour[0] || null,
      hourlyData,
    });
  } catch (error: any) {
    next(error);
  }
};
