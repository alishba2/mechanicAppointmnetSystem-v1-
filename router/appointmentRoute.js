const express = require('express');
const { createAppointment, updateAppointmentStatus, getAppointmentsByUserId, getAppointmentsByMechanicId } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/appointments', createAppointment);
router.put('/appointments/status', updateAppointmentStatus);
router.get('/appointments/user/:userId', getAppointmentsByUserId);
router.get('/appointments/mechanic/:mechanicId', getAppointmentsByMechanicId);

module.exports = router;
