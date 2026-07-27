import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signup, ApiError } from "../lib/api";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";
import { LINK_MUTED_CLASSES } from "../lib/pageStyles";

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
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <PageHeading eyebrow="Get started" title="Create your account" />
      <p className="mt-1.5 text-[13px]">Start mastering one concept at a time.</p>
      <form className="mt-3 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field
          label="Email"
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          error={error ?? undefined}
        />
        <Field
          label="Password"
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" block disabled={submitting}>
          Create account
        </Button>
      </form>
      <Link to="/login" className={LINK_MUTED_CLASSES}>
        Already have an account? Log in
      </Link>
    </div>
  );
}
