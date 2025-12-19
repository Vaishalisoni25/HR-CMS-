// develop - 05 Dec 25 12:15
import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import attendanceRoute from "./routes/attendance.route.js";
import employeeRoute from "./routes/employee.route.js";
import salaryRoute from "./routes/salary.route.js";
import settingsRoute from "./routes/settings.route.js";
import reportRoute from "./routes/report.route.js";
import cors from 'cors';

dotenv.config();
const app = express();

connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/salary", salaryRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/report", reportRoute);

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client", "dist");

  app.use(express.static(clientPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === "ZodError") {
    return res.status(400).json({
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
app.listen(PORT, () =>
  console.log(`Server running  at  http://localhost:${PORT}`)
);
