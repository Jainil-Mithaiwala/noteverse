import React, { useState, useEffect } from "react";
import logo from "./../NoteVerse NV logo.png"; // Import the logo

function Notes({ navigateTo }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Initially set loading to true
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token is missing, redirect to login
    if (!token) {
      navigateTo("login");
      return;
    }

    // Fetch user data from /user/token
    fetch("http://localhost:5000/user/token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          setUserData(data); // Set user data if successful
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        navigateTo("login"); // Redirect to login if error occurs
      });

    // Fetch notes
    fetch("http://localhost:5000/notes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigateTo("login");
          }
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data); // Set notes if response is an array
        } else {
          setNotes([]); // Fallback if data is not an array
        }

        // Add a 2-second delay before hiding the splash screen
        setTimeout(() => {
          setIsLoading(false); // Hide splash screen after 6 seconds
        }, 6000);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setIsLoading(false); // Hide splash screen in case of error
        navigateTo("login"); // Navigate to login on error
      });
  }, [navigateTo]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigateTo("login");
  };

  const addNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      setErrorMessage("Both title and content are required!");
      return;
    }

    // Get the _id from the userData state
    const userId = userData ? userData.userid : null;
    // const userName = userData ? userData.email : null;

    if (!userId) {
      setErrorMessage("User ID is not available!");
      return;
    }

    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content, completed: false, userId }),
    })
      .then((response) => response.json())
      .then((newNote) => {
        setNotes([...notes, newNote]);
        setTitle("");
        setContent("");
        setErrorMessage("");
      })
      .catch((err) => console.error("Error adding note:", err)); // Error handling for note creation
  };

  const toggleCompletion = (id, completed) => {
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((response) => response.json())
      .then((updatedNote) => {
        setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
      })
      .catch((err) => console.error("Error toggling note completion:", err)); // Error handling for toggling
  };

  const deletenote = (id) => {
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setNotes(notes.filter((note) => note._id !== id));
      })
      .catch((err) => console.error("Error deleting note:", err)); // Error handling for deleting notes
  };

  return (
    <div>
      {/* Display splash screen if loading */}
      {isLoading ? (
        <div className="splash-screen">
          <img src={logo} alt="Logo" className="splash-logo" />
          {userData && <p className="user-welcome">Hey, {userData.name}</p>}
          <p className="welcome-message green">Welcome back to NoteVerse!</p>
          <p className="designer-message green">Crafted with care by Jainil.</p>
        </div>
      ) : (
        <div className="App">
          <h1>NoteVerse</h1>
          <div className="note-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button onClick={addNote}>Add Note</button>
            <p className="maintain">Design and maintain by Jainil</p>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="note-list" style={{ marginTop: "50px" }}>
            <h2 className="tasks-heading">Your Notes</h2>
            {notes.length === 0 ? (
              <p className="no-notes-message">
                No notes available at this moment
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className={`note ${
                    note.completed ? "completed-note" : "not-completed-note"
                  }`}
                >
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                  <div className="note-actions">
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() =>
                        toggleCompletion(note._id, note.completed)
                      }
                    />
                    <p
                      className={`completed-text ${
                        note.completed ? "completed" : "not-completed"
                      }`}
                    >
                      {note.completed ? "✔ Completed" : "❌ Not Complete"}
                    </p>

                    {/* Conditionally render delete button or incomplete text */}
                    {note.completed ? (
                      <button
                        className="delete-btn"
                        onClick={() => deletenote(note._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button className="incomplete-btn" disabled>
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="maintain">Design and maintain by Jainil</p>
                </div>
              ))
            )}
            <div className="logoutsection">
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
