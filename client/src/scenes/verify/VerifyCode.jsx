import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css"; // Import a CSS file for advanced styling

const VerifyCode = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [otp, setOtp] = useState(""); // State for OTP
  const [message, setMessage] = useState(""); // State for success/error messages
  const [error, setError] = useState(""); // State for error
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate(); // To redirect after success

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/reset-password",
        {
          email,
          password,
          OTP: otp,
        }
      );

      // Handle successful response
      if (response.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
      } else {
        setError(response.data.message || "Invalid OTP or email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Your Password</h2>
        <p className="auth-description">
          Enter the 6-digit code sent to your email and create a new password.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              required
            />
          </div>

          {/* OTP Field */}
          <div className="form-group">
            <label htmlFor="otp">6-Digit Code</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              maxLength={6}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Reset Password"}
          </button>
        </form>

        {/* Feedback Messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyCode;
