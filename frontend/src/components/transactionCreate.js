import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./Notification"; // Import the Notification component

export default function TransactionCreate() {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    accountNumber: "",
    swiftCode: ""
  });
  const [errors, setErrors] = useState({
    amount: "",
    currency: "",
    accountNumber: "",
    swiftCode: ""
  });
  const [notification, setNotification] = useState(null); // Notification state

  const navigate = useNavigate();

  const swiftCodeRegex = /^\d{8}$/;
  const amountRegex = /^[1-9]\d{0,6}$/;
  const currencyRegex = /^[A-Z]{3}$/;

  function updateForm(value) {
    const newForm = { ...form, ...value };

    if (value.amount !== undefined) {
      if (!amountRegex.test(value.amount)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          amount: "Amount must be a number between 1 and 1,000,000."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, amount: "" }));
      }
    }

    if (value.currency !== undefined) {
      if (!currencyRegex.test(value.currency)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          currency: "Currency must be a valid ISO code (e.g., ZAR, USD)."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, currency: "" }));
      }
    }

    if (value.accountNumber !== undefined) {
      if (value.accountNumber.trim().length === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          accountNumber: "Recipient account number is required."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, accountNumber: "" }));
      }
    }

    if (value.swiftCode !== undefined) {
      if (!swiftCodeRegex.test(value.swiftCode)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          swiftCode: "SWIFT code must be exactly 8 digits."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, swiftCode: "" }));
      }
    }

    setForm(newForm);
  }

  function hasErrors() {
    return Object.values(errors).some((error) => error !== "");
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (hasErrors()) {
      setNotification({
        message: `Please correct the errors before submitting.`,
        type: "warning"
      });
      return;
    }

    const jwt = localStorage.getItem("JWT");

    if (!jwt) {
      setNotification({
        message: "You must be logged in to make a transaction.",
        type: "danger"
      });
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(jwt.split(".")[1]));

    const transactionData = {
      amount: form.amount,
      currency: form.currency,
      accountNumber: form.accountNumber,
      recipient: form.accountNumber,
      code: form.swiftCode,
      senderAccountNumber: payload.accountNumber,
      provider: "SWIFT",
      status: "Pending"
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/requests/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify(transactionData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setNotification({
          message: `Transaction failed. Server Response: ${errorText}`,
          type: "danger"
        });
        throw new Error("Transaction failed. Please try again.");
      }

      const data = await response.json();
      setNotification({
        message: "Transaction submitted successfully!",
        type: "success"
      });

      setTimeout(() => {
        navigate("/transactionList");
      }, 3000);
    } catch (error) {
      setNotification({
        message: `An error occurred: ${error.message}`,
        type: "danger"
      });
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#333333" }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: "400px", backgroundColor: "#34495e", color: "white" }}
      >
        <h2 className="text-center mb-4">Create Transaction</h2>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
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
            {errors.accountNumber && (
              <small className="text-danger">{errors.accountNumber}</small>
            )}
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
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "yellow", color: "#34495e", fontWeight: "bold" }}
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
