import express from "express";
import electricityRoutes from "./routes/electricityRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
var cors = require("cors");

const app = express();

// allows access from any origin
app.use(cors());

// enables json parsing
app.use(express.json());

// attach the electricity routes to the "api" path
app.use("/api", electricityRoutes);

// root endpoint basic documentation
app.get("/", (req, res) => {
  res.send(`
        <h1>Electricity API</h1>
    <p>This API provides electricity production, consumption, and pricing data.</p>
    
    <h2>Available Endpoints</h2>

    <h3>Daily Statistics</h3>
    <p><strong>GET /api/daily-stats</strong> - Retrieve electricity statistics for multiple days.</p>
    <p>Supports pagination, filtering, sorting.</p>
    <ul>
      <li><strong>Pagination:</strong> ?page=1&limit=10</li>
      <li><strong>Sorting:</strong> ?orderBy=totalproduction&order=asc</li>
      <li><strong>Filtering:</strong> ?minProduction=200000&maxPrice=10</li>
    </ul>

    <h3>Single Day View</h3>
    <p><strong>GET /api/day/:date</strong> - Retrieve electricity data for a specific day.</p>
    <p>Example: <code>/api/day/2024-01-10</code></p>

    <h3>Error Handling</h3>
    <p>Invalid inputs return structured error messages.</p>
    <ul>
      <li>Invalid date: <code>{ "error": "Invalid date format. Use YYYY-MM-DD." }</code></li>
      <li>Nonexistent data: <code>{ "error": "No data found for this date." }</code></li>
      <li>Invalid number filters: <code>{ "error": "Invalid number format." }</code></li>
    </ul>

    <h3>Notes</h3>
    <p>All responses are in JSON format.</p>
    <p>Ensure query parameters are correctly formatted.</p>

    `);
});
// error handling middleware
app.use(errorHandler);
// start the server on port 3000
app.listen(3010, () => {
  console.log("Server running on port 3010");
});
``;
