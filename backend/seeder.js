const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Scheme = require("./models/Scheme");
const connectDB = require("./config/db");

dotenv.config();

const users = [
  {
    fullName: "Admin User",
    email: "admin@smartpanchayat.in",
    password: "password123", // Will be hashed below
    phone: "9999999999",
    address: "Panchayat Office, Block A",
    role: "admin",
  },
  {
    fullName: "Citizen User",
    email: "citizen@example.com",
    password: "password123",
    phone: "8888888888",
    address: "Village 1, Block B",
    role: "citizen",
  },
];

const schemes = [
  {
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    description: "A flagship mission by the Government of India being implemented by the Ministry of Housing and Urban Affairs to address the housing shortage among the rural and urban poor.",
    eligibility: ["Must not own a pucca house", "Annual income below ₹3,000,00", "Must be a citizen of India"],
    requiredDocuments: ["Aadhaar Card", "Income Certificate", "Bank Passbook", "Passport Size Photo"],
    benefits: ["Financial assistance of ₹1.2 Lakh", "Subsidized loan interest rate"],
    department: "Ministry of Housing and Urban Affairs",
    lastDate: new Date("2026-12-31"),
    status: "Active",
  },
  {
    title: "National Social Assistance Programme (NSAP)",
    category: "Senior Citizens",
    description: "A welfare program administered by the Ministry of Rural Development for providing pensions to the elderly, widows, and persons with disabilities.",
    eligibility: ["Age 60 years or higher", "Belonging to BPL category"],
    requiredDocuments: ["Age Proof", "BPL Ration Card", "Bank Details"],
    benefits: ["Monthly pension of ₹1000", "Direct Benefit Transfer to bank account"],
    department: "Ministry of Rural Development",
    lastDate: new Date("2027-03-31"),
    status: "Active",
  },
  {
    title: "PM-KISAN Samman Nidhi",
    category: "Agriculture",
    description: "An initiative by the government of India in which all farmers will get up to ₹6,000 per year as minimum income support.",
    eligibility: ["Must be a farmer with cultivable land", "Name in land records"],
    requiredDocuments: ["Land Ownership Documents", "Aadhaar Card", "Bank Account Details"],
    benefits: ["₹6,000 per year in 3 equal installments"],
    department: "Department of Agriculture",
    lastDate: new Date("2026-10-15"),
    status: "Active",
  },
  {
    title: "Beti Bachao Beti Padhao",
    category: "Women Welfare",
    description: "A campaign of the Government of India that aims to generate awareness and improve the efficiency of welfare services intended for girls in India.",
    eligibility: ["Girl child born after 2015", "Indian citizen"],
    requiredDocuments: ["Birth Certificate", "Parents Aadhaar", "Bank Account under SSA"],
    benefits: ["High interest rate savings scheme", "Tax exemption"],
    department: "Ministry of Women and Child Development",
    lastDate: new Date("2030-12-31"),
    status: "Active",
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Scheme.deleteMany();

    console.log("Database Cleared");

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers[0]._id;

    // Attach admin as creator for all schemes
    const sampleSchemes = schemes.map((scheme) => {
      return { ...scheme, createdBy: adminUser };
    });

    await Scheme.insertMany(sampleSchemes);

    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
