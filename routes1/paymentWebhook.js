const express = require('express');
const router = express.Router();
const { sendViaWhatsApp } = require('../services/whatsappService');
const { sendViaSNS } = require('../services/snsService');

router.post('/payment-webhook', async (req, res) => {
  const event = req.body.event;
  const paymentData = req.body.payload?.payment?.entity;

  if (!paymentData) return res.sendStatus(400);

  const phoneNumber = '+91' + paymentData.contact; // from Razorpay
  const amount = paymentData.amount / 100;
  const orderId = paymentData.notes?.order_id || 'N/A';

  let message = '';

  if (event === 'payment.captured') {
    message = `✅ Payment of ₹${amount} received. Your order #${orderId} is confirmed.`;
  } else if (event === 'payment.failed') {
    message = `⚠️ Payment of ₹${amount} failed for order #${orderId}. Please retry.`;
  }

  // Send message to both channels
  try {
    await sendViaWhatsApp(phoneNumber, message);
    await sendViaSNS(phoneNumber, message);
    res.status(200).send('Message sent');
  } catch (error) {
    console.error('Message sending failed:', error.message);
    res.status(500).send('Error sending message');
  }
});

module.exports = router;
