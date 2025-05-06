import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const resizeImage = async (inputPath: string, outputName: string,width: number,height: number): Promise<string> => {
  const outputPath = path.join('converted', outputName);

  await sharp(inputPath)
    .resize(width, height)
    .toFile(outputPath);

  return outputPath;
};
