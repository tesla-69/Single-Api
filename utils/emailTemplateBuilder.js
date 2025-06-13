exports.buildEmailTemplate = (name, message) => {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #007bff;">Hello ${name || 'there'},</h2>
          <p>${message}</p>
          <hr />
          <p style="font-size: 12px; color: #888;">
            This message was sent via Govind Jewellers Campaign App.
          </p>
        </body>
      </html>
    `;
  };
  