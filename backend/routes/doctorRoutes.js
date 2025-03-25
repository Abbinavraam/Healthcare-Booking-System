const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all approved doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ approved: true }).populate('userId', 'name email');
    
    // Format the response
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id,
      name: doctor.userId.name,
      email: doctor.userId.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualifications: doctor.qualifications,
      bio: doctor.bio,
      consultationFee: doctor.consultationFee,
      availableDays: doctor.availableDays,
      availableTimeSlots: doctor.availableTimeSlots,
      rating: doctor.rating,
      profileImage: doctor.profileImage
    }));
    
    res.json(formattedDoctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Format the response
    const formattedDoctor = {
      id: doctor._id,
      name: doctor.userId.name,
      email: doctor.userId.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      qualifications: doctor.qualifications,
      bio: doctor.bio,
      consultationFee: doctor.consultationFee,
      availableDays: doctor.availableDays,
      availableTimeSlots: doctor.availableTimeSlots,
      rating: doctor.rating,
      reviews: doctor.reviews,
      profileImage: doctor.profileImage
    };
    
    res.json(formattedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update doctor profile (for doctors)
router.put('/profile', authenticate, authorize(['doctor']), async (req, res) => {
  try {
    const { specialization, experience, qualifications, bio, consultationFee, availableDays, availableTimeSlots } = req.body;
    
    // Find the doctor profile for the current user
    let doctor = await Doctor.findOne({ userId: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }
    
    // Update fields
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.qualifications = qualifications ? qualifications.split(',').map(qual => qual.trim()) : doctor.qualifications;
    doctor.bio = bio || doctor.bio;
    doctor.consultationFee = consultationFee || doctor.consultationFee;
    doctor.availableDays = availableDays || doctor.availableDays;
    doctor.availableTimeSlots = availableTimeSlots || doctor.availableTimeSlots;
    
    await doctor.save();
    
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a review for a doctor
router.post('/:id/reviews', authenticate, authorize(['patient']), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Check if user has already reviewed this doctor
    const existingReview = doctor.reviews.find(
      review => review.patientId.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this doctor' });
    }
    
    // Add the new review
    doctor.reviews.push({
      patientId: req.user.id,
      rating,
      comment
    });
    
    // Update the overall rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    doctor.rating = totalRating / doctor.reviews.length;
    
    await doctor.save();
    
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes

// Get all doctors (including unapproved) - Admin only
router.get('/admin/all', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve a doctor - Admin only
router.put('/admin/approve/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    doctor.approved = true;
    await doctor.save();
    
    res.json({ message: 'Doctor approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;