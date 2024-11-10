import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const jwt = localStorage.getItem("JWT");
    if (jwt) {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      setRole(payload.role);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("JWT");
    localStorage.removeItem("name");
    setRole(null);
    navigate("/login"); // Redirect to the login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#34495e" }}>
      <NavLink className="navbar-brand" to="/">
        <img src={logo} alt="Logo" width="30" height="30" />
      </NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item mx-3">
            <NavLink className="nav-link" to="/">Home</NavLink>
          </li>
          {!role ? (
            <>
              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/register">Register</NavLink>
              </li>
              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
            </>
          ) : (
            <>
              {role === "user" && (
                <>
                  <li className="nav-item mx-3">
                    <NavLink className="nav-link" to="/transactionCreate">Create Transaction</NavLink>
                  </li>
                </>
              )}
              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/transactionList">Transaction List</NavLink>
              </li>
              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/auditList">Audit List</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      {role && (
        <div className="ms-auto" style={{ marginRight: "20px" }}>
          <button className="nav-link btn btn-link text-white" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
