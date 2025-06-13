const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const { processCSVAndSend } = require('../services/csvProcessor');

const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post('/send-campaign-csv', upload.single('csv'), async (req, res) => {
  const { message, channels } = req.body;
  const csvPath = req.file.path;

  if (!message || !channels || !Array.isArray(JSON.parse(channels))) {
    return res.status(400).json({ error: 'Missing message or channels' });
  }

  try {
    const results = await processCSVAndSend(csvPath, message, JSON.parse(channels));
    res.json({ status: 'completed', summary: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Campaign sending failed' });
  }
});

module.exports = router;
