import logo from './logo.svg';
import './App.css';
import React from "react";

import { Route, Routes} from "react-router-dom";

import Navbar from "./components/navbar"
import PostList from "./components/postList"
import EditPost from "./components/postEdit"
import CreatePost from "./components/postCreate"
import Register from "./components/register"
import Login from "./components/login"

function App() {
  return (
    <div className="Navbar">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<PostList />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

/* 
old, initial code for project
<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to the initial build
        </p>
        <a>
          We're going to build the frontend here
        </a>
      </header> */