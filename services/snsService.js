const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sns = new AWS.SNS();
console.log("AWS Region from env: ", process.env.AWS_REGION);

exports.sendViaSNS = async (phoneNumber, message) => {
  try {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    console.log("Sending SMS via SNS to:", phoneNumber);
    const result = await sns.publish(params).promise();
    console.log("SNS Success:", result); // ✅ Success log
    return result;

  } catch (err) {
    console.error("❌ SNS Error:", JSON.stringify(err, null, 2)); // 👈 Detailed error
    throw err;
  }
};
