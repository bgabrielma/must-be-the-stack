import { createFileRoute, Link } from "@tanstack/react-router";
import { CompassIcon } from "../components/icons";

export const Route = createFileRoute("/")({
  component: Entry,
});

function Entry() {
  return (
    <div className="page">
      <div className="hero-mark">
        <CompassIcon size={20} />
      </div>
      <h1 className="hero-h1">Every step, earned.</h1>
      <p className="hero-sub">No skipping ahead. No skipping the fun either.</p>
      <div className="hero-cta">
        <Link to="/onboarding" className="btn btn-primary btn-block">
          Start your Journey
        </Link>
        <Link to="/login" className="link-muted">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}
