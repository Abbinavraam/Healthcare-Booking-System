import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/styles.css";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const navigate = useNavigate();

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Mock doctor data
  const mockDoctor = {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    experience: 12,
    rating: 4.8,
    patients: 1500,
    availability: ["Monday", "Wednesday", "Friday"],
    timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Specialized in cardiovascular health with over a decade of experience in treating heart conditions.",
    education: "MD from Johns Hopkins University",
    hospital: "City General Hospital",
    languages: ["English", "Spanish"]
  };

  useEffect(() => {
    // Simulate API call to fetch doctor details
    const fetchDoctorDetails = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDoctor(mockDoctor);
      } catch (err) {
        setError("Failed to fetch doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const validateForm = () => {
    const errors = {};

    if (!date) errors.date = "Please select a date";
    if (!time) errors.time = "Please select a time";
    if (!reason) errors.reason = "Please select a reason for your visit";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setBookingStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    setBookingStep(1);
    window.scrollTo(0, 0);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would be an API call to book the appointment
      // const token = localStorage.getItem("token");
      // const response = await fetch("http://localhost:5000/api/appointments", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ doctorId, date, time, reason, notes, insurance }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to book appointment");
      // }

      setBookingSuccess(true);
      window.scrollTo(0, 0);

      // Redirect to appointments page after 3 seconds
      setTimeout(() => {
        navigate("/appointments");
      }, 3000);

    } catch (err) {
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get available dates (next 14 days excluding weekends and past dates)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const availableDays = doctor?.availability.map(day => day.toLowerCase()) || [];

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      if (availableDays.includes(dayName)) {
        const dateString = date.toISOString().split('T')[0];
        dates.push(dateString);
      }
    }

    return dates;
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/doctors")}>
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-page">
        <div className="booking-success">
          <div className="success-icon">✓</div>
          <h2>Appointment Booked Successfully!</h2>
          <p>Your appointment with {doctor.name} has been scheduled for {formatDate(date)} at {time}.</p>
          <p>You will be redirected to your appointments page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Book an Appointment</h1>
        <p>Complete the form below to schedule your appointment</p>
      </div>

      <div className="booking-progress">
        <div className={`progress-step ${bookingStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Date & Time</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${bookingStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Confirm Details</div>
        </div>
      </div>

      <div className="booking-container">
        <div className="booking-doctor-info">
          <img src={doctor.image} alt={doctor.name} className="doctor-image" />
          <div className="doctor-details">
            <h2>{doctor.name}</h2>
            <p className="doctor-specialty">{doctor.specialization}</p>
            <div className="doctor-credentials">
              <div className="credential">
                <span className="credential-icon">🏥</span>
                <span>{doctor.hospital}</span>
              </div>
              <div className="credential">
                <span className="credential-icon">🎓</span>
                <span>{doctor.education}</span>
              </div>
              <div className="credential">
                <span className="credential-icon">⭐</span>
                <span>{doctor.rating} Rating</span>
              </div>
            </div>
          </div>
        </div>

        {bookingStep === 1 ? (
          <div className="booking-form-container">
            <h3>Select Appointment Details</h3>

            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <select
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={formErrors.date ? 'error' : ''}
              >
                <option value="">Select a date</option>
                {getAvailableDates().map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
              {formErrors.date && <div className="error-text">{formErrors.date}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Select Time</label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={formErrors.time ? 'error' : ''}
                disabled={!date}
              >
                <option value="">Select a time</option>
                {doctor.timeSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {formErrors.time && <div className="error-text">{formErrors.time}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={formErrors.reason ? 'error' : ''}
              >
                <option value="">Select a reason</option>
                <option value="New Patient Consultation">New Patient Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Annual Check-up">Annual Check-up</option>
                <option value="Urgent Care">Urgent Care</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.reason && <div className="error-text">{formErrors.reason}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific concerns or information the doctor should know"
                rows="3"
              ></textarea>
            </div>

            <div className="booking-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/doctors")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="booking-confirmation">
            <h3>Confirm Your Appointment</h3>

            <div className="confirmation-details">
              <div className="confirmation-item">
                <span className="confirmation-label">Date:</span>
                <span className="confirmation-value">{formatDate(date)}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Time:</span>
                <span className="confirmation-value">{time}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Doctor:</span>
                <span className="confirmation-value">{doctor.name}</span>
                
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Specialty:</span>
                <span className="confirmation-value">{doctor.specialization}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Reason:</span>
                <span className="confirmation-value">{reason}</span>
              </div>
              {notes && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Notes:</span>
                  <span className="confirmation-value">{notes}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="insurance">Insurance Information (Optional)</label>
              <input
                type="text"
                id="insurance"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Insurance provider and policy number"
              />
            </div>

            <div className="terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#" className="terms-link">terms and conditions</a> and acknowledge the <a href="#" className="terms-link">cancellation policy</a>.
              </label>
            </div>

            <div className="booking-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handlePreviousStep}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBooking}
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
