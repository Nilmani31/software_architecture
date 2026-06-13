const mongoose = require("mongoose");
const Officer = require("./models/Officer");
const FineCategory = require("./models/FineCategory");
const Driver = require("./models/Driver");
const Vehicle = require("./models/Vehicle");
const Fine = require("./models/Fine");

async function createTestFine() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/traffic-fine-db");
    console.log("Connected to MongoDB");

    // Get officer
    const officer = await Officer.findOne({ email: "officer@slpolice.lk" });
    if (!officer) throw new Error("Officer not found. Run seeder first!");

    // Get category
    const category = await FineCategory.findOne({ categoryCode: "OVS" });
    if (!category) throw new Error("Category OVS not found. Run seeder first!");

    // Create or find Driver
    let driver = await Driver.findOne({ licenseNumber: "B1234567" });
    if (!driver) {
      driver = await Driver.create({
        name: "Kamal Silva",
        licenseNumber: "B1234567",
        phone: "+94771234567"
      });
    }

    // Create or find Vehicle
    let vehicle = await Vehicle.findOne({ plateNumber: "WP-CAD-1234" });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        plateNumber: "WP-CAD-1234",
        vehicleType: "CAR",
        driverId: driver._id
      });
    }

    // Create Fine
    await Fine.deleteOne({ referenceNumber: "TF-TESTFINE" }); // Clean if exists
    const fine = await Fine.create({
      referenceNumber: "TF-TESTFINE",
      vehicleId: vehicle._id,
      driverId: driver._id,
      categoryId: category._id,
      officerId: officer._id,
      location: "Galle Face, Colombo",
      district: "Galle", // Officer district is Galle
      description: "Driving at 85km/h in a 60km/h zone",
      isPaid: false
    });

    console.log("✅ Test fine created successfully:", fine.referenceNumber);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create test fine:", err);
    process.exit(1);
  }
}

createTestFine();
