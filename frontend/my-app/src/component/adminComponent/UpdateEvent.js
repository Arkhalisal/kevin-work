import React, { useState } from "react";

export default function UpdateEvent() {
  const [eventId, setEventId] = useState("");
  const [eventData, setEventData] = useState({
    id: "",
    title: "",
    dateTime: "",
    duration: "",
    venueId: "",
    description: "",
    presenter: "",
    ageLimit: "",
    price: "",
    remarks: "",
    saleDate: "",
    submitDate: "",
    programTime: "",
    tagentUrl: "",
    url: "",
  });
  const [error, setError] = useState("");

  const fetchEventById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/getEventInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const event = await response.json();
      const { _id, ...eventWithoutId } = event[0];
      setEventData(eventWithoutId);
      setError("");
    } catch (err) {
      setError("Event not found");
    }
  };

  const handleIdChange = (e) => {
    setEventId(e.target.value);
  };

  const handleSearch = () => {
    if (eventId) {
      fetchEventById(eventId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4001/updateEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventData }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <div className="update-event-container">
      <form onSubmit={handleSubmit} className="update-event-form">
        <h1 className="form-title">Update Event</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter Event ID"
            value={eventId}
            onChange={handleIdChange}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-grid">
          {Object.entries(eventData).map(([key, value]) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}</label>
              {key === "description" || key === "remarks" ? (
                <textarea id={key} name={key} value={value} onChange={handleChange} required />
              ) : (
                <input
                  type={
                    key.includes("Date") || key === "dateTime" ? "datetime-local" : key === "price" ? "number" : "text"
                  }
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="submit-button">
          Update Event
        </button>
      </form>

      <style jsx>{`
        .update-event-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .update-event-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-title {
          font-size: 1.5rem;
          color: #333;
          text-align: center;
          margin-bottom: 1rem;
        }
        .search-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .search-input {
          flex-grow: 1;
          padding: 0.4rem;
          font-size: 0.9rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .search-button {
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
          color: #fff;
          background-color: #3498db;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .error-message {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .form-group label {
          font-size: 0.8rem;
          color: #555;
          font-weight: 600;
        }
        .form-group input,
        .form-group textarea {
          padding: 0.4rem;
          font-size: 0.9rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        .submit-button {
          padding: 0.6rem;
          font-size: 1rem;
          color: #fff;
          background-color: #3498db;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s ease;
          align-self: flex-start;
        }
        .submit-button:hover {
          background-color: #2980b9;
          transform: translateY(-1px);
        }
        .submit-button:active {
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .update-event-container {
            padding: 1rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-title {
            font-size: 1.3rem;
          }
          .form-group input,
          .form-group textarea,
          .submit-button,
          .search-input,
          .search-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
