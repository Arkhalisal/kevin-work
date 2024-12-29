import React, { useState } from "react";
import { useEventStore } from "../customHook/useEventStore";

const EventRecommendations = () => {
  const { eventData } = useEventStore();

  const [userPreferences, setUserPreferences] = useState({
    ageGroup: "",
    preferredDate: "",
    maxPrice: "",
    interests: "",
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredEvents = eventData
      .filter((event) => {
        const eventDate = new Date(event.dateTime.split(" ")[0]);
        const preferredDate = new Date(userPreferences.preferredDate);
        const eventPrice = parseInt(event.price.replace("$", ""));

        return (
          (!userPreferences.ageGroup || event.ageLimit.includes(userPreferences.ageGroup)) &&
          (!userPreferences.preferredDate || eventDate >= preferredDate) &&
          (!userPreferences.maxPrice || eventPrice <= parseInt(userPreferences.maxPrice)) &&
          (!userPreferences.interests ||
            event.description.toLowerCase().includes(userPreferences.interests.toLowerCase()))
        );
      })
      .slice(0, 3);

    setRecommendations(filteredEvents);
  };

  return (
    <div className="event-recommendations">
      <h2 style={{ fontSize: "2.5rem", textAlign: "center" }}>Find Event Recommendations</h2>
      <form onSubmit={handleSubmit} className="preferences-form">
        <div className="form-group">
          <label htmlFor="ageGroup">Age Group:</label>
          <select id="ageGroup" name="ageGroup" value={userPreferences.ageGroup} onChange={handleInputChange}>
            <option value="">Any</option>
            <option value="18">18+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="preferredDate">Preferred Date (from):</label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={userPreferences.preferredDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxPrice">Maximum Price ($):</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={userPreferences.maxPrice}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="interests">Interests (keywords):</label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={userPreferences.interests}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Get Recommendations</button>
      </form>

      <div className="recommendations">
        <h3 style={{ color: "black" }}>Recommended Events:</h3>
        {recommendations.length > 0 ? (
          <div style={{ color: "black" }}>
            {recommendations.map((event) => (
              <div key={event.id} className="event-item">
                <div>{event.id}</div>
                <h4 style={{ marginBottom: "5px" }}>{event.title}</h4>
                <p style={{ marginBottom: "5px" }}>Date & Time: {event.dateTime}</p>
                <p style={{ marginBottom: "5px" }}>Venue: {event.venue}</p>
                <p style={{ marginBottom: "5px" }}>Price: {event.price || "none"}</p>
                <p>Age Limit: {event.ageLimit || "none"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "black" }}>No recommendations found. Try adjusting your preferences.</p>
        )}
      </div>

      <style jsx>{`
        .event-recommendations {
          width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .preferences-form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
        .form-group {
          margin-bottom: 15px;
          color: black;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input,
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        .recommendations {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          color: black;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .event-item {
          border-bottom: 1px solid #eee;
          padding: 10px 0;
        }
        .event-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default EventRecommendations;
