import { renderHook, act } from '@testing-library/react';
import { useImageGallery } from '@/hooks/useImageGallery';
import * as api from '@/services/api';

// Mock the API module
jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('useImageGallery', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useImageGallery());
        
        expect(result.current).toMatchObject({
            images: [],
            total: 0,
            page: 1,
            search: '',
            isLoading: true,
            isUploading: false,
            error: null
        });
        expect(result.current.isProcessing).toBeInstanceOf(Set);
        expect(result.current.isProcessing.size).toBe(0);
    });

    it('should fetch images on mount', async () => {
        const mockImages = [{
            id: '1',
            originalName: 'test.jpg',
            originalPath: '/uploads/test.jpg',
            processedPath: null,
            dimensions: { width: 800, height: 600 },
            size: 1024,
            status: 'uploaded' as const,
            createdAt: new Date().toISOString()
        }];
        mockedApi.getImages.mockResolvedValueOnce({
            data: mockImages,
            total: 1,
            page: 1,
            limit: 6,
            totalPages: 1
        });

        const { result } = renderHook(() => useImageGallery());

        await act(async () => {
            await jest.runAllTimers();
        });

        expect(result.current.images).toEqual(mockImages);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle upload with polling updates', async () => {
        const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        mockedApi.uploadImage.mockResolvedValueOnce({ success: true });

        const mockImages = [{
            id: 'new-upload',
            originalName: 'test.jpg',
            originalPath: '/uploads/test.jpg',
            processedPath: null,
            dimensions: { width: 800, height: 600 },
            size: 1024,
            status: 'uploaded' as const,
            createdAt: new Date().toISOString()
        }];

        mockedApi.getImages.mockResolvedValue({
            data: mockImages,
            total: 1,
            page: 1,
            limit: 6,
            totalPages: 1
        });

        const { result } = renderHook(() => useImageGallery());

        // Start upload
        await act(async () => {
            await result.current.handleUpload(mockFile);
        });

        expect(mockedApi.uploadImage).toHaveBeenCalledWith(mockFile);
        expect(result.current.isUploading).toBe(false);

        // Verify polling updates gallery
        await act(async () => {
            await jest.advanceTimersByTime(2000); // First poll
        });
        expect(mockedApi.getImages).toHaveBeenCalledTimes(2); // Initial load + first poll
        expect(result.current.images).toEqual(mockImages);
    });

    it('should start and stop polling during processing', async () => {
        const imageId = '123';
        mockedApi.processImage.mockResolvedValueOnce({ success: true });
        
        const mockImages = [{
            id: '123',
            originalName: 'test.jpg',
            originalPath: '/uploads/test.jpg',
            processedPath: '/processed/test.jpg',
            dimensions: { width: 800, height: 600 },
            size: 1024,
            status: 'processed' as const,
            createdAt: new Date().toISOString()
        }];

        mockedApi.getImages.mockResolvedValue({
            data: mockImages,
            total: 1,
            page: 1,
            limit: 6,
            totalPages: 1
        });

        const { result } = renderHook(() => useImageGallery());

        // Start processing
        await act(async () => {
            await result.current.handleProcess(imageId);
        });

        expect(mockedApi.processImage).toHaveBeenCalledWith(imageId);
        expect(result.current.isProcessing.has(imageId)).toBe(false);

        // Verify polling occurs
        await act(async () => {
            await jest.advanceTimersByTime(2000); // First poll
        });
        expect(mockedApi.getImages).toHaveBeenCalledTimes(2); // Initial load + first poll

        await act(async () => {
            await jest.advanceTimersByTime(2000); // Second poll
        });
        expect(mockedApi.getImages).toHaveBeenCalledTimes(3); // +Second poll
    });

    it('should handle search with debounce and proper response', async () => {
        const mockSearchResults = [{
            id: 'search-result',
            originalName: 'test-search.jpg',
            originalPath: '/uploads/test-search.jpg',
            processedPath: null,
            dimensions: { width: 800, height: 600 },
            size: 1024,
            status: 'uploaded' as const,
            createdAt: new Date().toISOString()
        }];

        mockedApi.getImages.mockResolvedValueOnce({
            data: mockSearchResults,
            total: 1,
            page: 1,
            limit: 6,
            totalPages: 1
        });

        const { result } = renderHook(() => useImageGallery());

        act(() => {
            result.current.handleSearchChange('test-search');
        });

        await act(async () => {
            await jest.advanceTimersByTime(300); // Debounce timeout
        });

        expect(result.current.search).toBe('test-search');
        expect(result.current.page).toBe(1);
        expect(mockedApi.getImages).toHaveBeenLastCalledWith(
            expect.objectContaining({
                search: 'test-search',
                page: 1,
                limit: 6
            })
        );
        expect(result.current.images).toEqual(mockSearchResults);
    });

    it('should handle page changes with proper pagination', async () => {
        const mockPageResults = [{
            id: 'page-2-item',
            originalName: 'page2.jpg',
            originalPath: '/uploads/page2.jpg',
            processedPath: null,
            dimensions: { width: 800, height: 600 },
            size: 1024,
            status: 'uploaded' as const,
            createdAt: new Date().toISOString()
        }];

        mockedApi.getImages.mockResolvedValueOnce({
            data: mockPageResults,
            total: 12, // 2 pages with 6 items per page
            page: 2,
            limit: 6,
            totalPages: 2
        });

        const { result } = renderHook(() => useImageGallery());

        await act(async () => {
            result.current.handlePageChange(2);
            await jest.runAllTimers();
        });

        expect(result.current.page).toBe(2);
        expect(mockedApi.getImages).toHaveBeenLastCalledWith(
            expect.objectContaining({
                page: 2,
                limit: 6
            })
        );
        expect(result.current.images).toEqual(mockPageResults);
    });

    it('should cleanup polling on unmount', async () => {
        const { result, unmount } = renderHook(() => useImageGallery());
        
        // Start processing to trigger polling
        await act(async () => {
            await result.current.handleProcess('test-id');
        });

        // Verify polling is active
        await act(async () => {
            await jest.advanceTimersByTime(2000);
        });
        expect(mockedApi.getImages).toHaveBeenCalled();

        // Unmount component
        unmount();

        // Verify no more polling after unmount
        await act(async () => {
            await jest.advanceTimersByTime(4000);
        });
        const callCount = mockedApi.getImages.mock.calls.length;
        expect(mockedApi.getImages).toHaveBeenCalledTimes(callCount);
    });

    it('should handle multiple concurrent processes', async () => {
        const ids = ['id1', 'id2'];
        mockedApi.processImage.mockResolvedValue({ success: true });

        const { result } = renderHook(() => useImageGallery());

        await act(async () => {
            await Promise.all(ids.map(id => result.current.handleProcess(id)));
        });

        ids.forEach(id => {
            expect(mockedApi.processImage).toHaveBeenCalledWith(id);
            expect(result.current.isProcessing.has(id)).toBe(false);
        });
    });

    it('should handle fetch errors with proper error state', async () => {
        const error = new Error('Failed to fetch');
        mockedApi.getImages.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useImageGallery());

        await act(async () => {
            await jest.runAllTimers();
        });

        expect(result.current.error).toBe('Failed to fetch');
        expect(result.current.isLoading).toBe(false);
        expect(mockedApi.getImages).toHaveBeenCalledTimes(1);
        expect(result.current.images).toEqual([]);
    });
});