import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import {
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faTicketAlt,
  faLanguage,
  faClock as faRuntime,
  faExclamationTriangle,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

export default function EventPage() {
  const { eventData } = useEventStore();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setEvent(eventData.find((event) => event.id === eventId));
    const loadingTimeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(loadingTimeout);
  }, [eventId, eventData]);

  const handleBooking = async (id) => {
    const username = localStorage.getItem("username");
    try {
      const response = await fetch(`http://localhost:5000/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, username }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <h1 className="loading-text">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="event-page">
      <div className="event-content">
        <h1 className="event-title">{event?.title}</h1>

        <div className="detail-section">
          <div className="detail-item">
            <FontAwesomeIcon icon={faCalendar} className="icon" />
            <span>{event?.dateTime}</span>
          </div>
          <div className="detail-item">
            <FontAwesomeIcon icon={faClock} className="icon" />
            <span>{event?.programTime}</span>
          </div>
          <div className="detail-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
            <span>{event?.venue}</span>
          </div>
        </div>

        <div className="detail-section">
          <h2 className="section-header">Movie Details</h2>
          <p>{event?.presenter}</p>
        </div>

        <div className="detail-section">
          <h2 className="section-header">Description</h2>
          <p>{event?.description}</p>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />
            <span>Age Limit: {event?.ageLimit || "N/A"}</span>
          </div>
          <div className="detail-item">
            <FontAwesomeIcon icon={faTicketAlt} className="icon" />
            <span>Price: {event?.price}</span>
          </div>
          <div className="detail-item">
            <FontAwesomeIcon icon={faLanguage} className="icon" />
            <span>{event?.remarks || "N/A"}</span>
          </div>
          <div className="detail-item">
            <FontAwesomeIcon icon={faRuntime} className="icon" />
            <span>Runtime: {event?.programTime}</span>
          </div>
        </div>

        <div className="additional-info">
          <div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faCalendar} className="icon" />
              <span>Sale Date: {event?.saleDate}</span>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faCalendar} className="icon" />
              <span>Submit Date: {event?.submitDate}</span>
            </div>
          </div>
          <div>
            <div className="ticket-link">
              <FontAwesomeIcon icon={faLink} className="icon" />
              <a href={event?.tagentUrl} target="_blank" rel="noopener noreferrer">
                Ticket Purchase
              </a>
            </div>
            <div className="ticket-link">
              <FontAwesomeIcon icon={faLink} className="icon" />
              <a href={event?.url} target="_blank" rel="noopener noreferrer">
                Event Details
              </a>
            </div>
          </div>
        </div>
        <button className="book-button" onClick={() => handleBooking(event.id)}>
          Book Event
        </button>
      </div>

      <style jsx>{`
        .event-page {
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          color: black;
        }

        .event-content {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 1200px;
          width: 100%;
        }

        .event-title {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .detail-section {
          margin-bottom: 1.5rem;
        }

        .section-header {
          font-size: 1.5rem;
          color: #34495e;
          margin-bottom: 0.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .icon {
          margin-right: 0.5rem;
          color: #3498db;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .additional-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          border-top: 1px solid #e0e0e0;
          padding-top: 1.5rem;
        }

        .ticket-link {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .ticket-link a {
          color: #3498db;
          text-decoration: none;
        }

        .ticket-link a:hover {
          text-decoration: underline;
        }

        .book-button {
          background-color: #2ecc71;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 1rem;
        }

        .book-button:hover {
          background-color: #27ae60;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to bottom right, #f0f4f8, #d1e3f8);
        }

        .loading-text {
          font-size: 2rem;
          color: #3498db;
        }

        @media (max-width: 600px) {
          .event-page {
            padding: 1rem;
          }

          .event-content {
            padding: 1.5rem;
          }

          .event-title {
            font-size: 2rem;
          }

          .section-header {
            font-size: 1.25rem;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
