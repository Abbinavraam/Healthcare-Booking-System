import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const navigate = useNavigate();

  // Mock data for doctors
  const mockDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      experience: 12,
      rating: 4.8,
      patients: 1500,
      availability: "Mon, Wed, Fri",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Specialized in cardiovascular health with over a decade of experience in treating heart conditions."
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialization: "Neurology",
      experience: 15,
      rating: 4.9,
      patients: 2000,
      availability: "Tue, Thu, Sat",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Expert in neurological disorders with specialized training in stroke treatment and rehabilitation."
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialization: "Pediatrics",
      experience: 8,
      rating: 4.7,
      patients: 1200,
      availability: "Mon, Tue, Thu",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Dedicated to providing comprehensive care for children from infancy through adolescence."
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialization: "Orthopedics",
      experience: 10,
      rating: 4.6,
      patients: 1800,
      availability: "Wed, Fri, Sat",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      bio: "Specializes in musculoskeletal conditions and sports injuries with a focus on minimally invasive procedures."
    },
    {
      id: "5",
      name: "Dr. Priya Patel",
      specialization: "Dermatology",
      experience: 7,
      rating: 4.8,
      patients: 1300,
      availability: "Mon, Wed, Fri",
      image: "https://randomuser.me/api/portraits/women/37.jpg",
      bio: "Expert in diagnosing and treating skin conditions with a special interest in cosmetic dermatology."
    },
    {
      id: "6",
      name: "Dr. Robert Kim",
      specialization: "Psychiatry",
      experience: 14,
      rating: 4.9,
      patients: 1100,
      availability: "Tue, Thu, Sat",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      bio: "Specializes in mental health treatment with expertise in anxiety, depression, and stress management."
    }
  ];

  // Unique specialties for filter dropdown
  const specialties = [...new Set(mockDoctors.map(doctor => doctor.specialization))];

  useEffect(() => {
    // Simulate API call
    const fetchDoctors = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDoctors(mockDoctors);
      } catch (err) {
        setError("Failed to fetch doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "" || doctor.specialization === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleDoctorSelect = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <h1>Find the Right Doctor</h1>
        <p>Browse our network of experienced healthcare professionals</p>
      </div>

      <div className="doctors-filters">
        <div className="search-bar">
          <i className="search-icon">🔍</i>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card" onClick={() => handleDoctorSelect(doctor.id)}>
                <div className="doctor-card-header">
                  <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                  <div className="doctor-rating">
                    <span className="star">★</span> {doctor.rating}
                  </div>
                </div>
                <div className="doctor-card-body">
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialization}</p>
                  <p className="doctor-experience">{doctor.experience} years experience</p>
                  <p className="doctor-bio">{doctor.bio}</p>
                </div>
                <div className="doctor-card-footer">
                  <div className="doctor-stats">
                    <div className="stat">
                      <span className="stat-value">{doctor.patients}+</span>
                      <span className="stat-label">Patients</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{doctor.availability}</span>
                      <span className="stat-label">Available</span>
                    </div>
                  </div>
                  <button className="btn btn-primary">View Profile</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No doctors found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Doctors;