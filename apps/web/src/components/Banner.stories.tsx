import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner } from "./Banner";
import { CheckIcon, InfoIcon } from "./icons";

const meta = {
  title: "Components/Banner",
  component: Banner,
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    icon: <InfoIcon size={18} />,
    title: "Retakes allowed",
    description: "You can retry the exercise as many times as you need.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    icon: <CheckIcon size={18} />,
    title: "Account created",
    description: "Log in to continue your Journey.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    icon: <InfoIcon size={18} />,
    title: "Submission failed grading",
    description: "Workflow file didn't match the Template Repo.",
  },
};
