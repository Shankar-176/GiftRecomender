// routes/recommendations.js
import express from "express";
import Recommendation from "../models/Recommendation.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
