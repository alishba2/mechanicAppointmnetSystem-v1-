const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


// Register new user
exports.register = async (req, res) => {
    try {

        const { username, email, password, role } = req.body;
        // console.log(username, email, password, role)
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const secretKey = crypto.randomBytes(32).toString('hex'); // Generates a 256-bit (32-byte) key
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create or Update Profile
// In your backend file
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;
        console.log(req.body); // For debugging purposes

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(userId, profileData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
