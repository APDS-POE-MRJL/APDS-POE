import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Store the user's role

  useEffect(() => {
    // Function to fetch transactions
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("JWT"); // Assuming JWT is stored in localStorage

        if (!token) {
          throw new Error("No token found, please log in.");
        }

        // Decode the token to extract the user's role
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode base64 part of JWT
        const userRole = decodedToken.role;
        setRole(userRole); // Set the role (assuming it's in the token)

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

  // Approve a transaction
  const approveTransaction = async (transactionId) => {
    try {
      const token = localStorage.getItem("JWT");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: transactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve the transaction");
      }

      // Refresh the transactions list after approval
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status: "Approved" }
            : transaction
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Reject a transaction
  const rejectTransaction = async (transactionId) => {
    try {
      const token = localStorage.getItem("JWT");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/reject`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: transactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject the transaction");
      }

      // Refresh the transactions list after rejection
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status: "Rejected" }
            : transaction
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

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
      <h2 className="text-center mb-4">Requests</h2>

      {transactions.length === 0 ? (
        <div className="text-center">No requests</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Recipient</th>
              <th>Status</th>
              {role === "admin" && <th>Actions</th>} {/* Only show actions if the role is admin */}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.sender}</td>
                <td>{transaction.recipient}</td>
                <td>{transaction.status}</td>
                {role === "admin" && (
                  <td>
                    {transaction.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success mr-2"
                          onClick={() => approveTransaction(transaction._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => rejectTransaction(transaction._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
