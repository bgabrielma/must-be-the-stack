import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { login } from "../lib/auth";
import { ApiError } from "../lib/ApiError";
import { CheckIcon } from "../components/icons";
import { Banner } from "../components/Banner";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";
import { MutedLink } from "../components/MutedLink";

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
  const { t } = useTranslation();
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
      setError(err instanceof ApiError ? err.message : t("login.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-6 pb-5">
      {created && (
        <Banner
          variant="success"
          icon={<CheckIcon size={18} />}
          title={t("login.accountCreatedTitle")}
          description={t("login.accountCreatedDescription")}
        />
      )}
      <PageHeading title={t("login.title")} />
      <form className="mt-3 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field
          label={t("login.emailLabel")}
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Field
          label={t("login.passwordLabel")}
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          error={error ?? undefined}
        />
        <Button type="submit" block disabled={submitting}>
          {t("login.submit")}
        </Button>
      </form>
      <MutedLink to="/signup">{t("login.needAccount")}</MutedLink>
    </div>
  );
}
