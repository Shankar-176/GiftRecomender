import React, { useEffect, useState } from "react";
import "../styles/GiftFinder.css"; 

const GiftFinder = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="gift-finder-container">
      {/* <h1>Gift Recommendations</h1> */}
      <div className="gift-list">
        {recommendations.map((gift) => (
          <div key={gift._id} className="gift-card">
            <img src={gift.product_image} alt={gift.gift_name} />
            <h3>{gift.gift_name}</h3>
            <p>{gift.description}</p>
            <a href={gift.search_url} target="_blank" rel="noopener noreferrer">
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftFinder;
