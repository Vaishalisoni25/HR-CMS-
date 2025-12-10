// develop - 05 Dec 25 12:15
import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import attendanceRoute from "./routes/attendance.route.js";
import employeeRoute from "./routes/employee.route.js";
import salaryRoute from "./routes/salary.route.js";
import settingsRoute from "./routes/settings.route.js";
import { success } from "zod";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/salary", salaryRoute);
app.use("/api/settings", settingsRoute);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === "ZodError") {
    returnres.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT;
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

app.listen(PORT, () =>
  console.log(`Server running  at  http://localhost:${PORT}`)
);
