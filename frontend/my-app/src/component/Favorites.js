import { useEffect, useState } from "react";
import { useEventStore } from "../customHook/useEventStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Favorites() {
  const { locationData } = useEventStore();
  const [favorites, setFavorites] = useState([]);
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      const user = localStorage.getItem("username");
      const response = await fetch("http://localhost:5000/getFavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user }),
      });
      const result = await response.json();
      setFavorites(result.favorites);
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    const favoriteLocations = favorites.map((id) => {
      return locationData.find((location) => Number(location.id) === Number(id));
    });
    setFavoriteLocations(favoriteLocations);
  }, [favorites, locationData]);

  const handleUnfavoriteClick = async (id) => {
    setFavorites(favorites.filter((favorite) => favorite !== id));
    const username = localStorage.getItem("username");
    const response = await fetch("http://localhost:5000/unfavorite", {
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
    <div>
      <h1 style={{ textAlign: "center" }}>Favorites Location</h1>
      <div className="locations-table-container">
        <div className="overflow-x-auto">
          <table className="locations-table">
            <thead>
              <tr className="locations-table-header">
                <th>Location ID</th>
                <th>Location Name</th>
                <th>Number of Events</th>
                <th>Unfavorite</th>
              </tr>
            </thead>
            <tbody className="locations-table-body">
              {favoriteLocations?.map((location) => (
                <tr key={location.id}>
                  <td>{location.id}</td>
                  <td>
                    <a href={`/map/?id=${location.id}`}>{location.name}</a>
                  </td>
                  <td>{location.count}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="locations-favorite-icon"
                      onClick={() => handleUnfavoriteClick(location.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {favoriteLocations.length === 0 && <p className="locations-no-results">No locations favorited.</p>}
    </div>
  );
}
