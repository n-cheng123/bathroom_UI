import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from './config';

export function Home() {
  const [buildingName, setBuildingName] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [floors, setFloors] = useState("");
  const [material, setMaterial] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const navigate = useNavigate();

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/building`);
      setBuildings(res.data);
    } catch {
      setMessage("Failed to load buildings.");
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const validate = () => {
    const errs = [];
    const year = parseInt(yearBuilt);
    const floorNum = parseInt(floors);
    const currentYear = new Date().getFullYear();

    if (!buildingName.trim()) errs.push("Building Name is required.");
    if (!yearBuilt || isNaN(year) || year < 1900 || year > currentYear) {
      errs.push(`Year Built must be between 1900 and ${currentYear}.`);
    }
    if (!floors || isNaN(floorNum) || floorNum < 1 || floorNum > 100) {
      errs.push("Floors must be between 1 and 100.");
    }
    if (!material.trim()) errs.push("Material is required.");

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    try {
      await axios.post(`${API_BASE}/building`, {
        building_name: buildingName,
        year_built: parseInt(yearBuilt),
        floors: parseInt(floors),
        material,
      });
      setMessage("Building added successfully!");
      setBuildingName("");
      setYearBuilt("");
      setFloors("");
      setMaterial("");
      fetchBuildings();
    } catch (err) {
      setMessage("Error adding building.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this building?")) return;
    try {
      await axios.delete(`${API_BASE}/building/${id}`);
      fetchBuildings();
    } catch {
      setMessage("Failed to delete building.");
    }
  };

  return (
    <div>
      <h2>Add Building</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Building Name" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} />
        <input placeholder="Year Built" type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />
        <input placeholder="Floors" type="number" value={floors} onChange={(e) => setFloors(e.target.value)} />
        <input placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
        <button type="submit">Submit</button>
        {errors.length > 0 && <ul>{errors.map((e, i) => <li key={i} style={{ color: "red" }}>{e}</li>)}</ul>}
        {message && <p style={{ color: message.startsWith("Error") ? "red" : "green" }}>{message}</p>}
      </form>

      <h3>Existing Buildings</h3>
      <ul>
        {buildings.map((b) => (
          <li key={b.building_id}>
            {b.building_name} - Year: {b.year_built}, Floors: {b.floors}, Material: {b.material}
            <button onClick={() => navigate(`/edit-building/${b.building_id}`)} style={{ marginLeft: "1rem" }}>Edit</button>
            <button onClick={() => handleDelete(b.building_id)} style={{ marginLeft: "0.5rem", color: "red" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function EditBuilding() {
  const [buildingName, setBuildingName] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [floors, setFloors] = useState("");
  const [material, setMaterial] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${API_BASE}/building/${id}`)
      .then((res) => {
        setBuildingName(res.data.building_name);
        setYearBuilt(res.data.year_built);
        setFloors(res.data.floors);
        setMaterial(res.data.material);
      })
      .catch(() => setError("Failed to load building."));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/building/${id}`, {
        building_name: buildingName,
        year_built: parseInt(yearBuilt),
        floors: parseInt(floors),
        material,
      });
      navigate("/");
    } catch (err) {
      setError("Failed to update building.");
    }
  };

  return (
    <div>
      <h2>Edit Building</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Building Name" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} />
        <input placeholder="Year Built" type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />
        <input placeholder="Floors" type="number" value={floors} onChange={(e) => setFloors(e.target.value)} />
        <input placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
        <button type="submit">Update</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}