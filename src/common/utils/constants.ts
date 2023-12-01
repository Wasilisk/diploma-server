import * as process from 'process';

export const constants = {
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: 10,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  sessionSecret: process.env.SESSION_SECRET,
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
  filesUploadLocation: process.env.UPLOAD_LOCATION,
  stripeApiKey: process.env.STRIPE_API_KEY,
  clientUrl: process.env.CLIENT_URL,
};
