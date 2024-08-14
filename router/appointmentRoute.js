const Appointment = require('../models/appointmentModel');

const express = require('express');
const {
    createAppointment,
    updateAppointmentStatus,
    getAppointmentsByUserId,
    getAppointmentsByMechanicId,
    cancelAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

router.post('/appointments', createAppointment);
router.put('/appointments/status', updateAppointmentStatus);
router.get('/appointments/user/:userId', getAppointmentsByUserId);
router.get('/appointments/mechanic/:mechanicId', getAppointmentsByMechanicId);
router.delete('/appointments', cancelAppointment);


// reschedule appointment
router.put('/appointments/reschedule', async (req, res) => {
    console.log("rescheduling appointment==================");
    try {
        const { appointmentId, newTimeSlot } = req.body;

        // Update appointment status to "Pending" and set new time slot
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: 'Pending', timeSlot: newTimeSlot },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;

