export async function getDailyStats(query: string) {
  try {
    const result = await fetch(
      `http://localhost:3000/api/daily-stats${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    const data = await result.json();
    // Expect the API to return an object with { data: [...], total: number }
    return data;
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    return { data: [], total: 0 };
  }
}

export async function getDayDetails(date: string) {
  try {
    const result = await fetch(`http://localhost:3000/api/day/${date}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    return await result.json();
  } catch (error) {
    console.error("Error fetching day details:", error);
    return null;
  }
}

export function formatNumber(
  value: number | string | null,
  decimals: number = 2
): string {
  if (value === null) return "N/A";
  const num = Number(value);
  if (isNaN(num)) return "N/A";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatConsumption(value: number | string | null): string {
  if (value === null) return "N/A";
  const num = Number(value);
  if (isNaN(num)) return "N/A";
  if (num >= 1_000_000_000) {
    return (
      (num / 1_000_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + "B"
    );
  }
  if (num >= 1_000_000) {
    return (
      (num / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + "M"
    );
  }
  if (num >= 1_000) {
    return (
      (num / 1_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) +
      "k"
    );
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const buildQueryParams = (
  params: Record<string, string | number | undefined>
) => {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = value?.toString();
        return acc;
      }, {} as Record<string, string>)
  ).toString();
};

export const calculateDomain = (
  data: any[],
  key: string,
  allowNegative: boolean = false
) => {
  // Extract values from data
  const values = data.map((item) => item[key]);
  //find min and max values
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Calculate 10% padding dynamically so that the chart is not too close to the edges
  const padding = (max - min) * 0.1;
  // If negative values are allowed, set the domain minimum to the minimum value minus padding
  // If negative values are not allowed, set the domain minimum to 0 or the minimum value minus padding, whichever is greater
  const domainMin = allowNegative ? min - padding : Math.max(0, min - padding);
  // Set the domain maximum to the maximum value plus padding
  const domainMax = max + padding;
  return [domainMin, domainMax];
};
