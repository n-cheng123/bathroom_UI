// AddOrEditResident.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AddOrEditResident() {
  const { id } = useParams(); // for edit mode
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Edit mode: fetch resident details
      axios
        .get(`http://localhost:5000/residents/${id}`)
        .then((res) => {
          setStudentId(res.data.student_id);
          setName(res.data.name);
        })
        .catch(() => {
          setError("Failed to load resident details.");
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!studentId.trim() || !name.trim()) {
      setError("Both student ID and name are required.");
      return;
    }

    try {
      if (id) {
        // Edit resident
        await axios.put(`http://localhost:5000/residents/${id}`, {
          student_id: studentId,
          name,
        });
        setMessage("Resident updated successfully.");
      } else {
        // Add resident
        await axios.post("http://localhost:5000/residents", {
          student_id: studentId,
          name,
        });
        setMessage("Resident added successfully.");
      }

      setTimeout(() => navigate("/residents"), 1000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Student ID must be unique.");
      } else {
        setError(id ? "Failed to update resident." : "Failed to add resident.");
      }
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>{id ? "Edit Resident" : "Add Resident"}</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">{id ? "Update" : "Add"}</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </main>
  );
}
