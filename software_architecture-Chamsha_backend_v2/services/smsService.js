/**
 * SMS Service
 * Uses Twilio in production, mock logging in development.
 * Set SMS_MOCK=true in .env to use mock mode.
 */

const config = require("../config/appConfig");

const sendSMS = async (toPhone, message) => {
  if (config.smsMock) {
    // Mock mode: just log to console
    console.log(`\n📱 [SMS MOCK] To: ${toPhone}`);
    console.log(`   Message: ${message}`);
    console.log(`   Status: Sent (mock)\n`);
    return { success: true, mock: true };
  }

  // Real Twilio integration
  try {
    const twilio = require("twilio");
    const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

    const msg = await client.messages.create({
      body: message,
      from: config.twilioPhoneNumber,
      to: toPhone,
    });

    console.log(`✅ SMS sent to ${toPhone}. SID: ${msg.sid}`);
    return { success: true, sid: msg.sid };
  } catch (error) {
    console.error(`❌ SMS failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment confirmation SMS to the officer
 */
const notifyOfficerPayment = async (officer, fine, payment) => {
  const message =
    `🚔 SL Traffic Fines Alert\n` +
    `Payment Received!\n` +
    `Ref: ${fine.referenceNumber}\n` +
    `Amount: LKR ${payment.amount}\n` +
    `TxnID: ${payment.transactionId}\n` +
    `Driver may now retrieve their license.\n` +
    `- Sri Lanka Police`;

  return sendSMS(officer.phone, message);
};

module.exports = { sendSMS, notifyOfficerPayment };
