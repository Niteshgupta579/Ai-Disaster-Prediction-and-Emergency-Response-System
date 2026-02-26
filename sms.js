import twilio from 'twilio';

let client = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export const sendSMSAlert = async (phoneNumber, message) => {
  if (!client) {
    console.log('SMS not configured. Message:', message);
    return { success: false, error: 'SMS not configured' };
  }
  
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    return { success: true };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};
