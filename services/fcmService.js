const axios = require('axios');

exports.sendPushNotification = async (token, title, body) => {
  const FCM_URL = 'https://fcm.googleapis.com/fcm/send';

  const payload = {
    to: token,
    notification: {
      title,
      body,
    },
    data: {
      click_action: "FLUTTER_NOTIFICATION_CLICK", // for Flutter users
    },
  };

  const headers = {
    'Authorization': `key=${process.env.FCM_SERVER_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(FCM_URL, payload, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`FCM Error: ${error.response?.data?.error || error.message}`);
  }
};
