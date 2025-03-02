import React, { useState } from "react";

function Register({ navigateTo }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const handleRegister = async () => {
    // Clear any previous messages
    setErrorMessage(""); // Remove any error message
    setSuccessMessage(""); // Remove any success message

    // Validate password matching
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Send registration request to server
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Show success message
      setSuccessMessage(data.message); // Display personalized success message

      // Redirect to login after 2 seconds
      setTimeout(() => {
        setSuccessMessage(""); // Clear success message
        window.location.href = "/login"; // Redirect to login page
      }, 2000); // Wait for 2 seconds before redirecting
    } else {
      setErrorMessage(data.message); // Show the error message if any
    }
  };

  return (
    <div className="App">
      <div className="note-list" style={{ marginTop: "-15px" }}>
        <h2 className="p-10 tasks-heading">Register</h2>
      </div>
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
      <button onClick={handleRegister}>Register</button>

      {/* Clear error message before showing success */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Display success message if registration is successful */}
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
