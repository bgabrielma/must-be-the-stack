import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckIcon,
  LockIcon,
  ChevronRightIcon,
  PlayIcon,
  CompassIcon,
  SearchIcon,
  InfoIcon,
} from "./icons";

const icons = {
  CheckIcon,
  LockIcon,
  ChevronRightIcon,
  PlayIcon,
  CompassIcon,
  SearchIcon,
  InfoIcon,
};

function Gallery() {
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {Object.entries(icons).map(([name, Icon]) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 72 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "var(--surface-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={20} />
          </div>
          <span style={{ fontSize: 11, textAlign: "center" }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/Icons",
  component: Gallery,
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {};
