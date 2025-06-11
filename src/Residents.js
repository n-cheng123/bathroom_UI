import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from './config';

function Residents() {
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/residents`);
      setResidents(res.data);
    } catch (err) {
      setError("Failed to fetch residents.");
    }
  };

  const handleDelete = async (residentId) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;

    try {
      await axios.delete(`${API_BASE}/residents/${residentId}`);
      fetchResidents();
    } catch (err) {
      setError("Failed to delete resident.");
    }
  };

  return (
    <div>
      <h2>Residents</h2>
      <button onClick={() => navigate("/add-resident")}>Add Resident</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {residents.map((r) => (
          <li key={r.resident_id}>
            {r.name} (Student ID: {r.student_id})
            <button onClick={() => navigate(`/edit-resident/${r.resident_id}`)} style={{ marginLeft: "1rem" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(r.resident_id)} style={{ marginLeft: "0.5rem", color: "red" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Edit Resident Page
function EditResident() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${API_BASE}/residents/` + id)
      .then(res => {
        setName(res.data.name);
        setStudentId(res.data.student_id);
      })
      .catch(() => setError("Failed to load resident."));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/residents/` + id, {
        name,
        student_id: studentId
      });
      navigate("/residents");
    } catch (err) {
      setError("Failed to update resident.");
    }
  };

  return (
    <div>
      <h2>Edit Resident</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Update</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

// Add Resident Page
function AddResident() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_BASE}/residents`, {
        student_id: studentId,
        name,
      });
      navigate("/residents");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Student ID must be unique.");
      } else {
        setError("Error adding resident.");
      }
    }
  };

  return (
    <div>
      <h2>Add Resident</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
export { Residents, EditResident, AddResident };