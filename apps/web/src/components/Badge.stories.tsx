import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { InfoIcon } from "./icons";

const meta = {
  title: "Components/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Min. passing score: 80%",
    icon: <InfoIcon size={12} />,
  },
};

export const WithoutIcon: Story = {
  args: {
    children: "Quiz",
  },
};
