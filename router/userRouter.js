const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  register,
  login,
  createOrUpdateProfile,
  getUserById,
  getAllMechanics,
  getAllCustomers,
  deleteUserById,
  forgotPassword,
  getMechanicById,
  resetPassword,
  addReview, // Add this line
  getReviews, // Add this line
} = require("../controllers/userController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/register", register);
router.post("/login", login);
router.put("/profile", upload.single("profileImage"), createOrUpdateProfile); // Auth middleware can be added here
router.get("/user/:id", getUserById);
router.get("/mechanics", getAllMechanics);
router.get("/customers", getAllCustomers);
router.delete("/user/:id", deleteUserById);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/mechanics/:id", getMechanicById);

// Review routes
router.post("/mechanics/:id/reviews", addReview);
router.get("/mechanics/:id/reviews", getReviews);
module.exports = router;
