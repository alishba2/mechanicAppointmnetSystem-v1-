const express = require('express');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const path = require('path');
const { register, login, createOrUpdateProfile, getUserById, getAllMechanics } = require('../controllers/userController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


// Routes
router.post('/register', register);
router.post('/login', login);
router.put('/profile', upload.single('profileImage'), createOrUpdateProfile); // Auth middleware can be added here
router.get('/user/:id', getUserById);
router.get('/mechanics', getAllMechanics);


module.exports = router;
