import { HourlyData } from "../interfaces";

// Formats a number or string into a localized string with a fixed number of decimals.
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

// Builds a URL query string by joining the applied filters and values to a url
export const buildQueryParams = (
  params: Record<string, string | number | undefined>
) => {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined) // remove undefined values ignoring the key
      .reduce((acc, [key, value]) => {
        acc[key] = value !== undefined ? String(value) : ""; // Ensure value is always a string
        return acc;
      }, {} as Record<string, string>)
  ).toString();
};

// Calculates the y-axis domain for a graphs based on the data values. makes sure the displayed data is not too close to the edges of the graph or out of it.
export const calculateDomain = (
  data: HourlyData[],
  key: keyof HourlyData,
  allowNegative: boolean = false
) => {
  const values = data.map((item) => parseFloat(item[key]) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;
  const domainMin = allowNegative ? min - padding : Math.max(0, min - padding);
  const domainMax = max + padding;
  return [domainMin, domainMax];
};

// takes a timestamp (yyyy-mm-ddThh:mm:ss) and returns the hour and minutes
export function formatHour(time: string): string {
  return time.slice(11, 16);
}
// cleans a string input and converts it to a number
export function cleanToNumber(value: string | undefined): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = parseFloat(value.replace(/,/g, "")); // Remove commas and parse
  return isNaN(num) ? undefined : num;
}
