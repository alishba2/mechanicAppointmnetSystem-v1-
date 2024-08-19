const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  contactNo: { type: String },
  profileImage: { type: String },
  address: { type: String },
  // Mechanic-specific fields
  skills: { type: [String] },
  yrsOfExperience: { type: Number },
  availableTimeSlots: { type: String },
  hourlyRating: { type: Number },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
