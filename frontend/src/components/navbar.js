import React from "react";
import logo from "../logo.svg";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const jwt = localStorage.getItem('JWT');
  const name = localStorage.getItem('name');

  const handleSignOut = () => {
    localStorage.removeItem('JWT');
    localStorage.removeItem('name');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <NavLink className="navbar-brand" to="/">
        <img src={logo} alt="Logo" />
      </NavLink>
      <div className="navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">Home</NavLink>
          </li>
          {!jwt && !name ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">Register</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
