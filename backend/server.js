const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const path = require("path");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Panchayat Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);