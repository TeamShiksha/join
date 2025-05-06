import { validateImage, saveUploadedFile } from '@/lib/imageProcessing';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// Mock external modules
jest.mock('sharp');
jest.mock('uuid');
jest.mock('fs/promises');

describe('Image Processing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (uuidv4 as jest.Mock).mockReturnValue('test-uuid');
    });

    describe('validateImage', () => {
        it('validates a valid image buffer', async () => {
            const mockBuffer = Buffer.from('test-image');
            const mockMetadata = {
                width: 800,
                height: 600,
                format: 'jpeg'
            };

            (sharp as unknown as jest.Mock).mockReturnValue({
                metadata: jest.fn().mockResolvedValue(mockMetadata)
            });

            const result = await validateImage(mockBuffer);

            expect(result).toBe(true);
            expect(sharp).toHaveBeenCalledWith(mockBuffer);
        });

        it('rejects corrupted image data', async () => {
            const mockBuffer = Buffer.from('corrupted-data');

            (sharp as unknown as jest.Mock).mockReturnValue({
                metadata: jest.fn().mockRejectedValue(new Error('Invalid image data'))
            });

            const result = await validateImage(mockBuffer);

            expect(result).toBe(false);
            expect(sharp).toHaveBeenCalledWith(mockBuffer);
        });
    });

    describe('saveUploadedFile', () => {
        const mockBuffer = Buffer.from('test-image');
        const mockFileName = 'test.jpg';
        const expectedUploadPath = path.join('public/uploads', 'test-uuid.jpg');

        beforeEach(() => {
            (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
            (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
            (sharp as unknown as jest.Mock).mockReturnValue({
                metadata: jest.fn().mockResolvedValue({
                    width: 800,
                    height: 600,
                    format: 'jpeg'
                }),
                toBuffer: jest.fn().mockResolvedValue(mockBuffer)
            });
        });

        it('saves uploaded file with correct metadata', async () => {
            const result = await saveUploadedFile(mockBuffer, mockFileName);

            expect(result).toEqual({
                id: 'test-uuid',
                originalName: 'test.jpg',
                originalPath: '/uploads/test-uuid.jpg',
                processedPath: null,
                dimensions: {
                    width: 800,
                    height: 600
                },
                size: mockBuffer.length,
                status: 'uploaded',
                createdAt: expect.any(String)
            });

            expect(fs.mkdir).toHaveBeenCalledWith(
                path.join(process.cwd(), 'public/uploads'),
                { recursive: true }
            );
            expect(fs.writeFile).toHaveBeenCalledWith(
                path.join(process.cwd(), expectedUploadPath),
                mockBuffer
            );
        });

        it('handles file save errors', async () => {
            (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

            await expect(saveUploadedFile(mockBuffer, mockFileName)).rejects.toThrow('Write error');
        });

        it('creates upload directory if it does not exist', async () => {
            await saveUploadedFile(mockBuffer, mockFileName);

            expect(fs.mkdir).toHaveBeenCalledWith(
                expect.stringContaining('public/uploads'),
                expect.any(Object)
            );
        });

        it('preserves original file extension', async () => {
            const pngFileName = 'test.png';
            await saveUploadedFile(mockBuffer, pngFileName);

            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringContaining('test-uuid.png'),
                expect.any(Buffer)
            );
        });
    });
});