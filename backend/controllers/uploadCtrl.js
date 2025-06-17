const fs = require('fs/promises');
const path = require('path');

// Define your default image URL
const DEFAULT_AVATAR_URL = "/uploads/default-avatar.png";

const uploadCtrl = {
  uploadAvatar: async (req, res) => {
    try {
      if (!req.files || !req.files.file) {
        // No file uploaded → return default avatar URL
        return res.json({ url: DEFAULT_AVATAR_URL });
      }

      const file = req.files.file;

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads');
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.name);
      const fileName = `${timestamp}_${randomString}${fileExtension}`;
      
      // Define file path
      const filePath = path.join(uploadsDir, fileName);

      // Move file to uploads directory
      await file.mv(filePath);

      // Remove temp file if it exists
      if (file.tempFilePath) {
        await removeTmp(file.tempFilePath);
      }

      // Return the local URL
      const fileUrl = `/uploads/${fileName}`;
      res.json({ url: fileUrl });

    } catch (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

const removeTmp = async (path) => {
  try {
    await fs.unlink(path);
  } catch (err) {
    console.error("Failed to remove temp file:", err);
  }
};

module.exports = uploadCtrl;