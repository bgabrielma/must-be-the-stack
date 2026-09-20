import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";

const meta = {
  title: "Components/Field",
  component: Field,
  args: {
    label: "Email",
    id: "story-email",
    type: "email",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Required fields carry an asterisk after the label; unmarked means optional,
// and no field is ever labelled "(optional)".
export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithError: Story = {
  args: {
    error: "Email has already been taken",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    id: "story-password",
    type: "password",
  },
};
