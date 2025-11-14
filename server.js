const express = require("express");

const app = express();
const port = 3000;

const connectDB = require("./db/connectDB");

connectDB();
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/employee", require("./employeeRoute"));
app.use("/api/attendance", require("attendanceRoute"));

app.listen(port, () => {
  console.log(`server is runnning on port ${port}`);
});
