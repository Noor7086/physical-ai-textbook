import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAuthContext } from "../components/AuthProvider";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const history = useHistory();
  const { login, isAuthenticated } = useAuthContext();

  // If already logged in, redirect
  if (isAuthenticated && !success) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "2rem auto",
          padding: "0 1rem",
          textAlign: "center",
        }}
      >
        <h1>Already Logged In</h1>
        <p>You are already logged in.</p>
        <Link to="/" className="button button--primary">
          Go to Textbook
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "2rem auto",
          padding: "0 1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#e6f4ea",
            color: "#2e8555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 16px",
          }}
        >
          &#10003;
        </div>
        <h1>Logged In Successfully!</h1>
        <p>Welcome back! You are now logged in.</p>
        <Link
          to="/"
          className="button button--primary button--lg"
          style={{ marginTop: 16 }}
        >
          Go to Textbook
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Log In</h1>
      <p>Welcome back! Log in to access personalized content.</p>

      {error && (
        <div
          style={{
            padding: "8px 12px",
            background: "#fee",
            color: "#c00",
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="button button--primary button--block"
          style={{ marginBottom: 16 }}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p style={{ textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Layout
      title="Log In"
      description="Log in to your Physical AI Textbook account"
    >
      <BrowserOnly
        fallback={
          <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
        }
      >
        {() => <LoginForm />}
      </BrowserOnly>
    </Layout>
  );
}
