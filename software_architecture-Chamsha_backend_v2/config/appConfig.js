require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || true,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  smsMock: process.env.SMS_MOCK === "true",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
};