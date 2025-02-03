import { useState, useEffect } from "react";
import { buildQueryParams, getDailyStats } from "../lib/utils";

export const useDailyStats = (
  appliedFilters,
  page,
  orderBy,
  order,
  limit = 10
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const queryParams = buildQueryParams({
        page,
        limit,
        orderBy,
        order,
        ...appliedFilters,
      });
      const result = await getDailyStats(`?${queryParams}`);
      setData(result.rows || result.data || result);
      setLoading(false);
    };

    fetchData();
  }, [appliedFilters, page, orderBy, order]);

  return { data, loading };
};
