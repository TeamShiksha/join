import {
    saveImageMetadata,
    getImageList,
    getImageMetadata,
    updateImageMetadata,
    deleteImageMetadata
} from '@/lib/storage';
import { ImageMetadata } from '@/types';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

describe('Storage Operations', () => {
    const mockData: ImageMetadata[] = [
        {
            id: 'test-1',
            originalName: 'test1.jpg',
            originalPath: '/uploads/test1.jpg',
            processedPath: null,
            size: 1024,
            dimensions: { width: 800, height: 600 },
            createdAt: '2024-05-03T12:00:00.000Z',
            status: 'uploaded'
        },
        {
            id: 'test-2',
            originalName: 'test2.jpg',
            originalPath: '/uploads/test2.jpg',
            processedPath: '/processed/test2.jpg',
            size: 2048,
            dimensions: { width: 800, height: 600 },
            createdAt: '2024-05-03T12:01:00.000Z',
            status: 'processed'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));
        (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    });

    describe('getImageList', () => {
        it('returns paginated image list', async () => {
            const result = await getImageList({ page: 1, limit: 1 });

            expect(result).toEqual({
                data: [mockData[0]],
                total: 2,
                page: 1,
                limit: 1,
                totalPages: 2
            });
        });

        it('handles search parameter', async () => {
            const result = await getImageList({
                page: 1,
                limit: 10,
                search: 'test1'
            });

            expect(result.data).toHaveLength(1);
            expect(result.data[0].originalName).toContain('test1');
        });

        it('returns empty array when no images match search', async () => {
            const result = await getImageList({
                page: 1,
                limit: 10,
                search: 'nonexistent'
            });

            expect(result.data).toHaveLength(0);
            expect(result.total).toBe(0);
        });
    });

    describe('getImageMetadata', () => {
        it('finds image by id', async () => {
            const result = await getImageMetadata('test-1');
            expect(result).toEqual(mockData[0]);
        });

        it('returns null for nonexistent image', async () => {
            const result = await getImageMetadata('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('saveImageMetadata', () => {
        const newImage: ImageMetadata = {
            id: 'test-3',
            originalName: 'test3.jpg',
            originalPath: '/uploads/test3.jpg',
            processedPath: null,
            size: 3072,
            dimensions: { width: 800, height: 600 },
            createdAt: '2024-05-03T12:02:00.000Z',
            status: 'uploaded'
        };

        it('saves new image metadata', async () => {
            await saveImageMetadata(newImage);

            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.stringContaining(newImage.id),
                'utf-8'
            );
        });

        it('appends to existing images', async () => {
            await saveImageMetadata(newImage);

            const writeCallArg = (fs.writeFile as jest.Mock).mock.calls[0][1];
            const savedData = JSON.parse(writeCallArg);

            expect(savedData).toHaveLength(mockData.length + 1);
            expect(savedData).toContainEqual(newImage);
        });

        it('handles write errors', async () => {
            (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

            await expect(saveImageMetadata(newImage)).rejects.toThrow('Write error');
        });
    });

    describe('updateImageMetadata', () => {
        it('updates image metadata', async () => {
            await updateImageMetadata('test-1', {
                status: 'processed',
                processedPath: '/processed/test1.jpg'
            });

            const writeCallArg = (fs.writeFile as jest.Mock).mock.calls[0][1];
            const savedData = JSON.parse(writeCallArg);
            const updatedImage = savedData.find((img: ImageMetadata) => img.id === 'test-1');

            expect(updatedImage.status).toBe('processed');
            expect(updatedImage.processedPath).toBe('/processed/test1.jpg');
        });

        it('throws error for nonexistent image', async () => {
            const result = await updateImageMetadata('nonexistent', {
                status: 'processed',
                processedPath: '/processed/nonexistent.jpg'
            });
            expect(result).toBeNull();
        });

        it('maintains other image properties after update', async () => {
            await updateImageMetadata('test-1', {
                status: 'processed',
                processedPath: '/processed/test1.jpg'
            });

            const writeCallArg = (fs.writeFile as jest.Mock).mock.calls[0][1];
            const savedData = JSON.parse(writeCallArg);
            const updatedImage = savedData.find((img: ImageMetadata) => img.id === 'test-1');

            expect(updatedImage).toMatchObject({
                originalName: mockData[0].originalName,
                size: mockData[0].size,
                dimensions: mockData[0].dimensions
            });
        
            describe('deleteImageMetadata', () => {
                it('deletes existing image metadata', async () => {
                    const result = await deleteImageMetadata('test-1');
                    
                    expect(result).toBe(true);
                    
                    const writeCallArg = (fs.writeFile as jest.Mock).mock.calls[0][1];
                    const savedData = JSON.parse(writeCallArg);
                    
                    expect(savedData).toHaveLength(mockData.length - 1);
                    expect(savedData.find((img: ImageMetadata) => img.id === 'test-1')).toBeUndefined();
                });
        
                it('returns false when trying to delete nonexistent image', async () => {
                    const result = await deleteImageMetadata('nonexistent');
                    expect(result).toBe(false);
                });
        
                it('maintains data file integrity after deletion', async () => {
                    await deleteImageMetadata('test-1');
                    
                    const writeCallArg = (fs.writeFile as jest.Mock).mock.calls[0][1];
                    const savedData = JSON.parse(writeCallArg);
                    
                    expect(Array.isArray(savedData)).toBe(true);
                    expect(savedData.every((img: ImageMetadata) =>
                        img.id && img.originalName && img.originalPath
                    )).toBe(true);
                });
            });
        
            describe('Storage initialization', () => {
                beforeEach(() => {
                    (fs.access as jest.Mock).mockRejectedValue(new Error('File not found'));
                    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
                });
        
                it('creates data directory if it does not exist', async () => {
                    await getImageList({ page: 1, limit: 10 });
                    
                    expect(fs.mkdir).toHaveBeenCalledWith(
                        expect.stringContaining('data'),
                        expect.objectContaining({ recursive: true })
                    );
                });
        
                it('creates empty metadata file if it does not exist', async () => {
                    await getImageList({ page: 1, limit: 10 });
                    
                    expect(fs.writeFile).toHaveBeenCalledWith(
                        expect.stringContaining('images.json'),
                        '[]',
                        expect.any(String)
                    );
                });
            });
        });
    });
});