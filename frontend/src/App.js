import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar.js"
import PostList from "./components/postList.js"
import EditPost from "./components/postEdit.js"
import CreatePost from "./components/postCreate.js"
import Register from "./components/register.js"
import Login from "./components/login.js"

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
