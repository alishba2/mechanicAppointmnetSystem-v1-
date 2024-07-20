const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    service: { type: String, required: true },
    status: { type: String, default: 'pending' } // Possible statuses: 'pending', 'confirmed', 'completed', 'cancelled'
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
