import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    password: "",
    idNumber: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    password: "",
    idNumber: ""
  });

  const navigate = useNavigate();

  const nameWhitelistRegex = /^[A-Za-z\s-]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const idNumberRegex = /^\d{13}$/;

  function updateForm(value) {
    const newForm = { ...form, ...value };

    if (value.name !== undefined && !nameWhitelistRegex.test(value.name)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        name: "Name can only contain letters, spaces, and hyphens."
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, name: "" }));
    }

    if (value.password !== undefined && !passwordRegex.test(value.password)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: "Password must include uppercase, lowercase, number, and special character."
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, password: "" }));
    }

    if (value.idNumber !== undefined && !idNumberRegex.test(value.idNumber)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        idNumber: "ID number must be exactly 13 digits."
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, idNumber: "" }));
    }

    setForm(newForm);
  }

  function hasErrors() {
    return (
      errors.name ||
      errors.password ||
      errors.idNumber ||
      !form.name ||
      !form.password ||
      !form.idNumber
    );
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (hasErrors()) {
      window.alert("Please correct the errors before submitting.");
      return;
    }

    const autoGeneratedUsername = `user${Math.floor(100000 + Math.random() * 900000)}`;
    const autoGeneratedAccountNumber = String(
      Math.floor(1000000000 + Math.random() * 9000000000)
    );

    const newPerson = {
      ...form,
      userName: autoGeneratedUsername,
      accountNumber: autoGeneratedAccountNumber
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerson)
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      const data = await response.json();

      window.alert(`Registration successful!\nYour username: ${data.userName}\nYour account number: ${data.accountNumber}`);

      navigate("/login", { state: { userName: data.userName, accountNumber: data.accountNumber } });
      
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#333333",
        color: "#f1f1f1"
      }}
    >
      <div className="card p-4 shadow" style={{
        width: "350px",
        backgroundColor: "#34495e",
        borderRadius: "8px"
      }}>
        <h2 className="text-center mb-4" style={{ color: "#FFFFFF" }}>Register</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" style={{ color: "#34495e" }}>Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="Enter your full name"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" style={{ color: "#34495e" }}>Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
              placeholder="Enter your password"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="idNumber" style={{ color: "#34495e" }}>ID Number</label>
            <input
              type="text"
              className="form-control"
              id="idNumber"
              value={form.idNumber}
              onChange={(e) => updateForm({ idNumber: e.target.value })}
              placeholder="Enter your 13-digit ID number"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.idNumber && <small className="text-danger">{errors.idNumber}</small>}
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-warning"
              style={{
                backgroundColor: "#f1c40f",
                color: "#34495e"
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
