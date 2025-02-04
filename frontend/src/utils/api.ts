const backendUrl = process.env.BACKEND_URL || "http://localhost:3010";

export async function getDailyStats(query: string) {
  try {
    const result = await fetch(`${backendUrl}/api/daily-stats${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    return { data: [], total: 0 };
  }
}

export async function getDayDetails(date: string) {
  try {
    const result = await fetch(`${backendUrl}/api/day/${date}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
