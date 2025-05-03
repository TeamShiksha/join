import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const resizeTo512 = async (inputPath: string, outputName: string): Promise<string> => {
  const outputPath = path.join('converted', outputName);

  await sharp(inputPath)
    .resize(512, 512)
    .toFile(outputPath);

  return outputPath;
};
