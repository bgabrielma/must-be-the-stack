import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from "./SearchField";

const meta = {
  title: "Components/SearchField",
  component: SearchField,
  args: {
    placeholder: "Search Journeys",
    "aria-label": "Search Journeys",
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: {
    value: "Soft",
    onChange: () => {},
  },
};
