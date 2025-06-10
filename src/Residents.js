// Residents.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/residents");
      setResidents(res.data);
    } catch (err) {
      setError("Failed to fetch residents.");
    }
  };

  const handleAddResidentClick = () => {
    navigate("/add-resident");
  };

  const handleEdit = (residentId) => {
    navigate(`/edit-resident/${residentId}`);
  };

  const handleDelete = async (residentId) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;
    try {
      await axios.delete(`http://localhost:5000/residents/${residentId}`);
      fetchResidents(); // Refresh the list
    } catch (err) {
      setError("Failed to delete resident.");
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Residents</h1>
      <button onClick={handleAddResidentClick} style={{ marginBottom: "1rem" }}>
        Add Resident
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {residents.map((r) => (
          <li key={r.resident_id} style={{ marginBottom: "0.5rem" }}>
            {r.name} ({r.student_id})
            <button
              onClick={() => handleEdit(r.resident_id)}
              style={{ marginLeft: "1rem" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(r.resident_id)}
              style={{ marginLeft: "0.5rem", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
