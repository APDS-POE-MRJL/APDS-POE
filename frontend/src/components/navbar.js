import React from "react";
import logo from "../logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <NavLink className="navbar-brand" to="/">
        <img style={{ width: "50px" }} src={logo} alt="Logo" />
      </NavLink>
      <div className="navbar" id = "navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
            <NavLink className="nav-link" to="/">
            List
            </NavLink>   
            <NavLink className="nav-link" to="/create">
            Create Post
            </NavLink>
            <NavLink className="nav-link" to="/register">
            Register
            </NavLink>
            <NavLink className="nav-link" to="/login">
            Login
            </NavLink>       
        </ul>
      </div>
    </nav>
    </div>
  );
}
