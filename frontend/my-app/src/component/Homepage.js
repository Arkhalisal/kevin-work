import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Events from "./Events";
import EventPage from "./EventId";
import Location from "./Location";
import Admin from "./Admin";
import Map from "./Map";
import Favorites from "./Favorites";
import EventRecommendations from "./EventRecommendation";
import { useEventStore } from "../customHook/useEventStore";

function Homepage({ user, setUser }) {
  const { setEventData, setLocationData, setLightMode, lightMode } = useEventStore();

  useEffect(() => {
    if (lightMode) {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }
  }, [lightMode]);

  useEffect(() => {
    async function fetchEventData() {
      const response = await fetch("http://localhost:5000/getEventInfo");
      const data = await response.json();

      const venueResponse = await fetch("http://localhost:5000/getEventVenueInfo");
      const venueData = await venueResponse.json();
      const combinedData = data.map((event) => {
        const venue = venueData.find((v) => Number(v.id) === Number(event.venueId));

        return {
          ...event,
          venue: venue?.name,
          latitude: venue?.latitude,
          longitude: venue?.longitude,
        };
      });

      const venueEventCounts = venueData.map((venue) => {
        return {
          ...venue,
          count: combinedData.filter((event) => event.venue === venue.name).length,
        };
      });

      setEventData(combinedData);
      setLocationData(venueEventCounts);
    }
    fetchEventData();
  }, [setEventData, setLocationData]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar" style={{ backgroundColor: lightMode ? "white" : "#2c3e50" }}>
          <div className="navbar-left">
            <button onClick={() => setLightMode(!lightMode)} className="theme-toggle">
              {lightMode ? "🌙" : "☀️"}
            </button>
          </div>
          <div className="navbar-center">
            <Link to="/" style={{ color: lightMode ? "black" : "white" }}>
              Home
            </Link>
            <Link to="/events" style={{ color: lightMode ? "black" : "white" }}>
              Events
            </Link>
            <Link to="/locations" style={{ color: lightMode ? "black" : "white" }}>
              Locations
            </Link>
            <Link to="/map" style={{ color: lightMode ? "black" : "white" }}>
              Map
            </Link>
            <Link to="/favorites" style={{ color: lightMode ? "black" : "white" }}>
              Favorites
            </Link>
            <Link to="/recommendations" style={{ color: lightMode ? "black" : "white" }}>
              Recommendations
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" style={{ color: lightMode ? "black" : "white" }}>
                Admin
              </Link>
            )}
          </div>
          <div className="navbar-right">
            <Link to="/" onClick={handleLogout} style={{ color: lightMode ? "black" : "white" }}>
              Log Out
            </Link>
            <span className="username" style={{ color: lightMode ? "black" : "white" }}>
              Username: {user.username}
            </span>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} setUser={setUser} />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventPage />} />
            <Route path="/locations" element={<Location />} />
            <Route path="/map" element={<Map />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recommendations" element={<EventRecommendations />} />
          </Routes>
        </main>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #2c3e50;
          color: white;
          height: 4.5rem;
          transition: background-color 0.3s ease;
        }

        .navbar-left,
        .navbar-right {
          flex: 1;
          text-align: center;
        }

        .navbar-center {
          flex: 2;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .navbar a {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .navbar a:hover {
          background-color: #34495e;
        }

        .theme-toggle {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: white;
        }

        .username {
          margin-left: 1rem;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            gap: 1rem;
          }

          .navbar-center {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </Router>
  );
}

const Home = ({ user }) => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const { eventData, lightMode } = useEventStore();

  useEffect(() => {
    async function fetchBookedEvents() {
      const response = await fetch("http://localhost:5000/getBookedEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.username }),
      });
      const data = await response.json();
      if (data.bookedEvents) {
        setBookedEvents(data.bookedEvents);
      }
    }
    fetchBookedEvents();
  }, [user.username]);

  const handleUnbookEvent = async (eventId) => {
    try {
      await fetch("http://localhost:5000/unbookEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.username, eventId }),
      });
      setBookedEvents((prevBookedEvents) => prevBookedEvents.filter((id) => id !== eventId));
    } catch (error) {
      console.error("Error during unbooking:", error);
    }
  };

  return (
    <div className="home-container">
      <h1 style={{ color: lightMode ? "black" : "white" }}>Welcome, {user?.username}!</h1>
      {user?.isAdmin ? (
        <div className="user-status admin">You are logged in as an admin.</div>
      ) : (
        <div className="user-status">You are logged in as a regular user.</div>
      )}
      <h2 style={{ color: lightMode ? "black" : "white", marginBottom: "1rem" }}>Booked Events:</h2>
      <div className="booked-events">
        {bookedEvents?.map(
          (event) =>
            eventData.find((e) => e.id === event) && (
              <div key={event} className="event-card" style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "5px",
                    cursor: "pointer",
                    color: "red",
                    fontSize: "20px",
                  }}
                  onClick={() => handleUnbookEvent(event)}
                >
                  X
                </div>
                <h3>{eventData.find((e) => e.id === event).title}</h3>
                <p>{eventData.find((e) => e.id === event).dateTime}</p>
              </div>
            )
        )}
      </div>

      <style jsx>{`
        .home-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        h1 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .user-status {
          background-color: #ecf0f1;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
        }

        .user-status.admin {
          background-color: #3498db;
          color: white;
        }

        .booked-events {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .event-card {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .event-card h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .event-card p {
          margin: 0;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
