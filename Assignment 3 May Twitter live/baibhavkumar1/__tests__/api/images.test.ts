import { NextRequest } from 'next/server';
import { GET } from '@/app/api/images/route';
import * as storage from '@/lib/storage';
import { ImageMetadata } from '@/types';

// Mock storage module
jest.mock('@/lib/storage');
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('Images API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockImages: ImageMetadata[] = [
        {
            id: '1',
            originalName: 'test1.jpg',
            originalPath: '/uploads/test1.jpg',
            processedPath: null,
            size: 1024,
            dimensions: {
                width: 800,
                height: 600
            },
            createdAt: new Date().toISOString(),
            status: 'uploaded'
        },
        {
            id: '2',
            originalName: 'test2.jpg',
            originalPath: '/uploads/test2.jpg',
            processedPath: '/processed/test2.jpg',
            size: 2048,
            dimensions: {
                width: 800,
                height: 600
            },
            createdAt: new Date().toISOString(),
            status: 'processed'
        }
    ];

    it('should return paginated images', async () => {
        // Mock getImageList to return test data
        mockedStorage.getImageList.mockResolvedValueOnce({
            data: mockImages,
            total: 2,
            page: 1,
            limit: 6,
            totalPages: 1
        });

        // Create mock request with search params
        const req = new NextRequest('http://localhost:3000/api/images?page=1&limit=6', {
            method: 'GET'
        });

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({
            success: true,
            data: {
                data: mockImages,
                total: 2,
                page: 1,
                totalPages: 1
            }
        });
    });

    it('should handle search parameter', async () => {
        // Mock getImageList for search
        mockedStorage.getImageList.mockResolvedValueOnce({
            data: [mockImages[0]],
            total: 1,
            page: 1,
            limit: 6,
            totalPages: 1
        });

        const req = new NextRequest(
            'http://localhost:3000/api/images?page=1&limit=6&search=test1',
            { method: 'GET' }
        );

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(mockedStorage.getImageList).toHaveBeenCalledWith({
            page: 1,
            limit: 6,
            search: 'test1'
        });
    });

    it('should handle invalid pagination parameters', async () => {
        const req = new NextRequest(
            'http://localhost:3000/api/images?page=invalid&limit=invalid',
            { method: 'GET' }
        );

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBeTruthy();
    });

    it('should handle rate limiting', async () => {
        // Make multiple requests to trigger rate limit
        const makeRequest = async () => {
            const req = new NextRequest('http://localhost:3000/api/images', {
                method: 'GET',
                headers: {
                    'x-forwarded-for': '127.0.0.1'
                }
            });
            return await GET(req);
        };

        // Make requests until rate limit is hit
        const responses = await Promise.all(
            Array(101).fill(null).map(() => makeRequest())
        );

        const lastResponse = responses[responses.length - 1];
        const data = await lastResponse.json();

        expect(lastResponse.status).toBe(429);
        expect(data.error).toBe('Rate limit exceeded');
    });
});