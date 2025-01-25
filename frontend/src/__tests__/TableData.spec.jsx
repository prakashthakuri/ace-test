import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TableData from '../components/TableData'

const mockScore = {
  displayname: 'John Doe',
  rank: 'Gold',
  hitFactor: 5.67,
  timeInSeconds: 45.3
}

describe('TableData', () => {

  it('formats time correctly for minutes', () => {
    const longScore = { ...mockScore, timeInSeconds: 125.5 }
    render(<TableData score={longScore} position={1} />)
    expect(screen.getByText('2m 5.5s')).toBeInTheDocument()
  })

  it('applies correct rank color', () => {
    render(<TableData score={mockScore} position={1} />)
    const rankElement = screen.getByText('Gold')
    expect(rankElement.className).toContain('bg-yellow-700')
  })
})