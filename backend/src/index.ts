import express from "express";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
import electricityRoutes from "./routes/electricityRoutes";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// forward all requests starting with /api to electricityRoutes
app.use("/api", electricityRoutes);

app.get("/", (req, res) => {
  console.log("beep boop");
  res.send(`
<h1>Electricity Data API</h1>
<p>This API provides electricity production, consumption, and pricing data.</p>

<h2>Available API Routes:</h2>
<ul>
  <li><strong>GET /api/daily-stats</strong> - Get daily electricity statistics.</li>
  <ul>
    <li>Supports pagination via <code>?page=&lt;number&gt;&limit=&lt;number&gt;</code></li>
    <li>Supports ordering via <code>?orderBy=&lt;column&gt;&order=asc/desc</code></li>
    <li>Supports filtering:
      <ul>
        <li>By date: <code>?search=YYYY-MM-DD</code></li>
        <li>By minimum production: <code>?minProduction=&lt;value&gt;</code></li>
        <li>By maximum average price: <code>?maxPrice=&lt;value&gt;</code></li>
      </ul>
    </li>
    <li>Includes:
      <ul>
        <li>Total electricity production per day</li>
        <li>Total electricity consumption per day</li>
        <li>Average electricity price per day</li>
        <li>Longest consecutive time in hours when electricity price was negative per day</li>
      </ul>
    </li>
  </ul>
  
  <li><strong>GET /api/day/:date</strong> - Get electricity data for a specific day.</li>
  <ul>
    <li>Returns:
      <ul>
        <li>Total electricity production</li>
        <li>Total electricity consumption</li>
        <li>Average electricity price</li>
        <li>Hour with the highest consumption-to-production difference</li>
        <li>Cheapest electricity hour of the day</li>
      </ul>
    </li>
  </ul>
</ul>

  `);
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
