import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./forgot.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
 const handleSubmit = async (e) => {
   e.preventDefault();
   setMessage("");
   setError("");
   setLoading(true);

   try {
     const response = await axios.post(
       "http://localhost:3001/auth/send-resetOTP",
       { email }
     );

     if (response.data.success) {
       setMessage("Reset link sent! Check your email.");
       setTimeout(() => {
         navigate("/reset-password", { state: { email } }); // Navigate here
       }, 2000);
     } else {
       setError(response.data.message || "An error occurred.");
     }
   } catch (err) {
     setError(err.response?.data?.message || "Failed to send reset link.");
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-description">
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className="forgot-form">
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

          {/* Submit Button */}
          <button type="submit" className="forgot-button" disabled={loading} >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Feedback Messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Back to Login Link */}
        <div className="forgot-footer">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
