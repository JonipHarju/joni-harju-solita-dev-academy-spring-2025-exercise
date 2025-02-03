import { NextFunction, Request, Response } from "express";
import {
  getDailyStats,
  getDayStats,
  getPeakConsumptionHour,
  getCheapestHour,
  getHourlyData,
} from "../services/electricityService";

// fetches daily stats for multiple days. supports pagination, filtering, sorting and searching by date
export const fetchDailyStats = async (
  req: Request,
  res: any,
  next: NextFunction
) => {
  try {
    // pagination parameters from the query.
    const page = Math.max(parseInt(req.query.page as string) || 1, 1); // math.max avoids negative page numbers and just returns the first page
    const limit = parseInt(req.query.limit as string) || 10; // default page limit to 10
    const searchQuery = req.query.search as string;

    // extract filtering parameters from the query
    const minProduction = req.query.minProduction
      ? parseFloat(req.query.minProduction as string)
      : undefined;
    const maxProduction = req.query.maxProduction
      ? parseFloat(req.query.maxProduction as string)
      : undefined;
    const minConsumption = req.query.minConsumption
      ? parseFloat(req.query.minConsumption as string)
      : undefined;
    const maxConsumption = req.query.maxConsumption
      ? parseFloat(req.query.maxConsumption as string)
      : undefined;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;
    const minNegativeStreak = req.query.minNegativeStreak
      ? parseInt(req.query.minNegativeStreak as string)
      : undefined;
    const maxNegativeStreak = req.query.maxNegativeStreak
      ? parseInt(req.query.maxNegativeStreak as string)
      : undefined;

    // sorting options
    const orderByColumn = (req.query.orderBy as string) || "date";
    const orderDirection = req.query.order === "asc" ? "ASC" : "DESC";

    // validate the number query parameters
    const validateNumber = (value: any) =>
      value !== undefined && isNaN(value) ? false : true;

    if (
      !validateNumber(minProduction) ||
      !validateNumber(maxProduction) ||
      !validateNumber(minConsumption) ||
      !validateNumber(maxConsumption) ||
      !validateNumber(minPrice) ||
      !validateNumber(maxPrice) ||
      !validateNumber(minNegativeStreak) ||
      !validateNumber(maxNegativeStreak)
    ) {
      return res.status(400).json({ error: "Invalid number format." });
    }

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

    console.log(stats);
    res.json(stats);
  } catch (error: any) {
    next(error);
  }
};

// fetches  statistic for a given date.
export const fetchDayStats = async (
  req: Request,
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
