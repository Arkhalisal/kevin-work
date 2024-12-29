import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMapMarkerAlt, faUsers, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useEventStore } from "../customHook/useEventStore";

export default function Events() {
  const { eventData, locationData, lightMode } = useEventStore();
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [likeStatus, setLikeStatus] = useState({});
  const eventsPerPage = 30;
  const observer = useRef();

  useEffect(() => {
    const tenLocationData = locationData.filter((location) => location.count > 3 && location.latitude);
    const filteredEventData = eventData.filter((event) =>
      tenLocationData.map((location) => location.id).includes(event.venueId)
    );
    setVisibleEvents(filteredEventData.slice(0, eventsPerPage));
  }, [eventData, locationData]);

  useEffect(() => {
    const loadMoreEvents = (entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setIsLoading(false);
        }, 500);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observerInstance = new IntersectionObserver(loadMoreEvents, options);
    if (observer.current) {
      observerInstance.observe(observer.current);
    }
  }, [isLoading]);

  useEffect(() => {
    const start = (page - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    setVisibleEvents(eventData.slice(0, end));
  }, [page, eventData]);

  const handleLike = async (id) => {
    if (likeStatus[id] && likeStatus[id].liked) {
      alert("You have already liked this event.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      await response.json();
      setLikeStatus((prevStatus) => ({
        ...prevStatus,
        [id]: { liked: true, count: 1 },
      }));
    } catch (error) {
      console.error("Error during like:", error);
    }
  };

  return (
    <div className={`container ${lightMode ? "light-mode" : "dark-mode"}`}>
      <h1 className="title" style={{ color: lightMode ? "black" : "white" }}>
        Events Page
      </h1>
      <div className="event-list">
        {visibleEvents.map((event, index) => (
          <div key={index} className="event-card">
            <div className="event-header">
              <span className="event-id">ID: {event.id}</span>
              <div className="like-section">
                <span className="like-count">
                  {Number(event.like) + likeStatus[event.id]?.count || event.like || 0}
                </span>
                <button className="like-button" onClick={() => handleLike(event.id)}>
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>
            </div>
            <h2 className="event-title" onClick={() => (window.location.href = `/events/${event.id}`)}>
              {event.title}
            </h2>
            <div className="event-details">
              <div className="event-detail">
                <FontAwesomeIcon icon={faCalendar} className="icon" />
                <span>{event.dateTime}</span>
              </div>
              <div className="event-detail">
                <FontAwesomeIcon icon={faUsers} className="icon" />
                <span>{event.presenter.split("by")[1]}</span>
              </div>
              <div className="event-detail">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="loading">
          <span>Loading more events...</span>
        </div>
      )}
      {!isLoading && <div ref={observer} className="loading-observer"></div>}

      <style jsx>{`
        .container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 10px;
          border-radius: 10px;
        }

        .light-mode {
          background-color: #f0f2f5;
          color: #333;
        }

        .dark-mode {
          color: #f0f2f5;
        }

        .title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 30px;
        }

        .event-list {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .event-card {
          flex: 0 1 calc(33.333% - 20px);
          min-width: 300px;
          display: flex;
          flex-direction: column;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 20px;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .event-id {
          font-size: 0.8rem;
          color: #777;
        }

        .like-section {
          display: flex;
          align-items: center;
        }

        .like-count {
          font-size: 1rem;
          margin-right: 5px;
          color: #ff4757;
        }

        .like-button {
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          font-size: 1.2rem;
          margin-top: 5px;
          transition: transform 0.2s ease;
        }

        .like-button:hover {
          transform: scale(1.1);
        }

        .event-title {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #2c3e50;
          cursor: pointer;
          flex-grow: 1;
        }

        .event-title:hover {
          text-decoration: underline;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .event-detail {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          color: #555;
        }

        .icon {
          margin-right: 10px;
          color: #3498db;
          width: 20px;
          height: 18px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          font-size: 1.2rem;
          color: #777;
          width: 100%;
        }

        .loading-observer {
          height: 20px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .event-card {
            flex: 0 1 calc(50% - 20px);
          }
        }

        @media (max-width: 768px) {
          .event-card {
            flex: 0 1 100%;
          }

          .title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
