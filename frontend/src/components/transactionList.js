import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Store the user's role
  const [userProfile, setUserProfile] = useState(null); // For viewing user profile details
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    // Function to fetch transactions
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("JWT"); // Assuming JWT is stored in localStorage

        if (!token) {
          throw new Error("No token found, please log in.");
        }

        // Decode the token to extract the user's role
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode base64 part of JWT
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

  // Function to fetch user profile based on account number
  const fetchUserProfile = async (accountNumber) => {
    try {
      const token = localStorage.getItem("JWT");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/locate?accountNumber=${accountNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setProfileError("User profile not found");
        setUserProfile(null);
        return;
      }

      const profileData = await response.json();
      setUserProfile(profileData);
      setProfileError(null);
    } catch (err) {
      setProfileError("An error occurred while fetching the profile.");
      setUserProfile(null);
    }
  };

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
              <th>Amount</th>
              <th>Currency</th>
              <th>Recipient</th>
              <th>Provider</th>
              <th>Code</th>
              <th>Status</th>
              {role === "admin" && <th>Actions</th>} {/* Only show actions if the role is admin */}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>
                  {role === "admin" ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchUserProfile(transaction.sender);
                      }}
                    >
                      {transaction.sender}
                    </a>
                  ) : (
                    transaction.sender
                  )}
                </td>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>
                  {role === "admin" ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchUserProfile(transaction.recipient);
                      }}
                    >
                      {transaction.recipient}
                    </a>
                  ) : (
                    transaction.recipient
                  )}
                </td>
                <td>{transaction.provider}</td>
                <td>{transaction.code}</td>
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

      {userProfile && (
        <div className="alert alert-warning mt-4">
          <h5>User Profile</h5>
          <p><strong>Name:</strong> {userProfile.name}</p>
          <p><strong>Username:</strong> {userProfile.userName}</p>
          <p><strong>ID Number:</strong> {userProfile.idNumber}</p>
          <p><strong>Account Number:</strong> {userProfile.accountNumber}</p>
          <p><strong>Role:</strong> {userProfile.role}</p>
        </div>
      )}

      {profileError && (
        <div className="alert alert-danger mt-4">
          {profileError}
        </div>
      )}
    </div>
  );
}
