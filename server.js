const express = require("express");
const connectDB = require("./db/connectDB");

const app = express();
const port = 3000;

// Import routes
const authRoutes = require("./routes/auth.route");
const employeeRoutes = require("./routes/employee.route");
const attendanceRoutes = require("./routes/attendance.route"); // Optional, if it exists

connectDB();
app.use(express.json());

// Use routes
app.use("/auth", authRoutes);
app.use("/employee", employeeRoutes);
app.use("/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("HR-CMS backend is runniiiing");
});

app.listen(port, () => {
  console.log(` Server is running at http://localhost:${port}`);
});
