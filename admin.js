const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  const hashed = await bcrypt.hash("Admin@123, 10");
  const exist = await User.findOne({ email: "admin@example.com" });

  if (exist) {
    console.log("admin already exist");
    process.exit(0);
  }
  const user = await User.create({
    name: "Super admin",
    email: "admin@example.com",
    password: hashed,
    role: "superadmin",
  });
  console.log("Superadmin created:", user.email);
  process.exist(0);
}

run().catch((err) => {
  console.Console.err(err);
  process.exit(1);
});
