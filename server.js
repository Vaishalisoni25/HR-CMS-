import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import attendanceRoute from "./routes/attendance.route.js";
import employeeRoute from "./routes/employee.route.js";
import salaryRoute from "./routes/salary.route.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/salary", salaryRoute);

// app.use(errorHandler);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running  at  http://localhost:${PORT}`)
);
