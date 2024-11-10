import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar.js";
import PostList from "./components/postList.js";
import Register from "./components/register.js";
import Login from "./components/login.js";
import Homepage from "./components/homepage.js";
//import AdminSignup from "./components/adminsignup.js"; 
import TransactionCreate from './components/transactionCreate.js';
import AuditList from "./components/auditList.js";
import TransactionList from "./components/transactionList.js";


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      {/*   <Route path="/adminsignup" element={<AdminSignup />} /> {/* Add the AdminSignup route */}
      <Route path="/transactionCreate" element={<TransactionCreate />} />
      <Route path="/auditList" element={<AuditList />} />
      <Route path="/transactionList" element={<TransactionList />} />
      </Routes>
    </div>
  );
}

export default App;
