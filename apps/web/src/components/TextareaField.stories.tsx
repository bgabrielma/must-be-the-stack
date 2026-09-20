import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaField } from "./TextareaField";

const meta = {
  title: "Components/TextareaField",
  component: TextareaField,
  args: {
    label: "About",
    id: "story-about",
    rows: 3,
    placeholder: "Learning system design one concept at a time.",
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Unmarked: the about line is optional, and an optional field carries no marker.
export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithError: Story = {
  args: {
    error: "About must be shorter than 280 characters",
  },
};
