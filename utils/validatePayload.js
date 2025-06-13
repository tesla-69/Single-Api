exports.validatePayload = ({ message, phoneNumber, channels }) => {
    return typeof message === 'string' &&
           typeof phoneNumber === 'string' &&
           Array.isArray(channels) &&
           channels.length > 0;
  };
  