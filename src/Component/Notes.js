import React, { useState, useEffect } from "react";
import logo from "./../NoteVerse NV logo.png";
import Config from "../Config";

function Notes({ navigateTo }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null); // { type: 'delete' | 'logout', noteId?: string }
  const [modalAnimatingOut, setModalAnimatingOut] = useState(false);

  const backendurl = Config.backendurl;

  const fetchNotes = () => {
    const uid = localStorage.getItem("uid");

    fetch(backendurl + "notes/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: uid }),
    })
      .then((res) => res.json())
      .then((noteData) => {
        if (Array.isArray(noteData.data)) {
          setNotes(noteData.data);
        } else {
          setNotes([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        navigateTo("login");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("uid");
    const unqkey = localStorage.getItem("unqkey");

    if (!token || !uid || !unqkey) {
      navigateTo("login");
      return;
    }

    fetch(backendurl + "verify/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, uid, unqkey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setUserData({ name: data.name, userid: uid });
          fetchNotes();
          setTimeout(() => setIsLoading(false), 6000);
        } else {
          navigateTo("login");
        }
      })
      .catch((err) => {
        console.error("Token verification failed:", err);
        navigateTo("login");
      });
  }, [navigateTo]);

  useEffect(() => {
    if (isStatusUpdated) {
      fetchNotes();
      setIsStatusUpdated(false);
    }
  }, [isStatusUpdated]);

  const handleLogoutConfirmed = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("unqkey");
    navigateTo("login");
  };

  const addNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      setErrorMessage("Both title and content are required!");
      return;
    }

    const userId = userData?.userid;
    if (!userId) {
      setErrorMessage("User ID is not available!");
      return;
    }

    fetch(backendurl + "notes/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: userId, title, content }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        setNotes([...notes, newNote]);
        setTitle("");
        setContent("");
        setErrorMessage("");
        fetchNotes();
      })
      .catch((err) => console.error("Error adding note:", err));
  };

  const toggleCompletion = (id, isCompleted) => {
    const userId = userData?.userid;
    if (!userId) return;

    fetch(backendurl + "notes/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: userId,
        _id: id,
        status: isCompleted ? 0 : 1,
      }),
    })
      .then((res) => res.json())
      .then(() => setIsStatusUpdated(true))
      .catch((err) => console.error("Error toggling note status:", err));
  };

  const deleteNoteConfirmed = (id) => {
    const userId = userData?.userid;

    fetch(backendurl + "notes/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, userid: userId }),
    })
      .then(() => {
        setNotes(notes.filter((note) => note._id !== id));
        fetchNotes();
      })
      .catch((err) => console.error("Error deleting note:", err));
  };

  const handleModalYes = () => {
    if (modalAction?.type === "logout") {
      handleLogoutConfirmed();
    } else if (modalAction?.type === "delete" && modalAction.noteId) {
      deleteNoteConfirmed(modalAction.noteId);
    }

    // Start exit animation
    setModalAnimatingOut(true);
    setTimeout(() => {
      setModalVisible(false);  // Hide modal only after animation completes
      setModalAnimatingOut(false);
    }, 300); // match CSS animation duration
  };

  const handleModalNo = () => {
    setModalAnimatingOut(true);
    setTimeout(() => {
      setModalVisible(false);
      setModalAnimatingOut(false);
    }, 300);
  };

  return (
    <div>
      {isLoading ? (
        <div className="splash-screen">
          <img src={logo} alt="Logo" className="splash-logo" />
          {userData && <p className="user-welcome p-10">Hey, {userData.name}</p>}
          <p className="welcome-message green p-10">Welcome back to NoteVerse!</p>
          <p className="designer-message green p-10">Crafted with care by Jainil.</p>
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

          {errorMessage && <p className="error-message fade-out">{errorMessage}</p>}

          <div className="note-list" style={{ marginTop: "50px" }}>
            <h2 className="tasks-heading">Your Notes</h2>
            {notes.length === 0 ? (
              <p className="no-notes-message">No notes available at this moment</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className={`note ${note.status === 1 ? "completed-note" : "not-completed-note"}`}
                >
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                  <div className="note-actions">
                    <input
                      type="checkbox"
                      checked={note.status === 1}
                      onChange={() => toggleCompletion(note._id, note.status === 1)}
                    />
                    <p className={`completed-text ${note.status === 1 ? "completed" : "not-completed"}`}>
                      {note.status === 1 ? "✔ Completed" : "❌ Not Complete"}
                    </p>
                    {note.status === 1 ? (
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setModalAction({ type: "delete", noteId: note._id });
                          setModalVisible(true);
                        }}
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
              <button
                onClick={() => {
                  setModalAction({ type: "logout" });
                  setModalVisible(true);
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <div className={`modal-overlay ${modalAnimatingOut ? "hide" : ""}`}>
          <div className={`modal-content ${modalAnimatingOut ? "hide" : ""}`}>
            <span className="material-symbols-outlined modal-icon">
              {modalAction?.type === "logout" ? "logout" : "delete"}
            </span>
            <p>
              {modalAction?.type === "logout"
                ? "Are you sure you want to log out?"
                : "Are you sure you want to delete this note?"}
            </p>
            <div className="modal-buttons">
              <button onClick={handleModalYes}>Yes</button>
              <button onClick={handleModalNo}>No</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Notes;
