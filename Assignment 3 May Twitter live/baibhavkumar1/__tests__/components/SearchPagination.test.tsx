import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchPagination } from '@/components/ui/SearchPagination';

describe('SearchPagination', () => {
    const defaultProps = {
        total: 20,
        page: 1,
        limit: 6,
        search: '',
        onPageChange: jest.fn(),
        onSearchChange: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders search input and pagination', () => {
        render(<SearchPagination {...defaultProps} />);

        expect(screen.getByPlaceholderText(/search images/i)).toBeInTheDocument();
        expect(screen.getByText(/showing 1-6 of 20/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('handles search input changes with debounce', async () => {
        jest.useFakeTimers();
        render(<SearchPagination {...defaultProps} />);

        const searchInput = screen.getByPlaceholderText(/search images/i);
        fireEvent.change(searchInput, { target: { value: 'test' } });

        // Fast-forward debounce timeout
        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
        });

        jest.useRealTimers();
    });

    it('disables previous button on first page', () => {
        render(<SearchPagination {...defaultProps} page={1} />);

        expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('disables next button on last page', () => {
        render(<SearchPagination {...defaultProps} page={4} />);

        expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('calls onPageChange when clicking navigation buttons', () => {
        render(<SearchPagination {...defaultProps} page={2} />);

        const prevButton = screen.getByRole('button', { name: /previous/i });
        const nextButton = screen.getByRole('button', { name: /next/i });

        fireEvent.click(prevButton);
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);

        fireEvent.click(nextButton);
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    });

    it('shows correct items range', () => {
        render(<SearchPagination {...defaultProps} page={2} />);
        expect(screen.getByText(/showing 7-12 of 20/i)).toBeInTheDocument();
    });

    it('shows correct items range for last incomplete page', () => {
        render(<SearchPagination {...defaultProps} page={4} total={20} limit={6} />);
        expect(screen.getByText(/showing 19-20 of 20/i)).toBeInTheDocument();
    });

    it('handles empty results', () => {
        render(<SearchPagination {...defaultProps} total={0} />);
        expect(screen.getByText(/no results/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('clears search input with button', async () => {
        render(<SearchPagination {...defaultProps} />);

        const searchInput = screen.getByPlaceholderText(/search images/i) as HTMLInputElement;
        fireEvent.change(searchInput, { target: { value: 'test' } });

        const clearButton = screen.getByRole('button', { name: /clear search/i });
        fireEvent.click(clearButton);

        expect(searchInput.value).toBe('');
        await waitFor(() => {
            expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
        });
    });

    it('resets to first page on search', async () => {
        jest.useFakeTimers();
        render(<SearchPagination {...defaultProps} page={2} />);

        const searchInput = screen.getByPlaceholderText(/search images/i);
        fireEvent.change(searchInput, { target: { value: 'test' } });

        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
            expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
        });

        jest.useRealTimers();
    });
});