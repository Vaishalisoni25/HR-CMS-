require("dotenv").config();
const routes = require("./routes/auth.route");
const express = require("express");
const connectDB = require("./config/connectDB");

const app = express();
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/employees", require("./routes/employee.route"));
app.use("/api/attendance", require("./routes/employee.route"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server running  at  http://localhost::${PORT}`)
);
