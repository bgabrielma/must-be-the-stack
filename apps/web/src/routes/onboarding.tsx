import { createFileRoute, Link } from "@tanstack/react-router";
import { CompassIcon, PlayIcon, CheckIcon } from "../components/icons";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const steps = [
  { icon: <CompassIcon size={16} />, title: "Pick a Journey", meta: "Software Design, and more to come." },
  { icon: <PlayIcon size={16} />, title: "Master one Lesson", meta: "Bite-sized concepts, not videos." },
  { icon: <CheckIcon size={16} />, title: "Pass the Exercise", meta: "Prove it before the next one unlocks." },
];

function Onboarding() {
  return (
    <div className="page">
      <p className="eyebrow">How it works</p>
      <h1 className="h1">One concept at a time</h1>
      <p className="sub">No skipping ahead — every step is earned.</p>
      <div className="list">
        {steps.map((step) => (
          <div key={step.title} className="unit-card" style={{ cursor: "default" }}>
            <span className="icon">{step.icon}</span>
            <span className="body">
              <span className="title">{step.title}</span>
              <span className="meta">{step.meta}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="hero-cta">
        <Link to="/signup" className="btn btn-primary btn-block">
          Continue
        </Link>
      </div>
    </div>
  );
}
