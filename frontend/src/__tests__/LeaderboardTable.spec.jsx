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
    const hitFactorButton = screen.getByText('Hit Factor');
    expect(hitFactorButton).toBeInTheDocument();
  
    await fireEvent.click(hitFactorButton);
    await fireEvent.click(hitFactorButton);
  
    const displayNameButton = screen.getByText('Player');
    await fireEvent.click(displayNameButton);
  });
  

  it('handles initial stage ID', () => {
    render(<LeaderboardTable initialStageId="123" />);
    expect(useFetchLeaderboard).toHaveBeenCalledWith("123");
  });
  
});