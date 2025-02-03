import express from "express";
import {
  fetchDailyStats,
  fetchDayStats,
} from "../controllers/electricityController";

const router = express.Router();
// fetches daily statistics for multiple days
router.get("/daily-stats", fetchDailyStats);

// fetches data for a specific day
router.get("/day/:date", fetchDayStats);

export default router;
