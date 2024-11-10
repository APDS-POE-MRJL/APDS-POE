import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      // Get the token from local storage or authentication context
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please log in.");
      }

      // Call the backend API to fetch transactions
      const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the header
        },
      });

      // Check if response is not OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch transactions:", errorText);
        throw new Error("Failed to fetch transactions");
      }

      // Parse the response data
      const data = await response.json();
      console.log("Transaction data:", data);  // Log the response data for debugging
      setTransactions(data);  // Set the fetched transactions to the state
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message);  // Set error message for UI display
    } finally {
      setLoading(false);  // Set loading to false after fetch is complete
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Render the list of transactions
  return (
    <div className="container mt-4">
      <h2>Transaction List</h2>
      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-danger">{error}</p>}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Code</th>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.code}>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.provider}</td>
                <td>{transaction.code}</td>
                <td>{transaction.sender}</td>
                <td>{transaction.recipient}</td>
                <td>{transaction.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
