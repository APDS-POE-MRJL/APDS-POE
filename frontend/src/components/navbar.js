import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const [role, setRole] = useState(null);

  // Retrieve role from JWT token on mount
  useEffect(() => {
    const jwt = localStorage.getItem("JWT");
    if (jwt) {
      // Decode JWT to get user role
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      setRole(payload.role); // Expect "admin" or "user" here
    }
  }, []);

  // Sign out function
  const handleSignOut = () => {
    localStorage.removeItem("JWT");
    localStorage.removeItem("name");
    setRole(null); // Clear role on sign-out
    window.location.reload(); // Reload to refresh navigation
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink className="navbar-brand" to="/">
        <img src={logo} alt="Logo" width="30" height="30" />
      </NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mx-3">
            <NavLink className="nav-link" to="/">Home</NavLink>
          </li>
          {!role ? (
            // When no user is logged in
            <>
              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/register">Register</NavLink>
              </li>
              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
            </>
          ) : (
            // When a user is logged in
            <>
              {role === "admin" && (
                // Admin-only links
                <>
                  <li className="nav-item mx-3">
                    <NavLink className="nav-link" to="/admin/transactionlist">All Transactions</NavLink>
                  </li>
                  <li className="nav-item mx-3">
                    <NavLink className="nav-link" to="/admin/auditlist">All Audits</NavLink>
                  </li>
                </>
              )}
              {/* Links accessible to both users and admins */}

              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/transactionCreate">Create Transaction</NavLink>
              </li>

              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/list">Transaction List</NavLink>
              </li>

              <li className="nav-item mx-3">
                <NavLink className="nav-link" to="/auditList">Audit List</NavLink>
              </li>
              
              <li className="nav-item mx-3">
                <button className="nav-link btn btn-link" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
