// develop - 05 Dec 25 12:15
import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import connectDB from "./config/connectDB.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import attendanceRoute from "./routes/attendance.route.js";
import employeeRoute from "./routes/employee.route.js";
import salaryRoute from "./routes/salary.route.js";
import settingsRoute from "./routes/settings.route.js";
import reportRoute from "./routes/report.route.js";
import salaryStructureRoute from "./routes/salaryStructure.route.js";
import adjustmentRoute from "./routes/otherAdjustment.route.js";
import { setCloudinary } from "./config/cloudinary.js";
import employeeSummary from "./routes/employeeSummary.route.js";

const app = express();

connectDB();
setCloudinary();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/salary", salaryRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/report", reportRoute);
app.use("/api/salaryStructure", salaryStructureRoute);
app.use("/api/adjustment", adjustmentRoute);
app.use("/api/employeeSummary", employeeSummary);
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client", "dist");

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
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
    message: err.message || "server error",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running  at  http://localhost:${PORT}`)
);
