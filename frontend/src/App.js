import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar.js"
import PostList from "./components/postList.js"
import Register from "./components/register.js"
import Login from "./components/login.js"
import Homepage from "./components/homepage.js"

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        {/* 
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/create" element={<CreatePost />} />
        */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
