import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "./db.js";
import Recommendation from "./models/Recommendation.js";
import ChatMessage from "./models/Chat.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced validation middleware for recommendations
const validateRequest = (req, res, next) => {
  const requiredFields = [
    'relationship', 'ageGroup', 'gender', 
    'occasion', 'interests', 'priceRange', 'giftType'
  ];
  
  const missing = requiredFields.filter(field => !req.body[field]);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missing.join(', ')}`
    });
  }
  next();
};

// Original recommendation endpoint (updated to use Gemini)
app.post("/api/generate", validateRequest, async (req, res) => {
  try {
    const prompt = `You are a professional gift recommendation expert. Based on the following criteria, provide exactly 6 detailed gift recommendations in JSON format.

CRITERIA:
- Relationship: ${req.body.relationship}
- Age Group: ${req.body.ageGroup}
- Gender: ${req.body.gender}
- Occasion: ${req.body.occasion}
- Interests: ${req.body.interests}
- Price Range: ${req.body.priceRange}
- Gift Type: ${req.body.giftType}

INSTRUCTIONS:
1. Consider the recipient's interests, age, and relationship carefully
2. Stay within the specified price range
3. Provide practical and thoughtful recommendations
4. Include popular shopping platforms available in India
5. Generate realistic search URLs or product links

Respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    {
      "gift_name": "Specific Gift Name",
      "description": "Detailed description explaining why this is perfect for them",
      "price_range": "₹X - ₹Y",
      "platform": "Amazon/Flipkart/Myntra/etc",
      "product_image": "Product description or image URL",
      "search_url": "Direct search link or product URL"
    }
  ]
}`;

    // Use Gemini for gift recommendations too
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    let content = result.response.text();

    let recommendations = [];

    try {
      content = content
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(content);
      
      if (!Array.isArray(parsed.recommendations)) {
        throw new Error("Invalid recommendations array structure");
      }

      // Validate recommendations structure
      recommendations = parsed.recommendations.filter(rec => 
        rec.gift_name && rec.search_url && rec.platform
      );

      if (recommendations.length === 0) {
        throw new Error("No valid recommendations in response");
      }

      // Save to database
      const savedRecs = await Recommendation.insertMany(recommendations);
      console.log("✅ Saved recommendations:", savedRecs);

      res.json({
        success: true,
        recommendations: savedRecs.map(rec => ({
          gift_name: rec.gift_name,
          description: rec.description,
          price_range: rec.price_range,
          platform: rec.platform,
          product_image: rec.product_image,
          search_url: rec.search_url,
          _id: rec._id
        }))
      });

    } catch (parseError) {
      console.error("❌ Parsing failed:", parseError.message);
      console.debug("Raw AI content:", content);
      res.status(500).json({
        success: false,
        error: "Failed to process recommendations",
        details: parseError.message
      });
    }
  } catch (error) {
    console.error("🚨 Server error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ================== NEW AI CHAT ASSISTANT ENDPOINTS ==================

// Get chat history for a session
app.get("/api/chat/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await ChatMessage.find({ session_id: sessionId })
      .sort({ timestamp: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      messages: messages.map(msg => ({
        id: msg._id,
        message: msg.message,
        sender: msg.sender,
        timestamp: msg.timestamp,
        gift_context: msg.gift_context
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat history"
    });
  }
});

// AI Chat Assistant endpoint
app.post("/api/chat/message", async (req, res) => {
  try {
    const { sessionId, userId, message } = req.body;

    if (!sessionId || !userId || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sessionId, userId, message"
      });
    }

    // Save user message to database
    const userMessage = new ChatMessage({
      session_id: sessionId,
      user_id: userId,
      message: message,
      sender: 'user'
    });
    await userMessage.save();

    // Get recent chat history for context
    const recentMessages = await ChatMessage.find({ session_id: sessionId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Create chat context
    const chatHistory = recentMessages.reverse().map(msg => 
      `${msg.sender}: ${msg.message}`
    ).join('\n');

    // Initialize Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const systemPrompt = `You are a professional gift recommendation expert. Based on the following criteria, provide exactly 6 detailed and personalized gift recommendations in valid JSON format.

CRITERIA:
- Relationship: ${req.body.relationship}
- Age Group: ${req.body.ageGroup}
- Gender: ${req.body.gender}
- Occasion: ${req.body.occasion}
- Interests: ${req.body.interests}
- Price Range: ${req.body.priceRange}
- Gift Type: ${req.body.giftType}

Rules:
Consider the recipient's age, interests, and relationship to the user.

All gifts must be within the user's specified price range.

Gifts should be unique, meaningful, and practical for the given occasion.

Each gift must include:

name: The product title

description: A short sentence explaining why this is a good gift

price: Approximate price in ₹

image: A real product image URL (from Indian platforms like Amazon.in or Flipkart.com)

link: A working and relevant product URL that opens a real product page or relevant search result

Do NOT include:

Any extra text before or after the JSON

Any invented, broken, irrelevant, or inappropriate links

Placeholder domains like example.com or dummy.com

Unrelated or offensive items
6. Respond ONLY in this exact format and structure:

{
  "recommendations": [
    {
      "gift_name": "Specific Gift Name",
      "description": "Why this is a great gift for the given person and occasion",
      "price_range": "₹X - ₹Y",
      "platform": "Amazon/Flipkart/Myntra/etc",
      "product_image": "Image URL or short visual description like 'black ceramic coffee mug set with lid'",
      "search_url": "Direct working product or search link"
    }
  ]
}
  
Recent conversation context:
${chatHistory}

Current user message: ${message}

Please respond helpfully to the user's message:`;

    // Generate AI response
    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    // Save AI response to database
    const assistantMessage = new ChatMessage({
      session_id: sessionId,
      user_id: userId,
      message: aiResponse,
      sender: 'assistant'
    });
    await assistantMessage.save();

    res.json({
      success: true,
      response: aiResponse,
      messageId: assistantMessage._id
    });

  } catch (error) {
    console.error("❌ AI Chat error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process chat message",
      details: error.message
    });
  }
});

// Get user's chat sessions
app.get("/api/chat/sessions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await ChatMessage.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: "$session_id",
          lastMessage: { $last: "$message" },
          lastTimestamp: { $last: "$timestamp" },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { lastTimestamp: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        sessionId: session._id,
        lastMessage: session.lastMessage.substring(0, 100) + (session.lastMessage.length > 100 ? '...' : ''),
        lastTimestamp: session.lastTimestamp,
        messageCount: session.messageCount
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat sessions"
    });
  }
});

// Clear chat session
app.delete("/api/chat/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await ChatMessage.deleteMany({ session_id: sessionId });
    
    res.json({
      success: true,
      message: "Chat session cleared successfully"
    });
  } catch (error) {
    console.error("❌ Error clearing session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear chat session"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} with AI Chat Assistant powered by Gemini 2.0 Flash!`));