const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES();

exports.sendEmailViaSES = (toEmail, subject, plainText, htmlContent) => {
  const params = {
    Source: process.env.SES_SENDER_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: plainText,
          Charset: 'UTF-8',
        },
        Html: {
          Data: htmlContent,
          Charset: 'UTF-8',
        },
      },
    },
  };

  return ses.sendEmail(params).promise();
};
