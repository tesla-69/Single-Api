const express = require('express');
const router = express.Router();
const { sendViaSNS } = require('../services/snsService');
const { sendViaWhatsApp } = require('../services/whatsappService');
const { validatePayload } = require('../utils/validatePayload');

router.post('/send-campaign', async (req, res) => {
   
  const { message, phoneNumber, channels } = req.body;
  
  if (!validatePayload(req.body)) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  const results = {};

  for (const channel of channels) {
    try {
      if (channel === 'sns') {
        await sendViaSNS(phoneNumber, message);
        results.sns = 'Sent';
      } else if (channel === 'whatsapp') {
        await sendViaWhatsApp(phoneNumber, message);
        results.whatsapp = 'Sent';
      } else {
        results[channel] = 'Unsupported channel';
      }
    } catch (error) {
      results[channel] = 'Failed';
      console.error(`${channel} error:`, error.message);
    }
  }

  res.json({ status: 'completed', results });
});

module.exports = router;
