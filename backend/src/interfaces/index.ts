export interface QueryParamsDailyStats {
  page?: string;
  limit?: string;
  search?: string;
  minProduction?: string;
  maxProduction?: string;
  minConsumption?: string;
  maxConsumption?: string;
  minPrice?: string;
  maxPrice?: string;
  minNegativeStreak?: string;
  maxNegativeStreak?: string;
  orderBy?: string;
  order?: string;
}

export interface QueryParamsDayStats {
  date: string;
}
