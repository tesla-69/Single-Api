const fs = require('fs');
const csv = require('csv-parser');
const { sendViaSNS } = require('../../services/snsService');
const { sendViaWhatsApp } = require('../../services/whatsappService');
const { sendEmailViaSES } = require('../../services/sesService');
const { buildEmailTemplate } = require('../../utils/emailTemplateBuilder');

exports.processCSVAndSend = (filePath, message, defaultChannels = []) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const { phoneNumber, name, channels, email } = row;

        const userChannels = parseChannels(channels) || defaultChannels;

        const personalizedMsg = message.replace('{{name}}', name || 'there');
        const status = {};

        for (const ch of userChannels) {
          try {
            if (ch === 'sns') await sendViaSNS(phoneNumber, personalizedMsg);
            else if (ch === 'whatsapp') await sendViaWhatsApp(phoneNumber, personalizedMsg);
            else if (ch === 'email' && email) {
                const htmlBody = buildEmailTemplate(name, personalizedMsg);
                await sendEmailViaSES(email, 'Your Campaign Message', personalizedMsg, htmlBody);
              }
            else status[ch] = 'unsupported';

            status[ch] = status[ch] || 'sent';
          } catch (err) {
            console.error(`Error sending via ${ch} to ${phoneNumber}:`, err.message);
            status[ch] = 'failed';
          }
        }

        results.push({ phoneNumber, name, status });
      })
      .on('end', () => {
        fs.unlinkSync(filePath);
        resolve(results);
      })
      .on('error', reject);
  });
};

function parseChannels(channelsStr) {
  try {
    if (!channelsStr) return null;
    return JSON.parse(channelsStr.replace(/'/g, '"')); // handle single quotes
  } catch {
    return null;
  }
}
