const express = require("express");
const cors = require("cors");
const config = require("./config/appConfig");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Sri Lanka Traffic Fine API is running ✅", version: "1.0.0" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/fines", require("./routes/fineRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;