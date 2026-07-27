import type { Meta, StoryObj } from "@storybook/react-vite";
import { UnitCard } from "./UnitCard";
import { CompassIcon, PlayIcon } from "./icons";

const meta = {
  title: "Components/UnitCard",
  component: UnitCard,
  args: {
    title: "Databases",
    meta: "In progress · 2/5 lessons",
    icon: <PlayIcon size={14} />,
  },
} satisfies Meta<typeof UnitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { status: "active" },
};

export const Completed: Story = {
  args: {
    status: "completed",
    title: "Caching Fundamentals",
    meta: "Completed",
  },
};

export const Locked: Story = {
  args: {
    status: "locked",
    title: "Distributed Systems",
    meta: "Locked",
  },
};

export const NotStarted: Story = {
  args: {
    status: "not_started",
    title: "Software Architecture",
    meta: "6 Subjects · Not started",
    icon: <CompassIcon size={14} />,
  },
};
