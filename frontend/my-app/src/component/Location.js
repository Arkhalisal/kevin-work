import { useEventStore } from "../customHook/useEventStore";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";

function Location() {
  const { locationData, lightMode } = useEventStore();
  const [shownLocations, setShownLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxDistance, setMaxDistance] = useState(4);
  const [sortOption, setSortOption] = useState("");

  const CUHK_LAT = 22.419843173273115;
  const CUHK_LNG = 114.20678205390958;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUniqueBracketedTerms = (locations) => {
    const terms = new Set();
    locations.forEach((location) => {
      const match = location.name.match(/$$(.*?)$$/);
      if (match) {
        terms.add(match[1]);
      }
    });
    return Array.from(terms);
  };

  useEffect(() => {
    const filteredLocations = locationData
      .filter((location) => {
        return (
          (location.name.toLowerCase().includes(searchTerm.toLowerCase()) && location.count > 3 && location.latitude) ||
          (String(location.count).includes(searchTerm) && location.count > 3 && location.latitude)
        );
      })
      .filter((location) => {
        const distance = calculateDistance(CUHK_LAT, CUHK_LNG, location.latitude, location.longitude);
        return distance > maxDistance;
      })
      .filter((location) => {
        return location.name.toLowerCase().includes(sortOption.toLowerCase());
      });

    setShownLocations(filteredLocations);
  }, [locationData, searchTerm, maxDistance, sortOption]);

  const uniqueTerms = getUniqueBracketedTerms(locationData);

  const handleFavoriteClick = async (id) => {
    const username = localStorage.getItem("username");
    const response = await fetch("http://localhost:5000/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, username: username }),
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div className={`locations-container ${lightMode ? "light" : "dark"}`}>
      <div className="locations-content">
        <h1 className="locations-title">Location Page</h1>

        <div className="locations-search">
          <input
            type="text"
            placeholder="Search locations or location venue count..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="locations-search-input"
          />
          {!searchTerm && <FontAwesomeIcon icon={faSearch} className="locations-search-icon" />}
        </div>

        <div className="locations-distance-slider">
          <label htmlFor="distance">Max Distance: {maxDistance} km</label>
          <input
            type="range"
            id="distance"
            min="0"
            max="25"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="locations-distance-input"
          />
        </div>

        <div className="locations-sorting">
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="locations-sort-input"
          >
            <option value="">Select an option</option>
            {uniqueTerms.map((term, index) => (
              <option key={index} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        <div className="locations-table-container">
          <table className="locations-table">
            <thead>
              <tr className="locations-table-header">
                <th>Location ID</th>
                <th>Location Name</th>
                <th>Number of Events</th>
                <th>Favorite</th>
              </tr>
            </thead>
            <tbody className="locations-table-body">
              {shownLocations.map((location) => (
                <tr key={location.id}>
                  <td>{location.id}</td>
                  <td>
                    <a href={`/map/?id=${location.id}`}>{location.name}</a>
                  </td>
                  <td>{location.count}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faStar}
                      className="locations-favorite-icon"
                      onClick={() => handleFavoriteClick(location.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shownLocations.length === 0 && <p className="locations-no-results">No locations found</p>}
      </div>

      <style jsx>{`
        .locations-container {
          min-height: 100vh;
          transition: background-color 0.3s, color 0.3s;
        }

        .light {
          background-color: #f0f2f5;
          color: #333;
        }

        .dark {
          color: #f0f2f5;
        }

        .locations-content {
          max-width: 1600px;
          margin: 0 auto;
        }

        .locations-title {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .locations-search {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .locations-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s;
        }

        .locations-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .locations-distance-slider {
          margin-bottom: 1.5rem;
        }

        .locations-distance-slider label {
          display: block;
          margin-bottom: 0.5rem;
        }

        .locations-distance-input {
          width: 100%;
        }

        .locations-sorting {
          margin-bottom: 1.5rem;
        }

        .locations-sort-input {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .locations-table-container {
          overflow-x: auto;
        }

        .locations-table {
          width: 100%;
          border-collapse: collapse;
        }

        .locations-table-header th {
          background-color: #f4f4f4;
          padding: 1rem;
          text-align: left;
          font-weight: bold;
        }

        .locations-table-body td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .locations-table-body tr:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .locations-favorite-icon {
          cursor: pointer;
          color: #ffd700;
          transition: transform 0.2s;
        }

        .locations-favorite-icon:hover {
          transform: scale(1.2);
        }

        .locations-no-results {
          text-align: center;
          font-style: italic;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .locations-container {
            padding: 1rem;
          }

          .locations-title {
            font-size: 2rem;
          }

          .locations-table-header th,
          .locations-table-body td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Location;
