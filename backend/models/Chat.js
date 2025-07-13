import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    session_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'assistant'], required: true },
    timestamp: { type: Date, default: Date.now },
    gift_context: {
        recommendations: [String], // Array of recommendation IDs related to this chat
        user_preferences: Object    // Any extracted preferences from conversation
    }
}, { timestamps: true });

// Create compound index for efficient queries
chatMessageSchema.index({ session_id: 1, timestamp: 1 });
chatMessageSchema.index({ user_id: 1, timestamp: -1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
