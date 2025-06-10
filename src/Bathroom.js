import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BathroomList() {
  const [bathrooms, setBathrooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const fetchBathrooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bathroom");
      setBathrooms(res.data);
    } catch {
      setError("Failed to load bathrooms.");
    }
  };

  useEffect(() => {
    fetchBathrooms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bathroom?")) return;
    try {
      await axios.delete(`http://localhost:5000/bathroom/${id}`);
      fetchBathrooms(); 
    } catch {
      setError("Failed to delete bathroom.");
    }
  };

  return (
    <div>
      <h2>Bathrooms</h2>
      <button onClick={() => navigate("/add-bathroom")}>Add Bathroom</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bathrooms.map((b) => (
          <li key={b.bathroom_id}>
            Bathroom ID: {b.bathroom_id},&nbsp;
            Building ID: {b.building_id},&nbsp;
            Floor ID: {b.floor_id},&nbsp;
            Stalls: {b.total_stalls},&nbsp;
            Showers: {b.total_showers},&nbsp;
            Gender: {
              b.gender_typ === "M" ? "Male" :
              b.gender_typ === "F" ? "Female" :
              b.gender_typ === "A" ? "All Gender" :
              b.gender_typ
            }
          <button onClick={() => navigate(`/edit-bathroom/${b.bathroom_id}`)} style={{ marginLeft: "1rem" }}>Edit</button>
          <button onClick={() => handleDelete(b.bathroom_id)} style={{ marginLeft: "0.5rem", color: "red" }}>Delete</button>
       </li>
     ))}
  </ul>
    </div>
  );
}


function AddBathroom() {
  const [floorId, setFloorId] = useState("");
  const [totalStalls, setTotalStalls] = useState("");
  const [totalShowers, setTotalShowers] = useState("");
  const [genderTyp, setGenderTyp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/bathroom", {
        floor_id: parseInt(floorId),
        total_stalls: parseInt(totalStalls),
        total_showers: parseInt(totalShowers),
        gender_typ: genderTyp
      });
      navigate("/bathrooms");
     } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      setError(err.response.data.error);
    } else {
      setError("Failed to add bathroom.");
    }
  }
};

  return (
    <div>
      <h2>Add Bathroom</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Floor ID"
          type="number"
          value={floorId}
          onChange={(e) => setFloorId(e.target.value)}
          required
        />
        <input
          placeholder="Total Stalls"
          type="number"
          value={totalStalls}
          onChange={(e) => setTotalStalls(e.target.value)}
          required
        />
        <input
          placeholder="Total Showers"
          type="number"
          value={totalShowers}
          onChange={(e) => setTotalShowers(e.target.value)}
          required
        />
        <select
          value={genderTyp}
          onChange={(e) => setGenderTyp(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="U">All Gender</option>
          {/* Add others if needed */}
        </select>
        <button type="submit">Add</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

function EditBathroom() {
  const { id } = useParams();
  const [floorId, setFloorId] = useState("");
  const [totalStalls, setTotalStalls] = useState("");
  const [totalShowers, setTotalShowers] = useState("");
  const [genderTyp, setGenderTyp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/bathroom/${id}`)
      .then((res) => {
        setFloorId(res.data.floor_id);
        setTotalStalls(res.data.total_stalls);
        setTotalShowers(res.data.total_showers);
        setGenderTyp(res.data.gender_typ);
      })
      .catch(() => setError("Failed to load bathroom data."));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/bathroom/${id}`, {
        floor_id: parseInt(floorId),
        total_stalls: parseInt(totalStalls),
        total_showers: parseInt(totalShowers),
        gender_typ: genderTyp
      });
      navigate("/bathrooms");
    } catch {
      setError("Failed to update bathroom.");
    }
  };

  return (
    <div>
      <h2>Edit Bathroom</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Floor ID"
          value={floorId}
          onChange={e => setFloorId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Total Stalls"
          value={totalStalls}
          onChange={e => setTotalStalls(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Total Showers"
          value={totalShowers}
          onChange={e => setTotalShowers(e.target.value)}
          required
        />
        <select
          value={genderTyp}
          onChange={e => setGenderTyp(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="A">All Gender</option>
        </select>
        <button type="submit">Update</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export { BathroomList, AddBathroom, EditBathroom };