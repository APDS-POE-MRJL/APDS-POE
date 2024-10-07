import React from "react";
import logo from "../logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useHistory } from "react-router-dom";

export default function Navbar() {
  const jwt = localStorage.getItem('JWT');
  const name = localStorage.getItem('name');

  const handleSignOut = () => {
    localStorage.removeItem('JWT');
    localStorage.removeItem('name');
    window.location.reload();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <NavLink className="navbar-brand" to="/">
          <img style={{ width: "50px" }} src={logo} alt="Logo" />
        </NavLink>
        <div className="navbar" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <NavLink className="nav-link" to="/">
              Home Page
            </NavLink>
            {!jwt && !name ? (
              <>
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </>
            ) : (
              <button className="nav-link btn" onClick={handleSignOut}>
                Sign Out
              </button>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}