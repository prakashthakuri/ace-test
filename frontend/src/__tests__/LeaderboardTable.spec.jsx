import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFetchLeaderboard } from '../hooks/useLeaderboardAPI';
import LeaderboardTable from '../components/LeaderboardTable';

vi.mock('../hooks/useLeaderboardAPI');
vi.mock('./TableData', () => ({
  default: ({ score, position }) => (
    <tr><td>{position}</td><td>{score.displayname}</td></tr>
  )
}));
vi.mock('./Searchbar', () => ({
  default: () => <div data-testid="search-bar">Search Bar</div>
}));
vi.mock('./LeaderboardHeader', () => ({
  default: () => <div data-testid="leaderboard-header">Header</div>
}));
vi.mock('./Pagination', () => ({
  default: () => <div data-testid="pagination">Pagination</div>
}));

const mockScores = Array(15).fill(null).map((_, i) => ({
  id: i,
  displayname: `Player ${i}`,
  rank: 'A',
  hitFactor: 5 + i,
  timeInSeconds: 20 + i
}));

describe('LeaderboardTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFetchLeaderboard.mockReturnValue({
      data: { scores: mockScores, stage: { stageName: 'Test', threshold: '100' } },
      error: null,
      isError: false,
      isFetching: false,
      refetch: vi.fn()
    });
  });

  it('handles sorting by different columns', async () => {
    render(<LeaderboardTable initialStageId="123" />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    const hitFactorBtn = screen.getByRole('button', { name: /hit factor/i });
    expect(hitFactorBtn).toBeInTheDocument();
    await fireEvent.click(hitFactorBtn);
  });

  it('handles initial stage ID', () => {
    render(<LeaderboardTable initialStageId="123" />);
    expect(useFetchLeaderboard).toHaveBeenCalledWith("123");
  });

  it('handles error state', () => {
    useFetchLeaderboard.mockReturnValue({
      error: new Error('Test error'),
      isError: true,
      isFetching: false,
      refetch: vi.fn()
    });
    render(<LeaderboardTable initialStageId="123" />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText(/Failed to load leaderboard data/)).toBeInTheDocument();
  });

});