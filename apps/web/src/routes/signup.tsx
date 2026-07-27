import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signup, ApiError } from "../lib/api";
import { Field } from "../components/Field";
import { Button } from "../components/Button";

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
      <p className="mb-1 font-heading text-[11px] font-semibold tracking-[0.06em] text-accent uppercase">
        Get started
      </p>
      <h1 className="font-heading text-2xl leading-[1.15] font-bold tracking-[-0.3px] text-text-h">
        Create your account
      </h1>
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
      <Link to="/login" className="mt-4 block text-center text-[13px] text-accent no-underline">
        Already have an account? Log in
      </Link>
    </div>
  );
}
