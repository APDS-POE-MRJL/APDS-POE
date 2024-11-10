import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TransactionCreate() {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    accountNumber: "",
    swiftCode: "",
  });
  const [errors, setErrors] = useState({
    amount: "",
    currency: "",
    accountNumber: "",
    swiftCode: "",
  });

  const navigate = useNavigate();

  const swiftCodeRegex = /^\d{8}$/;
  const amountRegex = /^[1-9]\d{0,6}$/;
  const currencyRegex = /^[A-Z]{3}$/;

  function updateForm(value) {
    const newForm = { ...form, ...value };
    // Validation logic
    if (value.amount !== undefined) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            amount: !amountRegex.test(value.amount) ? "Amount must be a number between 1 and 1,000,000." : "",
        }));
    }

    if (value.currency !== undefined) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            currency: !currencyRegex.test(value.currency) ? "Currency must be a valid ISO code (e.g., ZAR, USD)." : "",
        }));
    }

    if (value.accountNumber !== undefined) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            accountNumber: value.accountNumber.trim().length === 0 ? "Recipient account number is required." : "",
        }));
    }

    if (value.swiftCode !== undefined) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            swiftCode: !swiftCodeRegex.test(value.swiftCode) ? "SWIFT code must be exactly 8 digits." : "",
        }));
    }

    setForm(newForm);
  }

  function hasErrors() {
    return Object.values(errors).some((error) => error !== "");
  }
 
  async function onSubmit(e) {
    e.preventDefault();
    if (hasErrors()) {
      window.alert("Please correct the errors before submitting.");
      return;
    }

    const jwt = localStorage.getItem("JWT");
    if (!jwt) {
      window.alert("You must be logged in to make a transaction.");
      navigate("/login");
      return;
    }
    
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    const transactionData = {
      amount: form.amount,
      currency: form.currency,
      accountNumber: form.accountNumber,
      code: form.swiftCode,
      senderAccountNumber: payload.accountNumber,
      provider: "SWIFT",
      status: "Pending",
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        window.alert(`Transaction failed. Server Response: ${errorText}`);
        throw new Error("Transaction failed. Please try again.");
      }

      const data = await response.json();
      window.alert("Transaction submitted successfully!");
      navigate("/transactionList");
    } catch (error) {
      window.alert(`An error occurred: ${error.message}`);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#333333",
        color: "#f1f1f1",
      }}
    >
      <div className="card p-4 shadow" style={{
        width: "400px",
        backgroundColor: "#34495e",
        borderRadius: "8px",
      }}>
        <h2 className="text-center mb-4" style={{ color: "#FFFFFF" }}>Create Transaction</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="amount" style={{ color: "#FFFFFF" }}>Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={form.amount}
              onChange={(e) => updateForm({ amount: e.target.value })}
              placeholder="Enter amount"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.amount && <small className="text-danger">{errors.amount}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="currency" style={{ color: "#FFFFFF" }}>Currency</label>
            <input
              type="text"
              className="form-control"
              id="currency"
              value={form.currency}
              onChange={(e) => updateForm({ currency: e.target.value })}
              placeholder="Enter currency (e.g. ZAR, USD)"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.currency && <small className="text-danger">{errors.currency}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="accountNumber" style={{ color: "#FFFFFF" }}>Recipient Account Number</label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              value={form.accountNumber}
              onChange={(e) => updateForm({ accountNumber: e.target.value })}
              placeholder="Enter recipient's account number"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="swiftCode" style={{ color: "#FFFFFF" }}>SWIFT Code</label>
            <input
              type="text"
              className="form-control"
              id="swiftCode"
              value={form.swiftCode}
              onChange={(e) => updateForm({ swiftCode: e.target.value })}
              placeholder="Enter 8-digit SWIFT code"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            {errors.swiftCode && <small className="text-danger">{errors.swiftCode}</small>}
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-warning"
              style={{
                backgroundColor: "#f1c40f",
                color: "#34495e",
              }}
              disabled={hasErrors()}
            >
              Send Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
