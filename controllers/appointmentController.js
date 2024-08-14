const Appointment = require('../models/appointmentModel');

// Create new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { userId, mechanicId, date, timeSlot, service, status } = req.body;

        // Create new appointment
        const newAppointment = new Appointment({ userId, mechanicId, date, timeSlot, service, status });
        await newAppointment.save();

        res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        // Update appointment status
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

        res.json({ message: 'Appointment status updated successfully', appointment: updatedAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get appointments by user ID
exports.getAppointmentsByUserId = async (req, res) => {
    try {
        console.log("hereeeeeeeeeeeeeeeeeeeeeeeee");
        const { userId } = req.params;

        // Find appointments by user ID
        const appointments = await Appointment.find({ userId });

        res.json({ appointments });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get appointments by mechanic ID
exports.getAppointmentsByMechanicId = async (req, res) => {
    try {
        const { mechanicId } = req.params;

        // Find appointments by mechanic ID
        const appointments = await Appointment.find({ mechanicId });

        res.json({ appointments });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Find appointment by ID and delete it
        const canceledAppointment = await Appointment.findByIdAndDelete(appointmentId);

        if (!canceledAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment canceled successfully', appointment: canceledAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
