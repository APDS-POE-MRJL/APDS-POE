import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./Notification";

export default function Login() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    accountNumber: ""
  });

  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { userName, accountNumber } = location.state;
      setNotification({
        message: `Registration Successful! Your username: ${userName}, Account number: ${accountNumber}`,
        type: "success"
      });
    }
  }, [location.state]);

  function updateForm(value) {
    setForm(prev => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setNotification({
          message: "Invalid credentials, please try again!",
          type: "danger"
        });
        return;
      }

      const data = await response.json();
      const { token, accountNumber } = data;

      setNotification({
        message: "Login successful!",
        type: "success"
      });

      localStorage.setItem("JWT", token);
      localStorage.setItem("accountNumber", accountNumber);

      setForm({ userName: "", password: "", accountNumber: "" });

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000); // Delay navigation to let the user see the notification

    } catch (error) {
      setNotification({
        message: "Login failed: " + error.message,
        type: "danger"
      });
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#333333",
        color: "#f1f1f1"
      }}
    >
      <div className="card p-4 shadow" style={{
        width: "350px",
        backgroundColor: "#34495e",
        borderRadius: "8px"
      }}>
        <h2 className="text-center mb-4" style={{ color: "#FFFFFF" }}>Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="userName" style={{ color: "#FFFFFF" }}>Username</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              value={form.userName}
              onChange={(e) => updateForm({ userName: e.target.value })}
              placeholder="Enter your username"
              style={{ backgroundColor: "#f9f9f9" }}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" style={{ color: "#FFFFFF" }}>Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
              placeholder="Enter your password"
              style={{ backgroundColor: "#f9f9f9" }}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="accountNumber" style={{ color: "#FFFFFF" }}>Account Number</label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              value={form.accountNumber}
              onChange={(e) => updateForm({ accountNumber: e.target.value })}
              placeholder="Enter your account number"
              style={{ backgroundColor: "#f9f9f9" }}
            />
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-warning"
              style={{
                backgroundColor: "#f1c40f",
                color: "#34495e",
                fontWeight: "bold"
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {/* Notification component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
