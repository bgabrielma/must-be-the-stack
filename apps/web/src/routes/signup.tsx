import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signup, ApiError } from "../lib/api";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signup(email, password);
      navigate({ to: "/login", search: { created: true } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <p className="eyebrow">Get started</p>
      <h1 className="h1">Create your account</h1>
      <p className="sub">Start mastering one concept at a time.</p>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className={`field ${error ? "is-error" : ""}`.trim()}>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {error && <span className="error-msg">{error}</span>}
        </div>
        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          Create account
        </button>
      </form>
      <Link to="/login" className="link-muted">
        Already have an account? Log in
      </Link>
    </div>
  );
}
