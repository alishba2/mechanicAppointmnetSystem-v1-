const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const secretKey = crypto.randomBytes(32).toString("hex"); // Generates a 256-bit (32-byte) key

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create or Update Profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    console.log(profileData, "profileData");

    // Add profileImage to profileData if a file is uploaded
    if (req.file) {
      profileData.profileImage = req.file.path;
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(userId, profileData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("data saveddddddddd");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users except mechanics
exports.getAllCustomers = async (req, res) => {
  try {
    // Find all users where role is not "mechanic"
    const customers = await User.find({ role: { $ne: "mechanic" } });

    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.json({ customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all mechanics
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await User.find({ role: "mechanic" });

    if (mechanics.length === 0) {
      return res.status(404).json({ message: "No mechanics found" });
    }

    res.json({ mechanics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// forget password

// Generate and send password reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Create a reset password link (you can adjust the URL as per your frontend route)
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    // Set token and expiry in user's record
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token valid for 30 minutes
    await user.save();

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or any other email service provider
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) have requested the reset of a password. 
      Please click on the following link, or paste this into your browser to complete the process: \n\n ${resetUrl} \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reset password using the token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token and find user by reset token and expiration
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Ensure the token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params; // Mechanic's ID
    const { rating, comment } = req.body; // Rating and comment from the request body
    const userId = req.user.id; // Assuming you're using authentication middleware and req.user contains the logged-in user

    // Find the mechanic by ID
    const mechanic = await User.findById(id);

    if (!mechanic || mechanic.role !== "mechanic") {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    // Create a new review
    const newReview = {
      userId,
      rating,
      comment,
    };

    // Add the review to the mechanic's reviews array
    mechanic.reviews.push(newReview);

    // Save the mechanic with the new review
    await mechanic.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get all reviews for a mechanic
exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params; // Mechanic's ID

    // Find the mechanic by ID and populate the user details for each review
    const mechanic = await User.findById(id).populate(
      "reviews.userId",
      "username"
    );

    if (!mechanic || mechanic.role !== "mechanic") {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    res.json({ reviews: mechanic.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get mechanic details by ID
exports.getMechanicById = async (req, res) => {
  try {
    const { id } = req.params;
    const mechanic = await User.findById(id);

    if (!mechanic || mechanic.role !== "mechanic") {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    res.json({ mechanic, reviews: mechanic.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
