// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("in db file");
        await mongoose.connect('mongodb://127.0.0.1/MechanicalAppointment', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // process.exit(1);
    }
};

module.exports = connectDB;
