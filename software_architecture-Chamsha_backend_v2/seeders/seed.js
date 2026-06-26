/**
 * Database Seeder
 * Run: node seeders/seed.js
 * Seeds fine categories, one admin, and one officer for testing.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const Officer = require("../models/Officer");
const FineCategory = require("../models/FineCategory");

const MONGO_URI = process.env.MONGO_URI;

const categories = [
  { categoryCode: "OVS", name: "Over Speeding", description: "Exceeding speed limit", amount: 3000 },
  { categoryCode: "DUI", name: "Driving Under Influence", description: "Driving while intoxicated", amount: 25000 },
  { categoryCode: "RLS", name: "Running Red Light / Stop Sign", description: "Failing to stop at red light or stop sign", amount: 5000 },
  { categoryCode: "NLC", name: "No Valid License", description: "Driving without a valid license", amount: 10000 },
  { categoryCode: "NSB", name: "No Seat Belt", description: "Not wearing a seat belt", amount: 2500 },
  { categoryCode: "PHN", name: "Mobile Phone Usage", description: "Using mobile phone while driving", amount: 5000 },
  { categoryCode: "WRW", name: "Wrong Way Driving", description: "Driving against traffic flow", amount: 7500 },
  { categoryCode: "ILL", name: "Illegal Parking", description: "Parking in restricted zone", amount: 2000 },
  { categoryCode: "OVL", name: "Vehicle Overloading", description: "Exceeding vehicle load limit", amount: 6000 },
  { categoryCode: "NOI", name: "No Insurance", description: "Driving without valid insurance", amount: 15000 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Seed categories
    for (const cat of categories) {
      await FineCategory.findOneAndUpdate(
        { categoryCode: cat.categoryCode },
        cat,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${categories.length} fine categories`);

    // Seed admin
    const adminPass = await bcrypt.hash("Admin@1234", 12);
    await Admin.findOneAndUpdate(
      { email: "admin@slpolice.lk" },
      {
        name: "Super Admin",
        email: "admin@slpolice.lk",
        password: adminPass,
        district: "Colombo",
        role: "SUPER_ADMIN",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Seeded admin: admin@slpolice.lk / Admin@1234");

    // Seed officer
    const officerPass = await bcrypt.hash("Officer@1234", 12);
    await Officer.findOneAndUpdate(
      { email: "officer@slpolice.lk" },
      {
        name: "Test Officer",
        badgeNumber: "SLP-001",
        email: "officer@slpolice.lk",
        password: officerPass,
        phone: "+94771234567",
        district: "Galle",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Seeded officer: officer@slpolice.lk / Officer@1234");

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
