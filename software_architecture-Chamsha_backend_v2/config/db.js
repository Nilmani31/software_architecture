const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Officer = require("../models/Officer");
const FineCategory = require("../models/FineCategory");

const seedData = async () => {
  const categories = [
    { categoryCode: "OVS", name: "Over Speeding", description: "Exceeding speed limit", amount: 3000 },
    { categoryCode: "DUI", name: "Driving Under Influence", description: "Driving while intoxicated", amount: 25000 },
  ];
  for (const cat of categories) {
    await FineCategory.findOneAndUpdate({ categoryCode: cat.categoryCode }, cat, { upsert: true, new: true });
  }
  const adminPass = await bcrypt.hash("Admin@1234", 12);
  await Admin.findOneAndUpdate({ email: "admin@slpolice.lk" }, { name: "Super Admin", email: "admin@slpolice.lk", password: adminPass, district: "Colombo", role: "SUPER_ADMIN" }, { upsert: true, new: true });
  const officerPass = await bcrypt.hash("Officer@1234", 12);
  await Officer.findOneAndUpdate({ email: "officer@slpolice.lk" }, { name: "Test Officer", badgeNumber: "SLP-001", email: "officer@slpolice.lk", password: officerPass, phone: "+94771234567", district: "Galle" }, { upsert: true, new: true });
  
  // Create a test fine for testing
  const Fine = require("../models/Fine");
  const Vehicle = require("../models/Vehicle");
  const Driver = require("../models/Driver");
  
  let driver = await Driver.findOne({ licenseNumber: "LIC123" });
  if (!driver) {
    driver = await Driver.create({ name: "John Doe", licenseNumber: "LIC123", phone: "+94770000000" });
  }
  let vehicle = await Vehicle.findOne({ plateNumber: "CBA-1234" });
  if (!vehicle) {
    vehicle = await Vehicle.create({ plateNumber: "CBA-1234", vehicleType: "CAR", driverId: driver._id });
  }
  
  const category = await FineCategory.findOne({ categoryCode: "OVS" });
  const officer = await Officer.findOne({ email: "officer@slpolice.lk" });
  
  const existingFine = await Fine.findOne({ referenceNumber: "TF-TEST-001" });
  if (!existingFine) {
    await Fine.create({
      referenceNumber: "TF-TEST-001",
      vehicleId: vehicle._id,
      driverId: driver._id,
      categoryId: category._id,
      officerId: officer._id,
      location: "Galle Road",
      district: "Colombo",
      description: "Speeding at 90kmph",
      isPaid: false
    });
    console.log("✅ Seeded test fine TF-TEST-001 (Category: OVS)");
  }
  
  console.log("✅ In-memory database seeded automatically");
};

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    let isMemory = false;

    // Use memory server if no URI provided or if it's the example URI
    if (!mongoUri || mongoUri.includes("<username>") || mongoUri.includes("cluster0.xxxxx.mongodb.net")) {
      console.log("⚠️ No valid MONGO_URI found. Starting MongoDB Memory Server...");
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      isMemory = true;
      console.log("✅ MongoDB Memory Server started successfully.");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    if (isMemory) {
       await seedData();
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
