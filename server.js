const express = require("express");
const connectDB = require("./db/connectDB");

const app = express();
const port = 3000;

// Import routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employeeRoute");
const attendanceRoutes = require("./routes/attendanceRoute"); // Optional, if it exists

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
  console.log(`server is running on port ${port}`);
});
