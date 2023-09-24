import { Twilio } from 'twilio';
import { constants } from './constants';

const { twilioAccountSID, twilioAuthToken, twilioPhoneNumber } = constants;
const client = new Twilio(twilioAccountSID, twilioAuthToken);

export const sendSMS = async (phoneNumber: string, message: string) => {
  try {
    await client.messages.create({
      from: twilioPhoneNumber,
      to: phoneNumber,
      body: message,
    });
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
};
