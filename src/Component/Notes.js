import React, { useState, useEffect } from "react";
import logo from "./../NoteVerse NV logo.png"; // Import the logo

function Notes({ navigateTo }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigateTo("login");
      return;
    }

    // Fetch user data
    fetch("https://noteverse-api.onrender.com/user/token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          setUserData(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        navigateTo("login");
      });

    // Fetch notes
    fetch("https://noteverse-api.onrender.com/notes", {
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
          setNotes(data);
        } else {
          setNotes([]);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 6000);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setIsLoading(false);
        navigateTo("login");
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

    const userId = userData ? userData.userid : null;

    if (!userId) {
      setErrorMessage("User ID is not available!");
      return;
    }

    fetch("https://noteverse-api.onrender.com/notes", {
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
      .catch((err) => console.error("Error adding note:", err));
  };

  const toggleCompletion = (id, completed) => {
    fetch(`https://noteverse-api.onrender.com/notes/${id}`, {
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
      .catch((err) => console.error("Error toggling note completion:", err));
  };

  const deleteNote = (id) => {
    fetch(`https://noteverse-api.onrender.com/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setNotes(notes.filter((note) => note._id !== id));
      })
      .catch((err) => console.error("Error deleting note:", err));
  };

  return (
    <div>
      {isLoading ? (
        <div className="splash-screen">
          <img src={logo} alt="Logo" className="splash-logo" />
          {userData && (
            <p className="user-welcome p-10">Hey, {userData.name}</p>
          )}
          <p className="welcome-message green p-10">
            Welcome back to NoteVerse!
          </p>
          <p className="designer-message green p-10">
            Crafted with care by Jainil.
          </p>
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
                    {note.completed ? (
                      <button
                        className="delete-btn"
                        onClick={() => deleteNote(note._id)}
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
