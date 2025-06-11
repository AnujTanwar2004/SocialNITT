const fs = require('fs/promises');

module.exports = async function (req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were uploaded." });

    const file = req.files.file;

    // Check file size (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      await removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large. Maximum allowed size is 2 MB." });
    }

    // Check file type
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      await removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File format is incorrect. Only JPEG and PNG allowed." });
    }

    next();

  } catch (err) {
    console.error("File validation error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

const removeTmp = async (path) => {
  try {
    await fs.unlink(path);
  } catch (err) {
    console.error("Failed to remove temp file:", err);
  }
};
