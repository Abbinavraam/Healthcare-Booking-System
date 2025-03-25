const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Book an appointment
router.post('/book', authenticate, authorize(['patient']), async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, notes } = req.body;

    // Validate required fields
    if (!doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.approved) {
      return res.status(400).json({ error: 'Doctor not available' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date).toISOString().split('T')[0],
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create new appointment
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      notes: notes || '',
      status: 'pending'
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get patient appointments
router.get('/patient', authenticate, authorize(['patient']), async (req, res) => {
  try {
    // Find all appointments for the patient
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        select: 'specialization profileImage',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ date: 1 });

    // Format the response
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment._id,
      doctorName: appointment.doctorId.userId.name,
      doctorEmail: appointment.doctorId.userId.email,
      doctorSpecialization: appointment.doctorId.specialization,
      doctorImage: appointment.doctorId.profileImage,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status,
      createdAt: appointment.createdAt
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctor appointments
router.get('/doctor', authenticate, authorize(['doctor']), async (req, res) => {
  try {
    // Find the doctor profile for the current user
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    // Find all appointments for the doctor
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate({
        path: 'patientId',
        select: 'name email'
      })
      .sort({ date: 1 });

    // Format the response
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment._id,
      patientName: appointment.patientId.name,
      patientEmail: appointment.patientId.email,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status,
      createdAt: appointment.createdAt
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        select: 'specialization profileImage consultationFee',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('patientId', 'name email');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the user is authorized to view this appointment
    if (
      appointment.patientId._id.toString() !== req.user.id &&
      appointment.doctorId.userId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Format the response
    const formattedAppointment = {
      id: appointment._id,
      patientName: appointment.patientId.name,
      patientEmail: appointment.patientId.email,
      doctorName: appointment.doctorId.userId.name,
      doctorEmail: appointment.doctorId.userId.email,
      doctorSpecialization: appointment.doctorId.specialization,
      doctorImage: appointment.doctorId.profileImage,
      consultationFee: appointment.doctorId.consultationFee,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status,
      createdAt: appointment.createdAt
    };

    res.json(formattedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel an appointment
router.put('/cancel/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the user is authorized to cancel this appointment
    if (
      appointment.patientId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if the appointment can be cancelled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({ error: `Cannot cancel an appointment that is already ${appointment.status}` });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Confirm an appointment (Doctor/Admin)
router.put('/confirm/:id', authenticate, authorize(['doctor', 'admin']), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // If the user is a doctor, check if they are the doctor for this appointment
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });

      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    // Check if the appointment can be confirmed
    if (appointment.status !== 'pending') {
      return res.status(400).json({ error: `Cannot confirm an appointment that is ${appointment.status}` });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({ message: 'Appointment confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark appointment as completed (Doctor/Admin)
router.put('/complete/:id', authenticate, authorize(['doctor', 'admin']), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // If the user is a doctor, check if they are the doctor for this appointment
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });

      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    // Check if the appointment can be completed
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ error: 'Only confirmed appointments can be marked as completed' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Appointment marked as completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get the day of the week for the selected date
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    // Check if the doctor is available on this day
    if (!doctor.availableDays.includes(dayOfWeek)) {
      return res.json({
        available: false,
        message: `Doctor is not available on ${dayOfWeek}`,
        availableSlots: []
      });
    }

    // Get all booked appointments for the doctor on the selected date
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: new Date(date).toISOString().split('T')[0],
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get the booked time slots
    const bookedSlots = bookedAppointments.map(appointment => appointment.timeSlot);

    // Filter out the booked slots from the doctor's available slots
    const availableSlots = doctor.availableTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      available: true,
      availableSlots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
