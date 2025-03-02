import React, { useState, useCallback, useEffect } from "react";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Notes from "./Component/Notes";
import "./App.css";
// import logo from "./NoteVerse NV logo.png"; // Import the logo

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  // Set the initial page based on the URL path
  useEffect(() => {
    const currentRoute = window.location.pathname;
    
    if (currentRoute === "/register") {
      setCurrentPage("register");
    } else if (currentRoute === "/notes") {
      setCurrentPage("notes");
    } else {
      setCurrentPage("login");
    }
  }, []);

  // Wrap navigateTo with useCallback to prevent unnecessary re-renders
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    window.history.pushState({}, "", page === "login" ? "/" : `/${page}`);
  }, []);

  return (
    <div>
      {currentPage === "login" && <Login navigateTo={navigateTo} />}
      {currentPage === "register" && <Register navigateTo={navigateTo} />}
      {currentPage === "notes" && <Notes navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
