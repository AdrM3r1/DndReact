import type { Meta, StoryObj } from '@storybook/react'
import DamageCalculator from './DamageCalculator'

const meta: Meta<typeof DamageCalculator> = {
  title: 'Tools/DamageCalculator',
  component: DamageCalculator,
}

export default meta
type Story = StoryObj<typeof DamageCalculator>

export const Default: Story = {}
