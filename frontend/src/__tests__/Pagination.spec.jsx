import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    setCurrentPage: vi.fn()
  };

  it('renders pagination controls', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('handles next page click', () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.setCurrentPage).toHaveBeenCalled();
  });

  it('handles previous page click', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.setCurrentPage).toHaveBeenCalled();
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Previous')).not.toBeDisabled();
  });

  it('does not render when total pages is 1', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });
});