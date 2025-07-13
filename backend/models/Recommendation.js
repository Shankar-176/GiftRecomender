import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
    gift_name: { type: String, required: true },
    description: String,
    price_range: String,
    platform: String,
    product_image: String,
    search_url: String, // ✅ instead of buy_link
    retail_data: Object, // optional
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export default Recommendation;

    


