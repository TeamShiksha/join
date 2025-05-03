import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UploadArea } from '@/components/ui/UploadArea';

describe('UploadArea', () => {
    const mockOnUpload = jest.fn();
    const defaultProps = {
        onUpload: mockOnUpload,
        isUploading: false,
        accept: 'image/jpeg,image/png,image/webp',
        maxSize: 5 * 1024 * 1024
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders upload area with default text', () => {
        render(<UploadArea {...defaultProps} />);
        
        expect(screen.getByText(/drag and drop your image here/i)).toBeInTheDocument();
        expect(screen.getByText(/browse/i)).toBeInTheDocument();
        expect(screen.getByText(/jpeg, png or webp up to 5mb/i)).toBeInTheDocument();
    });

    it('handles file selection through input', async () => {
        render(<UploadArea {...defaultProps} />);
        
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByRole('button') as HTMLInputElement;
        
        Object.defineProperty(input, 'files', {
            value: [file]
        });
        
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(mockOnUpload).toHaveBeenCalledWith(file);
        });
    });

    it('shows error for invalid file type', async () => {
        render(<UploadArea {...defaultProps} />);
        
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByRole('button') as HTMLInputElement;
        
        Object.defineProperty(input, 'files', {
            value: [file]
        });
        
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
        });
        expect(mockOnUpload).not.toHaveBeenCalled();
    });

    it('shows error for file size exceeding limit', async () => {
        render(<UploadArea {...defaultProps} />);
        
        const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
            type: 'image/jpeg'
        });
        const input = screen.getByRole('button') as HTMLInputElement;
        
        Object.defineProperty(input, 'files', {
            value: [largeFile]
        });
        
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(screen.getByText(/file size exceeds 5mb limit/i)).toBeInTheDocument();
        });
        expect(mockOnUpload).not.toHaveBeenCalled();
    });

    it('shows loading state during upload', () => {
        render(<UploadArea {...defaultProps} isUploading={true} />);
        
        expect(screen.getByText(/uploading\.\.\./i)).toBeInTheDocument();
        expect(screen.getByRole('button') as HTMLButtonElement).toBeDisabled();
    });

    it('handles drag and drop', async () => {
        render(<UploadArea {...defaultProps} />);
        
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const dropzone = (screen.getByRole('button') as HTMLElement).parentElement;
        
        if (!dropzone) throw new Error('Dropzone not found');
        
        // Simulate drag enter
        fireEvent.dragEnter(dropzone, {
            dataTransfer: { files: [file] }
        });
        
        expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
        
        // Simulate drop
        fireEvent.drop(dropzone, {
            dataTransfer: { files: [file] }
        });
        
        await waitFor(() => {
            expect(mockOnUpload).toHaveBeenCalledWith(file);
        });
    });

    it('resets input after successful upload', async () => {
        render(<UploadArea {...defaultProps} />);
        
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByRole('button') as HTMLInputElement;
        
        Object.defineProperty(input, 'files', {
            value: [file]
        });
        
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(mockOnUpload).toHaveBeenCalledWith(file);
            expect(input.value).toBe('');
        });
    });
});