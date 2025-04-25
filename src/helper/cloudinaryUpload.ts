// src/helper/cloudinaryUpload.ts
import cloudinary from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

interface UploadFileParams {
    filePath: string;
    folderDir: string;
    customFileName?: string; // Optional custom file name
}

export const uploadFileToCloudinary = async ({
    filePath,
    folderDir,
    customFileName
}: UploadFileParams): Promise<string> => {
    try {
        // Get file extension from the original path
        const fileExtension = path.extname(filePath);

        // Prepare upload options
        const uploadOptions: any = {
            resource_type: 'auto', // Automatically detect the file type
            folder: folderDir,     // Use the provided folder directory
        };

        // If custom filename is provided, use it
        if (customFileName) {
            // Add public_id option with the custom filename (without extension)
            // Cloudinary will add the appropriate extension based on the file type
            uploadOptions.public_id = customFileName;
        }

        // Upload the file to Cloudinary with the specified options
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);

        // Remove the temporary file after upload
        fs.unlinkSync(filePath);

        // Return the Cloudinary URL
        return result.secure_url;
    } catch (error) {
        // Remove the temporary file if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
};