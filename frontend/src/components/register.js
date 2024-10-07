import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    password: ""
  });

  const navigate = useNavigate();

  // Regex patterns for whitelisting and validation
  const nameWhitelistRegex = /^[A-Za-z\s-]+$/; // Only letters, spaces, and hyphens allowed
  const passwordWhitelistRegex = /^[A-Za-z\d!@#$%^&*()_+~`|}{[\]:;?><,./-=]+$/; // Allow letters, numbers, and special characters
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/; // At least 8 characters, with uppercase, lowercase, number, and special character

  // Function to update form values and validate inputs
  function updateForm(value) {
    const newForm = { ...form, ...value };

    // Validate name with whitelisting
    if (value.name !== undefined) {
      if (!nameWhitelistRegex.test(value.name)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          name: "Name can only contain letters, spaces, and hyphens."
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          name: ""
        }));
      }
    }

    // Validate password with whitelisting
    if (value.password !== undefined) {
      if (!passwordWhitelistRegex.test(value.password)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: "Password contains invalid characters."
        }));
      } else if (!passwordRegex.test(value.password)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: ""
        }));
      }
    }

    setForm(newForm);
  }

  // Helper function to check if the form has any errors
  function hasErrors() {
    return errors.name || errors.password || !form.name || !form.password;
  }

  async function onSubmit(e) {
    e.preventDefault();

    // Check if there are any validation errors or empty fields
    if (hasErrors()) {
      window.alert("Please correct the errors before submitting.");
      return;
    }

    const newPerson = { ...form };

    // Use the environment variable for the backend URL
    await fetch(`${process.env.REACT_APP_API_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
      .then(response => {
        if (response.ok) {
          // Registration successful
          window.alert("Registration successful!");
          setForm({ name: "", password: "" });
          navigate("/");
        } else {
          // Handle server-side validation errors
          window.alert("Registration failed. Please try again.");
        }
      })
      .catch(error => {
        window.alert("Registration failed: " + error);
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="Enter your name"
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={hasErrors()}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

