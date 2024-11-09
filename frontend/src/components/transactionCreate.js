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

  // Regex patterns for validation
  const swiftCodeRegex = /^\d{8}$/;
  const amountRegex = /^[1-9]\d{0,6}$/; // up to 1,000,000 (excluding 0)

  function updateForm(value) {
    const newForm = { ...form, ...value };

    // Validation logic
    if (value.amount !== undefined && (value.amount <= 0 || value.amount > 1000000)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        amount: "Amount must be between 1 and 1,000,000.",
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, amount: "" }));
    }

    if (value.currency !== undefined && value.currency.trim().length === 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        currency: "Currency is required.",
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, currency: "" }));
    }

    if (value.accountNumber !== undefined && value.accountNumber.trim().length === 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        accountNumber: "Recipient account number is required.",
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, accountNumber: "" }));
    }

    if (value.swiftCode !== undefined && !swiftCodeRegex.test(value.swiftCode)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        swiftCode: "SWIFT code must be exactly 8 digits.",
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, swiftCode: "" }));
    }

    setForm(newForm);
  }

  function hasErrors() {
    return (
      errors.amount ||
      errors.currency ||
      errors.accountNumber ||
      errors.swiftCode ||
      !form.amount ||
      !form.currency ||
      !form.accountNumber ||
      !form.swiftCode
    );
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (hasErrors()) {
      window.alert("Please correct the errors before submitting.");
      return;
    }

    const jwt = localStorage.getItem("JWT");
    const payload = JSON.parse(atob(jwt.split(".")[1])); // Decode JWT to get sender's account number

    const transactionData = {
      amount: form.amount,
      currency: form.currency,
      accountNumber: form.accountNumber,
      swiftCode: form.swiftCode,
      senderAccountNumber: payload.accountNumber, // Sender's account number from JWT
      provider: "SWIFT",
      status: "Pending", // Default status
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/request/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`, // Include the JWT token in the request
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Transaction failed. Please try again.");
      }

      const data = await response.json();

      // Display the success message
      window.alert(`Transaction submitted successfully!\nTransaction ID: ${data.transactionId}`);

      // Redirect to the transaction list or another page if necessary
      navigate("/list"); // Navigate to the transaction list page
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Create Transaction</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={form.amount}
              onChange={(e) => updateForm({ amount: e.target.value })}
              placeholder="Enter amount"
            />
            {errors.amount && <small className="text-danger">{errors.amount}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="currency">Currency</label>
            <input
              type="text"
              className="form-control"
              id="currency"
              value={form.currency}
              onChange={(e) => updateForm({ currency: e.target.value })}
              placeholder="Enter currency (e.g. ZAR, USD)"
            />
            {errors.currency && <small className="text-danger">{errors.currency}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="accountNumber">Recipient Account Number</label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              value={form.accountNumber}
              onChange={(e) => updateForm({ accountNumber: e.target.value })}
              placeholder="Enter recipient's account number"
            />
            {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="swiftCode">SWIFT Code</label>
            <input
              type="text"
              className="form-control"
              id="swiftCode"
              value={form.swiftCode}
              onChange={(e) => updateForm({ swiftCode: e.target.value })}
              placeholder="Enter 8-digit SWIFT code"
            />
            {errors.swiftCode && <small className="text-danger">{errors.swiftCode}</small>}
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={hasErrors()}>
              Send Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
