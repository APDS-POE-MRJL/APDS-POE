import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#333333" }}> {/* Dark grey background wrapper */}
      
      {/* Hero Section */}
      <div
  className="d-flex align-items-center justify-content-center text-center"
  style={{
    backgroundImage: `url('images/backimg.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "80vh",
  }}
>
  <div
    style={{
      backgroundColor: "#34495e", // Blue-gray background color
      padding: "20px",
      borderRadius: "8px",
    }}
  >
    <h1 style={{ color: "#f1f1f1" }}>Welcome to APDSBank</h1>
    <p className="lead" style={{ color: "#f1f1f1" }}>
      Your trusted partner in financial growth and security.
    </p>
  </div>
</div>

      {/* Features Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4" style={{ color: "#f1f1f1" }}>Our Services</h2> {/* Lightened text */}
        <div className="row">
          {/* Feature 1 */}
          <div className="col-md-4 text-center">
            <h3 style={{ color: "#f1f1f1" }}>Credit Cards</h3>
            <p style={{ color: "#d3d3d3" }}>Enjoy flexibility and rewards with our range of credit cards designed to suit your lifestyle and needs.</p>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4 text-center">
            <h3 style={{ color: "#f1f1f1" }}>Personal Loans</h3>
            <p style={{ color: "#d3d3d3" }}>Whether you're planning a vacation or home improvements, we offer loans with competitive rates and terms.</p>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4 text-center">
            <h3 style={{ color: "#f1f1f1" }}>Investment Plans</h3>
            <p style={{ color: "#d3d3d3" }}>Grow your wealth with our expert-led investment plans tailored to achieve your financial goals.</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div
        className="text-center text-white py-5"
        style={{
          backgroundColor: "#2c3e50",
          backgroundImage: "linear-gradient(315deg, #34495e 0%, #2c3e50 74%)",
          color: "#f1c40f",
        }}
      >
        <h2>Join Our Community of Financially Empowered Customers</h2>
        <p>Sign up now to access exclusive benefits and achieve your financial goals with confidence.</p>
      </div>

      {/* Footer Section */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>About Us</h5>
              <p>YourBank has been empowering customers with secure banking solutions for over a decade. Join us today!</p>
            </div>
            <div className="col-md-4">
              <h5>Contact Us</h5>
              <p>Email: support@yourbank.com</p>
              <p>Phone: +123 456 7890</p>
            </div>
            <div className="col-md-4">
              <h5>Follow Us</h5>
              <p>
                <a href="#" className="text-warning me-2">Facebook</a>
                <a href="#" className="text-warning me-2">Twitter</a>
                <a href="#" className="text-warning">Instagram</a>
              </p>
            </div>
          </div>
          <div className="text-center mt-3">
            <p>&copy; 2024 YourBank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
