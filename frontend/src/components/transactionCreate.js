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
  const currencyRegex = /^[A-Z]{3}$/; // 3 uppercase letters

  function updateForm(value) {
    const newForm = { ...form, ...value };

    // Validation logic
    console.log("Updating form with value:", value); // Log the updated form values

    if (value.amount !== undefined) {
        if (!amountRegex.test(value.amount)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                amount: "Amount must be a number between 1 and 1,000,000.",
            }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, amount: "" }));
        }
    }

    if (value.currency !== undefined) {
        if (!currencyRegex.test(value.currency)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                currency: "Currency must be a valid ISO code (e.g., ZAR, USD).",
            }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, currency: "" }));
        }
    }

    if (value.accountNumber !== undefined) {
        if (value.accountNumber.trim().length === 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                accountNumber: "Recipient account number is required.",
            }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, accountNumber: "" }));
        }
    }

    if (value.swiftCode !== undefined) {
        if (!swiftCodeRegex.test(value.swiftCode)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                swiftCode: "SWIFT code must be exactly 8 digits.",
            }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, swiftCode: "" }));
        }
    }

    setForm(newForm);
}


// Add this function to check for errors
function hasErrors() {
  return Object.values(errors).some(error => error !== ""); // Check if any error is present
}

async function onSubmit(e) {
  e.preventDefault();

  // Check for errors
  if (hasErrors()) {
      console.warn("Form submission failed due to validation errors", errors);
      window.alert(`Please correct the errors before submitting. 
      Errors: ${JSON.stringify(errors)}`);
      return;
  }

  // Retrieve the JWT token from localStorage
  const jwt = localStorage.getItem("JWT");

  if (!jwt) {
      console.warn("JWT token not found in localStorage");
      window.alert("You must be logged in to make a transaction.");
      navigate("/login");
      return;
  }

  // Decode JWT to get sender's account number
  const payload = JSON.parse(atob(jwt.split(".")[1])); // Decode JWT to get sender's account number
  console.log("Decoded JWT payload:", payload);  // Log the decoded JWT payload

  const transactionData = {
      amount: form.amount,
      currency: form.currency,
      accountNumber: form.accountNumber,
      recipient: form.accountNumber,  // Use 'recipient' instead of 'recipiant'
      swiftCode: form.swiftCode,
      senderAccountNumber: payload.accountNumber,
      provider: "SWIFT",
      status: "Pending",
  };

  try {
      console.log("Sending transaction data:", transactionData);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/create`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`, // Include the JWT token in the request header for authentication
          },
          body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.warn("Non-JSON Response: ", errorText);  // Log the response body for debugging
          window.alert(`Transaction failed. Server Response: ${errorText}`);
          throw new Error("Transaction failed. Please try again.");
      }

      const data = await response.json();
      console.log("Transaction success data:", data);
      window.alert(`Transaction submitted successfully!\nTransaction ID: ${data.transactionId}`);

      navigate("/list"); // Navigate to the transaction list page
  } catch (error) {
      console.error("Error during transaction submission:", error);
      window.alert(`An error occurred: ${error.message}`);
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
