import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageMetadata, PaginatedResponse } from '@/types';
import * as api from '@/services/api';

interface UseImageGalleryState {
    images: ImageMetadata[];
    total: number;
    page: number;
    search: string;
    isLoading: boolean;
    isUploading: boolean;
    isProcessing: Set<string>;
    error: string | null;
}

interface UseImageGalleryReturn extends UseImageGalleryState {
    handleUpload: (file: File) => Promise<void>;
    handleProcess: (imageId: string) => Promise<void>;
    handleDownload: (imageId: string) => Promise<void>;
    handlePageChange: (page: number) => void;
    handleSearchChange: (search: string) => void;
    refreshImages: () => Promise<void>;
}

const ITEMS_PER_PAGE = 6;
const SEARCH_DEBOUNCE_MS = 300;

export function useImageGallery(): UseImageGalleryReturn {
    const [state, setState] = useState<UseImageGalleryState>({
        images: [],
        total: 0,
        page: 1,
        search: '',
        isLoading: true,
        isUploading: false,
        isProcessing: new Set(),
        error: null
    });

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const pollingInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const isMounted = useRef(true);
    const currentPage = useRef(1);
    const currentSearch = useRef('');

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    // Fetch images based on current page and search
    const fetchImages = useCallback(async (page?: number, search?: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await api.getImages({
                page: page ?? currentPage.current,
                limit: ITEMS_PER_PAGE,
                search: search ?? currentSearch.current
            });

            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    images: result.data,
                    total: result.total,
                    isLoading: false
                }));
            }
        } catch (error) {
            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to fetch images',
                    isLoading: false
                }));
            }
        }
    }, []);

    // Start polling during upload or processing
    const startPolling = useCallback(() => {
        if (pollingInterval.current) return;
        
        pollingInterval.current = setInterval(() => {
            fetchImages(currentPage.current, currentSearch.current);
        }, 2000); // Poll every 2 seconds
    }, [fetchImages]);

    // Stop polling when not needed
    const stopPolling = useCallback(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = undefined;
        }
    }, []);

    // Initial fetch and refetch when page/search changes
    useEffect(() => {
        currentPage.current = state.page;
        currentSearch.current = state.search;
        fetchImages(state.page, state.search);
    }, [state.page, state.search, fetchImages]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            stopPolling();
            isMounted.current = false;
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [stopPolling]);

    // Handle file upload
    const handleUpload = async (file: File) => {
        setState(prev => ({ ...prev, isUploading: true, error: null }));
        startPolling(); // Start polling for updates

        try {
            await api.uploadImage(file);
            await fetchImages(currentPage.current, currentSearch.current);
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Upload failed'
            }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isUploading: false }));
            stopPolling(); // Stop polling after upload complete
        }
    };

    // Handle image processing
    const handleProcess = async (imageId: string) => {
        setState(prev => ({
            ...prev,
            isProcessing: new Set(Array.from(prev.isProcessing).concat([imageId])),
            error: null
        }));
        startPolling(); // Start polling for updates

        try {
            await api.processImage(imageId);
            await fetchImages(currentPage.current, currentSearch.current);
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Processing failed'
            }));
            throw error;
        } finally {
            setState(prev => {
                const newProcessing = new Set(prev.isProcessing);
                newProcessing.delete(imageId);
                return { ...prev, isProcessing: newProcessing };
            });
            stopPolling(); // Stop polling after processing complete
        }
    };

    // Handle image download
    const handleDownload = async (imageId: string) => {
        try {
            const image = state.images.find(img => img.id === imageId);
            if (!image) throw new Error('Image not found');
            
            await api.downloadProcessedImage(imageId, image.originalName);
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Download failed'
            }));
            throw error;
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setState(prev => ({ ...prev, page }));
    };

    // Handle search with debounce
    const handleSearchChange = (search: string) => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            setState(prev => ({
                ...prev,
                search,
                page: 1 // Reset to first page when search changes
            }));
        }, SEARCH_DEBOUNCE_MS);
    };

    // Public method to force refresh
    const refreshImages = useCallback(async () => {
        await fetchImages();
    }, [fetchImages]);

    return {
        ...state,
        handleUpload,
        handleProcess,
        handleDownload,
        handlePageChange,
        handleSearchChange,
        refreshImages
    };
}