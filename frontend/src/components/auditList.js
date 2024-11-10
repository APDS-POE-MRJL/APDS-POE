import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuditList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("JWT");

        if (!token) {
          throw new Error("No token found, please log in.");
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setRole(decodedToken.role);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/auditlist`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to fetch a user's profile
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

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#34495e",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 className="text-center mb-4"style={{ color: "#f1f1f1" }}>Audit List</h2>

      {transactions.length === 0 ? (
        <div className="text-center">No audit records found</div>
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
