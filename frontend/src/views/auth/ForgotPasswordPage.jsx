import { useState } from "react";

import {
  Mail,
  ArrowLeft
} from "lucide-react";


export default function ForgotPasswordPage({
  onBack
}) {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setLoading(true);

    setMessage("");
    setError("");

    try {

      const response = await fetch(
          "http://localhost:8000/api/v1/auth/forgot_password/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email
            })
          }
        );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(

            data.detail ||

            data.message ||

            JSON.stringify(data)
          );
        }

        setMessage(
          data.message ||
          "If account exists, email was sent."
        );

      setMessage(
        response.data.message ||
        "If account exists, email was sent."
      );

    }finally {

      setLoading(false);
    }
  }

  return (

    <div className="forgot-wrapper">

      <div className="forgot-card">

        <button
          type="button"
          className="forgot-back-btn"
          onClick={onBack}
        >

          <ArrowLeft size={18} />

          Back to Login

        </button>

        <div className="forgot-header">

          <div className="forgot-icon">

            <Mail size={28} />

          </div>

          <h1>Forgot Password</h1>

          <p>
            Enter your account email to
            receive a password reset link.
          </p>

        </div>

        <form
          className="forgot-form"
          onSubmit={handleSubmit}
        >

          <div className="forgot-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

          </div>

          {
            message && (
              <div className="success-message">
                {message}
              </div>
            )
          }

          {
            error && (
              <div className="error-message">
                {error}
              </div>
            )
          }

          <button
            type="submit"
            className="forgot-submit-btn"
            disabled={loading}
          >

            {
              loading
                ? "Sending..."
                : "Send Reset Link"
            }

          </button>

        </form>

      </div>

    </div>
  );
}