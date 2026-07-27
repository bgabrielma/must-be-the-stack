import type { Meta, StoryObj } from "@storybook/react-vite";
import { LockTooltip } from "./LockTooltip";

const meta = {
  title: "Components/LockTooltip",
  component: LockTooltip,
} satisfies Meta<typeof LockTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LockedSubject: Story = {
  args: {
    message:
      'Finish all 5 lessons in "Databases" and pass each exercise with 80% or higher to unlock this Subject.',
  },
};

export const LockedLesson: Story = {
  args: {
    message: 'Pass the Exercise for "Replication & Failover" to unlock this Lesson.',
  },
};
