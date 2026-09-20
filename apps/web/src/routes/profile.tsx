import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { saveProfile } from "../lib/user";
import { setCurrentUser } from "../lib/currentUser";
import { requireAuth } from "../lib/routeGuards";
import { ApiError } from "../lib/ApiError";
import { InfoIcon, ProfileIllustration } from "../components/icons";
import { Banner } from "../components/Banner";
import { Field } from "../components/Field";
import { TextareaField } from "../components/TextareaField";
import { Button } from "../components/Button";
import { PageHeading } from "../components/PageHeading";

// `requireAuth` alone, deliberately: this is the screen an incomplete Profile
// is sent to, so gating it on a complete Profile would redirect it to itself
// (ADR-0015).
export const Route = createFileRoute("/profile")({
  beforeLoad: requireAuth,
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      setCurrentUser(await saveProfile({ firstName, lastName, jobRole, about }));
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex min-h-[100svh] flex-col pt-6" onSubmit={handleSubmit}>
      <div className="px-5">
        <PageHeading eyebrow={t("profile.eyebrow")} title={t("profile.title")} />
        <div className="my-3 flex justify-center">
          <ProfileIllustration />
        </div>
        {error && (
          <Banner
            variant="danger"
            icon={<InfoIcon size={18} />}
            title={t("profile.errorTitle")}
            description={error}
          />
        )}
        <div className="flex flex-col gap-3">
          <Field
            label={t("profile.firstNameLabel")}
            id="profile-first-name"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <Field
            label={t("profile.lastNameLabel")}
            id="profile-last-name"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
          <Field
            label={t("profile.jobRoleLabel")}
            id="profile-job-role"
            type="text"
            value={jobRole}
            onChange={(event) => setJobRole(event.target.value)}
            required
          />
          <TextareaField
            label={t("profile.aboutLabel")}
            id="profile-about"
            rows={3}
            value={about}
            onChange={(event) => setAbout(event.target.value)}
          />
        </div>
      </div>
      {/* Pinned: the way forward stays on screen while the form scrolls. */}
      <div className="sticky bottom-0 mt-auto border-t border-border bg-bg px-5 pt-3 pb-4">
        <Button type="submit" block disabled={submitting} testId="profile-save">
          {t("profile.submit")}
        </Button>
      </div>
    </form>
  );
}
