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
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('updates stageId on input change', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter Stage ID...');
    fireEvent.change(input, { target: { value: '123' } });
    expect(defaultProps.setStageId).toHaveBeenCalledWith('123');
  });

  it('disables search button when fetching', () => {
    render(<SearchBar {...defaultProps} isFetching={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('triggers search on button click', () => {
    render(<SearchBar {...defaultProps} stageId="123" />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.handleSearch).toHaveBeenCalled();
  });

  it('disables search button when stageId is empty', () => {
    render(<SearchBar {...defaultProps} stageId="" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disables search button when stageId contains only whitespace', () => {
    render(<SearchBar {...defaultProps} stageId="   " />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('displays correct button text based on fetching state', () => {
    const { rerender } = render(<SearchBar {...defaultProps} />);
    expect(screen.getByText('Search')).toBeInTheDocument();

    rerender(<SearchBar {...defaultProps} isFetching={true} />);
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
});