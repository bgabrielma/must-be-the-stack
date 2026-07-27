import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeading } from "./PageHeading";

const meta = {
  title: "Components/PageHeading",
  component: PageHeading,
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithEyebrow: Story = {
  args: {
    eyebrow: "Welcome back",
    title: "Continue your Journey",
  },
};

export const WithoutEyebrow: Story = {
  args: {
    title: "Log in",
  },
};
