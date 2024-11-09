import React, { useEffect, useState } from "react";

export default function AuditList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAuditList() {
      const jwt = localStorage.getItem("JWT");

      if (!jwt) {
        setError("Unauthorized: Please log in to view the audit list.");
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/request/auditlist`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`, // Include the JWT token in the request header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the audit list. Please try again.");
        }

        const data = await response.json();
        setTransactions(data); // Assume `data` is an array of transactions
      } catch (err) {
        setError(err.message);
      }
    }

    fetchAuditList();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Audit List</h2>
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Sender Account</th>
              <th>Recipient Account</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>SWIFT Code</th>
              <th>Status</th>
              <th>Provider</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.transactionId}</td>
                <td>{transaction.senderAccountNumber}</td>
                <td>{transaction.accountNumber}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.swiftCode}</td>
                <td>{transaction.status}</td>
                <td>{transaction.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
