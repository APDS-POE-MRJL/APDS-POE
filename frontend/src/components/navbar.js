import React from "react";
import logo from "../logo.svg"

import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink classname="navbar-brand" to="/">
                    <img style={{"width" : 25 + "%"}} src={logo}></img>
                </NavLink>
                <div className="navbar" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <NavLink className="nav-Link" to="/">
                        List
                        </NavLink>
                        <NavLink className="nav-Link" to="/create">
                        Create Post
                        </NavLink>
                        <NavLink className="nav-Link" to="/register">
                        Register
                        </NavLink>
                        <NavLink className="nav-Link" to="/login">
                        Login
                        </NavLink>
                    </ul>
                </div>
            </nav>
        </div>
    );
}