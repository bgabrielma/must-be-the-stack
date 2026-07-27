import type { ReactNode } from "react";

interface BannerProps {
  variant: "info" | "success" | "danger";
  icon: ReactNode;
  title: string;
  description: string;
}

export function Banner({ variant, icon, title, description }: BannerProps) {
  return (
    <div className={`banner banner-${variant}`}>
      {icon}
      <div>
        <p className="title">{title}</p>
        <p className="desc">{description}</p>
      </div>
    </div>
  );
}
