const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who made the review
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
  comment: { type: String, required: true }, // Review comment
  date: { type: Date, default: Date.now }, // Date when the review was made
});

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
  reviews: [reviewSchema],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
