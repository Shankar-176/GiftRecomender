import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Questionnaire.css";

const Questionnaire = ({ onSubmit = (data) => console.log("Received:", data) }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Configurable backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                      localStorage.getItem("backendOverride") || 
                      "https://gift-recommend.onrender.com";

  const onFormSubmit = async (formData) => {
    setLoading(true);
    setError("");

    const requestData = {
      relationship: formData.relationship?.trim(),
      ageGroup: formData.ageGroup?.trim(),
      gender: formData.gender?.trim(),
      occasion: formData.occasion?.trim(),
      interests: formData.interests?.trim(),
      priceRange: formData.priceRange?.trim(),
      giftType: formData.giftType?.trim(),
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/generate`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success && response.data.recommendations?.length > 0) {
        onSubmit(response.data.recommendations);
        navigate("/recommendations", {
          state: { recommendations: response.data.recommendations }
        });
      } else {
        setError("No recommendations found. Please try different criteria.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(
        error.response?.data?.error || 
        error.message || 
        "Connection error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="questionnaire" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <h2>🎁 Gift Recommendation Form</h2>

        {Object.entries({
          relationship: "Friend, Family, Partner, etc.",
          ageGroup: "0-5, 6-12, 13-19, etc.",
          gender: "Male, Female, Non-binary, etc.",
          occasion: "Birthday, Anniversary, etc.",
          interests: "Technology, Music, Sports, etc.",
          priceRange: "₹500 - ₹1000, etc.",
          giftType: "Personalized Gift, Luxury Item, etc."
        }).map(([field, placeholder]) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              {...register(field, { required: `${field} is required` })}
              placeholder={placeholder}
            />
            {errors[field] && <p className="error-message">{errors[field].message}</p>}
          </div>
        ))}

        <div className="submit-button">
          <button type="submit" disabled={loading}>
            {loading ? "Fetching Recommendations..." : "Get Recommendations"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {/* Backend info */}
        {window.location.hostname === "localhost" && (
          <div className="dev-info">
            <p>Using backend: {BACKEND_URL}</p>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Questionnaire;