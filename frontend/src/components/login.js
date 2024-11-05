import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    accountNumber: ""
  });

  const navigate = useNavigate();
  const location = useLocation(); // Get the location object

  // Use useEffect to check if there is state passed from the Register component
  useEffect(() => {
    if (location.state) {
      const { userName, accountNumber } = location.state;
      window.alert(`Registration Successful!\nYour username: ${userName}\nYour account number: ${accountNumber}`);
    }
  }, [location.state]); // Only run when the location state changes

  function updateForm(value) {
    setForm(prev => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(error => {
      window.alert("Login failed: " + error);
      return;
    });

    if (!response.ok) {
      window.alert("Invalid credentials, please try again!");
      return;
    }

    const data = await response.json();
    const { token, accountNumber } = data;

    window.alert("Authentication successful!");

    localStorage.setItem("JWT", token);
    localStorage.setItem("accountNumber", accountNumber);

    setForm({ userName: "", password: "", accountNumber: "" });
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              value={form.userName}
              onChange={(e) => updateForm({ userName: e.target.value })}
              placeholder="Enter your username"
            />
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
          </div>
          <div className="form-group mb-3">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              value={form.accountNumber}
              onChange={(e) => updateForm({ accountNumber: e.target.value })}
              placeholder="Enter your account number"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
