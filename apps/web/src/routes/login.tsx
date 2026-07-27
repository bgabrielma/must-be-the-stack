import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { login, ApiError } from "../lib/api";
import { CheckIcon } from "../components/icons";
import { Banner } from "../components/Banner";
import { Field } from "../components/Field";
import { Button } from "../components/Button";

interface LoginSearch {
  created?: boolean;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    created: search.created === true || search.created === "true" ? true : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { created } = Route.useSearch();
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
      await login(email, password);
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      {created && (
        <Banner
          variant="success"
          icon={<CheckIcon size={18} />}
          title="Account created"
          description="Log in to continue your Journey."
        />
      )}
      <h1 className="h1">Log in</h1>
      <form className="form-stack" onSubmit={handleSubmit}>
        <Field
          label="Email"
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Field
          label="Password"
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          error={error ?? undefined}
        />
        <Button type="submit" block disabled={submitting}>
          Log in
        </Button>
      </form>
      <Link to="/signup" className="link-muted">
        Need an account? Sign up
      </Link>
    </div>
  );
}
