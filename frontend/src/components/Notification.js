import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`alert alert-${type} text-center`}
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
        width: "90%",
        maxWidth: "500px"
      }}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Notification;
