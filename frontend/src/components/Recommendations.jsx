// src/components/Recommendations.jsx
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../styles/Recommendations.css";

const Recommendations = () => {
  const { state } = useLocation();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const recs = state?.recommendations;
    if (!recs || recs.length === 0) {
      setError("No recommendations found. Please try again.");
    } else {
      setRecommendations(recs);
    }
  }, [state]);

  return (
    <div className="recommendation-page">
      <h1 className="heading">🎁 Gift Suggestions</h1>
      {error ? (
        <p className="error-msg">{error}</p>
      ) : (
        <div className="recommendation-grid">
          {recommendations.map((gift, idx) => (
            <div className="recommendation-card" key={idx}>
              <img
                src={gift.product_image || "https://via.placeholder.com/250"}
                alt={gift.gift_name}
                onError={(e) => (e.target.src = "https://via.placeholder.com/250")}
              />
              <div className="card-content">
                <h2>{gift.gift_name}</h2>
                <p className="description">{gift.description}</p>
                <div className="meta">
                  <span className="platform">{gift.platform}</span>
                  <span className="price">{gift.price_range}</span>
                </div>
                {gift.search_url && (
                  <a href={gift.search_url} target="_blank" rel="noopener noreferrer" className="btn-view">
                    View Product
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
