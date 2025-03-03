import React, { useState } from "react";

function Register({ navigateTo }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async () => {
    // Clear any previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate password matching
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Validate mobile number (optional)
    if (!mobile) {
      setErrorMessage("Mobile number is required");
      return;
    }

    // Send registration request to server
    const response = await fetch("https://noteverse-api.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage(data.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
        window.location.href = "/login";
      }, 2000);
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="App">
      <div className="note-list" style={{ marginTop: "-15px" }}>
        <h2 className="p-10 tasks-heading">Register</h2>
      </div>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button onClick={handleRegister}>Register</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <p className="p-up-20 green maintain">
        Already have an account?{" "}
        <a href="/login" className="hover">
          Click here to log in
        </a>{" "}
        and pick up where you left off!
      </p>
    </div>
  );
}

export default Register;
