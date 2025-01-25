import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {beforeEach, describe, expect, it, vi } from 'vitest'
import ImportButton from '../components/ImportButton'
import { useImportLeaderboard } from '../hooks/useLeaderboardAPI'

// Mock the hook
vi.mock('../hooks/useLeaderboardAPI', () => ({
  useImportLeaderboard: vi.fn()
}))

describe('ImportButton', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders import button in initial state', () => {
    useImportLeaderboard.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      toastMessage: null
    })

    render(<ImportButton />)
    expect(screen.getByText('Import Leaderboard')).toBeInTheDocument()
  })

  it('shows loading state when pending', () => {
    useImportLeaderboard.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      toastMessage: null
    })

    render(<ImportButton />)
    expect(screen.getByText('Importing...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls mutate when clicked', () => {
    useImportLeaderboard.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      toastMessage: null
    })

    render(<ImportButton />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })
})