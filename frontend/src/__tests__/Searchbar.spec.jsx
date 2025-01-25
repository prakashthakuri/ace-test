import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/Searchbar';

describe('SearchBar', () => {
  const defaultProps = {
    stageId: '',
    setStageId: vi.fn(),
    handleSearch: vi.fn(),
    isFetching: false,
    isSearching: false
  };

  it('renders search input and button', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter Stage ID...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('updates stageId on input change', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter Stage ID...');
    fireEvent.change(input, { target: { value: '123' } });
    expect(defaultProps.setStageId).toHaveBeenCalledWith('123');
  });

  it('disables search button when fetching', () => {
    render(<SearchBar {...defaultProps} isFetching={true} />);
    expect(screen.getByText('Searching...')).toBeDisabled();
  });

  it('disables search button with empty stageId', () => {
    render(<SearchBar {...defaultProps} stageId="" />);
    expect(screen.getByText('Search')).toBeDisabled();
  });

  it('triggers search on button click', () => {
    render(<SearchBar {...defaultProps} stageId="123" />);
    fireEvent.click(screen.getByText('Search'));
    expect(defaultProps.handleSearch).toHaveBeenCalled();
  });
});