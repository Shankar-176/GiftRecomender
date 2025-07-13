import express from "express";
import { generateGiftIdeas } from "./routes/api.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
    try {
      const suggestions = await generateGiftIdeas(req.body);
      res.json({ success: true, suggestions });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
    export default router;  