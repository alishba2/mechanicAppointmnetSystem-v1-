
const express = require('express');
const { register, login, createOrUpdateProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', createOrUpdateProfile); // Auth middleware to protect the route

module.exports = router;
