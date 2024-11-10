import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuditList() {
  const [requests, setRequests] = useState([]); // State to hold the requests
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  useEffect(() => {
    // Function to fetch audit requests
    const fetchAuditRequests = async () => {
      try {
        const token = localStorage.getItem("JWT"); // Get the JWT token from localStorage

        if (!token) {
          throw new Error("No token found, please log in.");
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/requests/auditlist`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch audit requests");
        }

        const data = await response.json();  // Parse the response as JSON
        setRequests(data);  // Set the fetched data into state
        setLoading(false);  // Set loading to false once the data is fetched
      } catch (err) {
        setError(err.message);  // Set the error message if something went wrong
        setLoading(false);  // Set loading to false in case of an error
      }
    };

    fetchAuditRequests();  // Call the function to fetch data on component mount
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
      <h2 className="text-center mb-4">Audit Log</h2>

      {requests.length === 0 ? (
        <div className="text-center">No requests found</div>
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
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.sender}</td>
                <td>{request.recipient}</td>
                <td>{request.status}</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
