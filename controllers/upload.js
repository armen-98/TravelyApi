const { Image, File } = require('../models');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Upload media
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const file = req.file;

    // Get file extension
    const ext = path.extname(file.originalname).toLowerCase();

    // Generate unique filename
    const filename = `${uuidv4()}${ext}`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move file to uploads directory
    const filePath = path.join(uploadDir, filename);
    fs.renameSync(file.path, filePath);

    // Generate URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const fileUrl = `${baseUrl}/${filename}`;

    // Check if file is an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (imageExtensions.includes(ext)) {
      // Create image record
      const image = await Image.create({
        full: fileUrl,
        thumb: fileUrl, // In a real app, you'd generate a thumbnail
      });

      res.status(200).json({
        success: true,
        data: {
          id: image.id,
          image: fileUrl,
          full: { url: fileUrl },
          thumb: { url: fileUrl },
        },
      });
    } else {
      // Create file record
      const fileRecord = await File.create({
        name: path.basename(file.originalname, ext),
        type: ext.substring(1),
        url: fileUrl,
        size: `${Math.round(file.size / 1024)} KB`,
      });

      res.status(200).json({
        success: true,
        data: {
          id: fileRecord.id,
          name: `${fileRecord.name}.${fileRecord.type}`,
          url: fileRecord.url,
          size: fileRecord.size,
        },
      });
    }
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload media',
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedia,
};
