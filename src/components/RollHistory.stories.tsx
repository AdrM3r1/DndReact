import type { Meta, StoryObj } from '@storybook/react'
import RollHistory from './RollHistory'

const meta: Meta<typeof RollHistory> = {
  title: 'Tools/RollHistory',
  component: RollHistory,
}

export default meta
type Story = StoryObj<typeof RollHistory>

export const Default: Story = {}
