const fs = require('fs');
const csv = require('csv-parser');
const { sendViaSNS } = require('../../services/snsService');
const { sendViaWhatsApp } = require('../../services/whatsappService');

exports.processCSVAndSend = (filePath, message, channels) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const { phoneNumber, name } = row;
        const personalizedMsg = message.replace('{{name}}', name || 'there');

        const status = {};

        for (const ch of channels) {
          try {
            if (ch === 'sns') await sendViaSNS(phoneNumber, personalizedMsg);
            else if (ch === 'whatsapp') await sendViaWhatsApp(phoneNumber, personalizedMsg);
            status[ch] = 'sent';
          } catch (err) {
            console.error(`Failed for ${ch} to ${phoneNumber}:`, err.message);
            status[ch] = 'failed';
          }
        }

        results.push({ phoneNumber, name, status });
      })
      .on('end', () => {
        fs.unlinkSync(filePath); // remove uploaded file
        resolve(results);
      })
      .on('error', reject);
  });
};
