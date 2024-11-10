import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch transactions
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("JWT"); // Assuming JWT is stored in localStorage

        if (!token) {
          throw new Error("No token found, please log in.");
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/list`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError(err.message); // Handle any errors that occurred during fetch
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // If still loading, display a loading message
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // If there's an error, display the error message
  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#f0f0f0",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 className="text-center mb-4">Pending Requests</h2>

      {transactions.length === 0 ? (
        <div className="text-center">No pending requests</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Recipient</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.sender}</td>
                <td>{transaction.recipient}</td>
                <td>{transaction.status}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
