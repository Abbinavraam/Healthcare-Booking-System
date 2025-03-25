const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualifications: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  availableTimeSlots: {
    type: [String],
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  profileImage: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/1.jpg'
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);