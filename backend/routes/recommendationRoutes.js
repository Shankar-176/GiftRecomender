import express from "express";
import Recommendation from "../models/Recommendation.js";

const router = express.Router();

// GET recommendations with session filtering
router.get("/", async (req, res) => {
  try {
    const allRecommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(8); // Limit to latest 8

    res.status(200).json(allRecommendations);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ 
      message: "Error fetching recommendations",
      error: error.message 
    });
  }
});

export default router;