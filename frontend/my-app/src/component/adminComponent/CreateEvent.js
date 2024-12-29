import React, { useState } from "react";

export default function CreateEvent() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/createEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventData }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="create-event-container">
      <form onSubmit={handleSubmit} className="create-event-form">
        <h1 className="form-title">Create Event</h1>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id">ID</label>
            <input type="text" id="id" name="id" value={eventData.id} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={eventData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="dateTime">Date & Time</label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={eventData.dateTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={eventData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="venueId">Venue ID</label>
            <input type="text" id="venueId" name="venueId" value={eventData.venueId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="presenter">Presenter</label>
            <input
              type="text"
              id="presenter"
              name="presenter"
              value={eventData.presenter}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ageLimit">Age Limit</label>
            <input type="text" id="ageLimit" name="ageLimit" value={eventData.ageLimit} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" name="price" value={eventData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="saleDate">Sale Date</label>
            <input
              type="datetime-local"
              id="saleDate"
              name="saleDate"
              value={eventData.saleDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="submitDate">Submit Date</label>
            <input
              type="datetime-local"
              id="submitDate"
              name="submitDate"
              value={eventData.submitDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="programTime">Program Time</label>
            <input
              type="text"
              id="programTime"
              name="programTime"
              value={eventData.programTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tagentUrl">Tagent URL</label>
            <input type="url" id="tagentUrl" name="tagentUrl" value={eventData.tagentUrl} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input type="url" id="url" name="url" value={eventData.url} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="remarks">Remarks</label>
          <textarea id="remarks" name="remarks" value={eventData.remarks} onChange={handleChange} />
        </div>
        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>

      <style jsx>{`
        .create-event-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .create-event-form {
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
        .full-width {
          grid-column: 1 / -1;
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
          .create-event-container {
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
          .submit-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
