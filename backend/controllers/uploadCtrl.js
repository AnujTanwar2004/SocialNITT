const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadCtrl = {
  uploadAvatar: async (req, res) => {
    try {
      const file = req.files.file;

      if (!file) {
        return res.status(400).json({ msg: "No file uploaded." });
      }

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'avatar',
        width: 480,
        height: 320,
        crop: "fill"
      });

      await removeTmp(file.tempFilePath);

      res.json({ url: result.secure_url });

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