// src/controllers/documentController.ts
import { Request, Response } from 'express';
import { uploadFileToCloudinary } from '../helper/cloudinaryUpload';
import fs from 'fs';
import path from 'path';

export const testUploadDocument = async (req: Request, res: Response): Promise<void> => {
    try {

        const {} = req.query

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Get folder name from the request body or use a default
        const folderDir = 'ProjectReport';

        // Get custom file name from the request body or use the original filename without extension
        const fileName = req.body.fileName || path.parse(req.file.originalname).name;

        console.log(`File received: ${req.file.originalname}`);
        console.log(`Temporary path: ${req.file.path}`);
        console.log(`Uploading to Cloudinary folder: ${folderDir}`);
        console.log(`Using file name: ${fileName}`);

        // Check if file exists before uploading
        if (!fs.existsSync(req.file.path)) {
            res.status(500).json({
                success: false,
                message: 'Internal server error: Temporary file not found',
                path: req.file.path
            });
            return;
        }

        // Upload file to Cloudinary with the specified folder and file name
        const cloudinaryUrl = await uploadFileToCloudinary({
            filePath: req.file.path,
            folderDir: folderDir,
            customFileName: fileName
        });

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: cloudinaryUrl,
                filename: req.file.originalname,
                customFileName: fileName,
                mimetype: req.file.mimetype,
                folder: folderDir
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: (error as Error).message
        });
    }
};