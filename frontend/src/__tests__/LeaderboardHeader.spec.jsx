import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LeaderboardHeader from '../components/LeaderboardHeader';

describe('LeaderboardHeader', () => {
  const defaultProps = {
    stageName: 'Test Stage',
    threshold: '100.00',
    totalPlayers: 500,
    searchQuery: '',
    setSearchQuery: vi.fn(),
    refetch: vi.fn()
  };

  it('renders all components correctly', () => {
    render(<LeaderboardHeader {...defaultProps} />);
    
    expect(screen.getByText('Test Stage')).toBeInTheDocument();
    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search players...')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('displays default values when props are missing', () => {
    render(<LeaderboardHeader 
      searchQuery=""
      setSearchQuery={vi.fn()}
      refetch={vi.fn()}
    />);
    
    expect(screen.getByText('NA')).toBeInTheDocument();
    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    const setSearchQuery = vi.fn();
    render(<LeaderboardHeader {...defaultProps} setSearchQuery={setSearchQuery} />);
    
    const input = screen.getByPlaceholderText('Search players...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(setSearchQuery).toHaveBeenCalledWith('test');
  });

  it('calls refetch when refresh button is clicked', () => {
    const refetch = vi.fn();
    render(<LeaderboardHeader {...defaultProps} refetch={refetch} />);
    
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    expect(refetch).toHaveBeenCalled();
  });
});