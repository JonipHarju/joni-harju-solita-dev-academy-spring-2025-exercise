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
<p>Made by Joni Harju for Solita Dev Academy 2025</p>
 `);
});
// error handling middleware
app.use(errorHandler);
// start the server on port 3000
app.listen(3010, () => {
  console.log("Server running on port 3010");
});
``;
