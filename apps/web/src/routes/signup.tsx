import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { signup } from "../lib/auth";
import { ApiError } from "../lib/ApiError";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";
import { MutedLink } from "../components/MutedLink";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { t } = useTranslation();
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
      setError(err instanceof ApiError ? err.message : t("signup.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      <PageHeading eyebrow={t("signup.eyebrow")} title={t("signup.title")} />
      <p className="mt-1.5 text-[13px]">{t("signup.subtitle")}</p>
      <form className="mt-3 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field
          label={t("signup.emailLabel")}
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          error={error ?? undefined}
        />
        <Field
          label={t("signup.passwordLabel")}
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" block disabled={submitting}>
          {t("signup.submit")}
        </Button>
      </form>
      <MutedLink to="/login">{t("signup.haveAccount")}</MutedLink>
    </div>
  );
}
