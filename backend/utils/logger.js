const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function logToFile(filename, message) {
  const logPath = path.join(logDir, filename);
  const logMsg = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(logPath, logMsg, err => {
    if (err) console.error("Failed to write log:", err);
  });
}

module.exports = logToFile;