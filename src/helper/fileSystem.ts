// src/helper/fileSystem.ts
import fs from 'fs';
import path from 'path';

export const ensureDirectoryExists = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        // Create the directory recursively (creates parent directories if they don't exist)
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
};

export const initializeFileSystem = (): void => {
    // Use an absolute path to ensure the directory is created in the correct location
    const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
    ensureDirectoryExists(uploadDir);
    console.log(`Upload directory initialized at: ${uploadDir}`);
};