import React, { useState } from "react";
import Config from "../Config";

const backendurl = Config.backendurl;

function Login({ navigateTo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [appActive, setAppActive] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      const response = await fetch(backendurl + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store auth info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("uid", data.uid);
        localStorage.setItem("unqkey", data.unqkey);
        localStorage.setItem("name", data.name); // optional

        navigateTo("notes");
      } else {
        showError(data.message || "Invalid login");
      }
    } catch (error) {
      showError("Network error or server unreachable");
      console.error("Login error:", error);
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    setFadeOut(false);
    setAppActive(true);

    setTimeout(() => setFadeOut(true), 4000);
    setTimeout(() => setErrorMessage(""), 5000);
    setTimeout(() => setAppActive(false), 5200);
  };

  return (
    <div className={`App ${appActive ? "error-active" : ""}`}>
      <div className="note-list" style={{ marginTop: "-15px" }}>
        <h2 className="p-10 tasks-heading">Login</h2>
      </div>

      <form onSubmit={handleLogin} style={{ width: "700px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {errorMessage && (
        <p className={`error-message ${fadeOut ? "fade-out" : "fade-in"}`}>
          {errorMessage}
        </p>
      )}

      <p className="p-up-20 green maintain">
        New to NoteVerse?{" "}
        <span className="hover" onClick={() => navigateTo("register")} style={{ cursor: "pointer", textDecoration: "underline" }}>
          Click here to register
        </span>
        {" "}
        and get started!
      </p>
    </div>
  );
}

export default Login;
