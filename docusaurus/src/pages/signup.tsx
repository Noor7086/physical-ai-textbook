import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAuthContext } from "../components/AuthProvider";

const skillLevels = [
  { value: "none", label: "No Experience" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

function SignupForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pythonLevel, setPythonLevel] = useState("beginner");
  const [rosLevel, setRosLevel] = useState("none");
  const [mlLevel, setMlLevel] = useState("none");
  const [arduinoExp, setArduinoExp] = useState(false);
  const [jetsonExp, setJetsonExp] = useState(false);
  const [robotExp, setRobotExp] = useState(false);
  const [learningGoals, setLearningGoals] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const history = useHistory();
  const { signup, isAuthenticated } = useAuthContext();

  // If already logged in, redirect
  if (isAuthenticated) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "2rem auto",
          padding: "0 1rem",
          textAlign: "center",
        }}
      >
        <h1>Already Signed In</h1>
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
          maxWidth: 480,
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
        <h1>Account Created Successfully!</h1>
        <p>Welcome! Your account has been created and you are now logged in.</p>
        <p style={{ color: "#666", fontSize: 14 }}>
          You can now personalize textbook content based on your experience
          level.
        </p>
        <Link
          to="/"
          className="button button--primary button--lg"
          style={{ marginTop: 16 }}
        >
          Start Learning
        </Link>
      </div>
    );
  }

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 4,
    fontWeight: 600,
  };
  const fieldStyle: React.CSSProperties = { marginBottom: 16 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup({
        email,
        password,
        profile: {
          python_level: pythonLevel,
          ros_level: rosLevel,
          ml_level: mlLevel,
          arduino_experience: arduinoExp,
          jetson_experience: jetsonExp,
          robot_experience: robotExp,
          learning_goals: learningGoals || undefined,
        },
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Sign Up</h1>
      <p>Create an account to get personalized learning content.</p>

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

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: step >= 1 ? "var(--ifm-color-primary)" : "#ddd",
          }}
        />
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: step >= 2 ? "var(--ifm-color-primary)" : "#ddd",
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <h3>Step 1: Account Details</h3>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={selectStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Password (min 8 characters)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={selectStyle}
              />
            </div>
            <button
              type="button"
              className="button button--primary button--block"
              onClick={() => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                  setError("Please enter a valid email address.");
                  return;
                }
                if (password.length < 8) {
                  setError("Password must be at least 8 characters.");
                  return;
                }
                setError("");
                setStep(2);
              }}
            >
              Next: Your Background
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Step 2: Your Background</h3>
            <p style={{ fontSize: 14, color: "#666" }}>
              This helps us personalize content to your experience level.
            </p>

            <h4>Software Experience</h4>
            <div style={fieldStyle}>
              <label style={labelStyle}>Python Level</label>
              <select
                value={pythonLevel}
                onChange={(e) => setPythonLevel(e.target.value)}
                style={selectStyle}
              >
                {skillLevels.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>ROS Experience</label>
              <select
                value={rosLevel}
                onChange={(e) => setRosLevel(e.target.value)}
                style={selectStyle}
              >
                {skillLevels.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Machine Learning Experience</label>
              <select
                value={mlLevel}
                onChange={(e) => setMlLevel(e.target.value)}
                style={selectStyle}
              >
                {skillLevels.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <h4>Hardware Experience</h4>
            <div style={fieldStyle}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={arduinoExp}
                  onChange={(e) => setArduinoExp(e.target.checked)}
                />
                Arduino / Microcontroller Experience
              </label>
            </div>
            <div style={fieldStyle}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={jetsonExp}
                  onChange={(e) => setJetsonExp(e.target.checked)}
                />
                NVIDIA Jetson Experience
              </label>
            </div>
            <div style={fieldStyle}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={robotExp}
                  onChange={(e) => setRobotExp(e.target.checked)}
                />
                Physical Robot Experience
              </label>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Learning Goals (optional)</label>
              <textarea
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                rows={3}
                style={{ ...selectStyle, resize: "vertical" }}
                placeholder="What do you hope to learn from this course?"
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="button button--primary"
                style={{ flex: 1 }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </>
        )}
      </form>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Layout
      title="Sign Up"
      description="Create your Physical AI Textbook account"
    >
      <BrowserOnly
        fallback={
          <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
        }
      >
        {() => <SignupForm />}
      </BrowserOnly>
    </Layout>
  );
}
