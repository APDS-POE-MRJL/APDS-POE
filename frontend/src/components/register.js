import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    password: "",
    idNumber: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    password: "",
    idNumber: ""
  });

  const navigate = useNavigate();

  // Regex patterns for validation
  const nameWhitelistRegex = /^[A-Za-z\s-]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const idNumberRegex = /^\d{13}$/;

  function updateForm(value) {
    const newForm = { ...form, ...value };

    // Validation logic
    if (value.name !== undefined && !nameWhitelistRegex.test(value.name)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        name: "Name can only contain letters, spaces, and hyphens."
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, name: "" }));
    }

    if (value.password !== undefined && !passwordRegex.test(value.password)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: "Password must have uppercase, lowercase, number, and special character."
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, password: "" }));
    }

    if (value.idNumber !== undefined && !idNumberRegex.test(value.idNumber)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        idNumber: "ID number must be exactly 13 digits."
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, idNumber: "" }));
    }

    setForm(newForm);
  }

  function hasErrors() {
    return errors.name || errors.password || errors.idNumber || !form.name || !form.password || !form.idNumber;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (hasErrors()) {
      window.alert("Please correct the errors before submitting.");
      return;
    }

    // Auto-generate the username and account number here
    const autoGeneratedUsername = `user${Math.floor(100000 + Math.random() * 900000)}`;
    const autoGeneratedAccountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));

    const newPerson = { 
      ...form, 
      userName: autoGeneratedUsername, 
      accountNumber: autoGeneratedAccountNumber 
    };

    await fetch(`${process.env.REACT_APP_API_URL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPerson),
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Wait for the response data
        } else {
          throw new Error("Registration failed. Please try again.");
        }
      })
      .then(data => {
        // Assuming the server returns the created user with their details
        if (data) {
          window.alert(`Registration successful!\nYour username: ${data.userName}\nYour account number: ${data.accountNumber}`);
          // Navigate to login page after successful registration
          navigate("/login", { state: { userName: data.userName, accountNumber: data.accountNumber } });
        }
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="Enter your full name"
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
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="idNumber">ID Number</label>
            <input
              type="text"
              className="form-control"
              id="idNumber"
              value={form.idNumber}
              onChange={(e) => updateForm({ idNumber: e.target.value })}
              placeholder="Enter your 13-digit ID number"
            />
            {errors.idNumber && <small className="text-danger">{errors.idNumber}</small>}
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
