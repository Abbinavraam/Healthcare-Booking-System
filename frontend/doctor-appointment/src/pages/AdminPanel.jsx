import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const AdminPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch doctors");
        }
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleApproval = async (doctorId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update doctor status");
      }
      setDoctors((prev) => prev.map((doc) => (doc._id === doctorId ? { ...doc, status } : doc)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="doctor-approvals">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p>Specialization: {doctor.specialization}</p>
            <p>Status: {doctor.status}</p>
            {doctor.status === "pending" && (
              <div>
                <button onClick={() => handleApproval(doctor._id, "approved")} className="approve-btn">Approve</button>
                <button onClick={() => handleApproval(doctor._id, "rejected")} className="reject-btn">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default AdminPanel;