import React, { useState } from "react";
import Config from "../Config";

const backendurl = Config.backendurl;

function Register({ navigateTo }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [appActive, setAppActive] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (e) => {
    e.preventDefault(); // <-- Prevent page reload
    setErrorMessage("");
    setSuccessMessage("");

    const response = await fetch(backendurl + "register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage(data.message);
      triggerAnimation();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      setErrorMessage(data.message);
      triggerAnimation();
    }
  };

  const triggerAnimation = () => {
    setFadeOut(false);
    setAppActive(true);

    setTimeout(() => setFadeOut(true), 4000);
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 5000);
    setTimeout(() => setAppActive(false), 6000);
  };

  return (
    <div className={`App ${appActive ? "error-active" : ""}`}>
      <div className="note-list" style={{ marginTop: "-15px" }}>
        <h2 className="p-10 tasks-heading">Register</h2>
      </div>
      <form onSubmit={handleRegister} style={{ width: "700px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      {errorMessage && (
        <p className={`error-message ${fadeOut ? "fade-out" : "fade-in"}`}>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className={`success-message ${fadeOut ? "fade-out" : "fade-in"}`}>
          {successMessage}
        </p>
      )}
      {/* {successMessage && <p className="success-message">{successMessage}</p>} */}

      <p className="p-up-20 green maintain">
        Already have an account?{" "}
        <span className="hover" onClick={() => navigateTo("login")} style={{ cursor: "pointer", textDecoration: "underline" }}>
          Click here to register
        </span>{" "}
        and pick up where you left off!
      </p>
    </div>
  );
}

export default Register;
