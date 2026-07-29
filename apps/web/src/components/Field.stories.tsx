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
