import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageCard } from '@/components/ui/ImageCard';

describe('ImageCard', () => {
    const mockImage = {
        id: 'test-1',
        originalName: 'test.jpg',
        originalPath: '/uploads/test.jpg',
        processedPath: null,
        size: 1024,
        dimensions: { width: 800, height: 600 },
        createdAt: '2024-05-03T12:00:00.000Z',
        status: 'uploaded' as const
    };

    const mockHandlers = {
        onProcess: jest.fn(),
        onDownload: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders image details correctly', () => {
        render(<ImageCard image={mockImage} {...mockHandlers} />);

        expect(screen.getByText(mockImage.originalName)).toBeInTheDocument();
        expect(screen.getByText(/1 KB/)).toBeInTheDocument();
        expect(screen.getByText(/800 × 600/)).toBeInTheDocument();
        expect(screen.getByText(/uploaded/i)).toBeInTheDocument();
    });

    it('shows process button for unprocessed images', () => {
        render(<ImageCard image={mockImage} {...mockHandlers} />);

        const processButton = screen.getByRole('button', { name: /process/i });
        expect(processButton).toBeInTheDocument();
        expect(processButton).not.toBeDisabled();
    });

    it('shows download button for processed images', () => {
        const processedImage = {
            ...mockImage,
            status: 'processed' as const,
            processedPath: '/processed/test.jpg'
        };

        render(<ImageCard image={processedImage} {...mockHandlers} />);

        const downloadButton = screen.getByRole('button', { name: /download/i });
        expect(downloadButton).toBeInTheDocument();
        expect(downloadButton).not.toBeDisabled();
    });

    it('calls onProcess when process button is clicked', async () => {
        render(<ImageCard image={mockImage} {...mockHandlers} />);

        const processButton = screen.getByRole('button', { name: /process/i });
        fireEvent.click(processButton);

        await waitFor(() => {
            expect(mockHandlers.onProcess).toHaveBeenCalledWith(mockImage.id);
        });
    });

    it('calls onDownload when download button is clicked', async () => {
        const processedImage = {
            ...mockImage,
            status: 'processed' as const,
            processedPath: '/processed/test.jpg'
        };

        render(<ImageCard image={processedImage} {...mockHandlers} />);

        const downloadButton = screen.getByRole('button', { name: /download/i });
        fireEvent.click(downloadButton);

        await waitFor(() => {
            expect(mockHandlers.onDownload).toHaveBeenCalledWith(processedImage.id);
        });
    });

    it('shows error state for failed processing', () => {
        const failedImage = {
            ...mockImage,
            status: 'failed' as const
        };

        render(<ImageCard image={failedImage} {...mockHandlers} />);

        expect(screen.getByText(/processing failed/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('calls onProcess when retry button is clicked', async () => {
        const failedImage = {
            ...mockImage,
            status: 'failed' as const
        };

        render(<ImageCard image={failedImage} {...mockHandlers} />);

        const retryButton = screen.getByRole('button', { name: /retry/i });
        fireEvent.click(retryButton);

        await waitFor(() => {
            expect(mockHandlers.onProcess).toHaveBeenCalledWith(failedImage.id);
        });
    });

    it('displays formatted file size', () => {
        const largeImage = {
            ...mockImage,
            size: 2 * 1024 * 1024 // 2MB
        };

        render(<ImageCard image={largeImage} {...mockHandlers} />);
        expect(screen.getByText(/2 MB/)).toBeInTheDocument();
    });

    it('displays formatted date', () => {
        render(<ImageCard image={mockImage} {...mockHandlers} />);
        // Format will depend on browser locale, so we check for date parts
        expect(screen.getByText(/2024/)).toBeInTheDocument();
    });
});