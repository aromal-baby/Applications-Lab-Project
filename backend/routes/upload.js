const express = require('express');
const { upload, handleUploadError } = require('../middleware/upload');
const fs = require('fs');
const { auth, adminAuth } = require('../middleware/auth');
const path = require('path');
const router = express.Router();

// Applying auth middleware
router.use(auth);
router.use(adminAuth);

// For single image upload
router.post('/image', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return handleUploadError(err, req, res);
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

            console.log('File uploaded successfully:', {
                filename: req.file.filename,
                path: req.file.path,
                url: imageUrl
            });

            res.json({
                success: true,
                message: 'Image uploaded successfully',
                url: imageUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size
            });
        } catch (error) {
            console.error('Image processing error:', error);
            res.status(500).json({ message: 'Image upload failed', error: error.message });
        }
    });
});

// To Upload multiple images
router.post('/images', (req, res) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err) {
            return handleUploadError(err, req, res);
        }

        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const uploadedFiles = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                filename: file.filename,
                originalName: file.originalname,
                size: file.size
            }));

            console.log('Multiple files uploaded successfully:', uploadedFiles.length);

            res.json({
                success: true,
                message: 'Images uploaded successfully',
                files: uploadedFiles
            });
        } catch (error) {
            console.error('Images processing error:', error);
            res.status(500).json({ message: 'Images upload failed', error: error.message });
        }
    });
});

// To delete image
router.delete('/image/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        console.log('Attempting to delete file:', filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('File deleted successfully:', filename);
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            console.log('File not found:', filePath);
            res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
    } catch (error) {
        console.error('Image deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Image deletion failed',
            error: error.message
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    res.json({
        status: 'OK',
        uploadsDir: uploadsDir,
        dirExists: fs.existsSync(uploadsDir)
    });
});

module.exports = router;