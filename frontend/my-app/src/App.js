import React, { useEffect, useState } from "react";
import Login from "./component/Login";
import Homepage from "./component/Homepage";
import { useEventStore } from "./customHook/useEventStore";
import "./App.css";

function App() {
  const { lightMode } = useEventStore();
  const [user, setUser] = useState(null); // Store logged-in user info

  useEffect(() => {
    const createAdminUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "admin",
            password: "admin",
            isAdmin: true,
          }),
        });
        await response.json();
      } catch (error) {
        console.error("Error during admin user creation:", error);
      }
    };
    createAdminUser();
  }, []);

  return (
    <div className="App">
      <header
        style={{
          backgroundColor: lightMode ? "#F2F2F2" : "#282c34",
          color: lightMode ? "black" : "white",
        }}
      >
        {/* Login component */}
        {!user && <Login setUser={setUser} />}

        {/* Homepage component */}
        {user && <Homepage user={user} setUser={setUser} />}
      </header>
    </div>
  );
}

export default App;
