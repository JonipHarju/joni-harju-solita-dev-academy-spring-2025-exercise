import { Request } from "express";
import { getNumberParam, getStringParam } from "../lib/utils";
import { QueryParamsDailyStats } from "../interfaces";

export const validateDailyStatsQuery = (
  req: Request<{}, {}, {}, QueryParamsDailyStats>
) => {
  const page = getNumberParam(req.query.page, parseInt) ?? 1;
  const limit = getNumberParam(req.query.limit, parseInt) ?? 10;
  const searchQuery = getStringParam(req.query.search);

  const minProduction = getNumberParam(req.query.minProduction, parseFloat);
  const maxProduction = getNumberParam(req.query.maxProduction, parseFloat);
  const minConsumption = getNumberParam(req.query.minConsumption, parseFloat);
  const maxConsumption = getNumberParam(req.query.maxConsumption, parseFloat);
  const minPrice = getNumberParam(req.query.minPrice, parseFloat);
  const maxPrice = getNumberParam(req.query.maxPrice, parseFloat);
  const minNegativeStreak = getNumberParam(
    req.query.minNegativeStreak,
    parseInt
  );
  const maxNegativeStreak = getNumberParam(
    req.query.maxNegativeStreak,
    parseInt
  );

  const orderByColumn = getStringParam(req.query.orderBy) ?? "date";
  const orderDirection: "ASC" | "DESC" =
    req.query.order === "asc" ? "ASC" : "DESC";

  // Validate numbers
  const isValidNumber = (value: any) => value === undefined || !isNaN(value);
  if (
    !isValidNumber(minProduction) ||
    !isValidNumber(maxProduction) ||
    !isValidNumber(minConsumption) ||
    !isValidNumber(maxConsumption) ||
    !isValidNumber(minPrice) ||
    !isValidNumber(maxPrice) ||
    !isValidNumber(minNegativeStreak) ||
    !isValidNumber(maxNegativeStreak)
  ) {
    throw new Error("Invalid number format in query parameters.");
  }

  return {
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
  };
};
