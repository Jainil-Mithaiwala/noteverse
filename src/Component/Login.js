import React, { useState } from "react";

function Login({ navigateTo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    const response = await fetch("https://noteverse-api.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigateTo("notes");
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="App">
      <div className="note-list" style={{ marginTop: "-15px" }}>
        <h2 className="p-10 tasks-heading">Login</h2>
      </div>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="p-up-20 green maintain">
        New to NoteVerse?{" "}
        <a href="/register" className="hover">
          Click here to register
        </a>{" "}
        and get started!
      </p>
    </div>
  );
}

export default Login;
