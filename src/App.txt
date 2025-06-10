import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import axios from "axios";

function Home() {
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
      const res = await axios.get("http://localhost:5000/building");
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
      await axios.post("http://localhost:5000/building", {
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
      await axios.delete(`http://localhost:5000/building/${id}`);
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
function EditBuilding() {
  const [buildingName, setBuildingName] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [floors, setFloors] = useState("");
  const [material, setMaterial] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/building/${id}`)
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
      await axios.put(`http://localhost:5000/building/${id}`, {
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

// Residents List Page
function Residents() {
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

  const handleDelete = async (residentId) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;

    try {
      await axios.delete(`http://localhost:5000/residents/${residentId}`);
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
    axios.get("http://localhost:5000/residents/" + id)
      .then(res => {
        setName(res.data.name);
        setStudentId(res.data.student_id);
      })
      .catch(() => setError("Failed to load resident."));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/residents/" + id, {
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
      await axios.post("http://localhost:5000/residents", {
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


// App Component with Routing
export default function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/residents" style={{ marginLeft: "1rem" }}>Residents</Link>
        <Link to="/bathrooms" style={{ marginLeft: "1rem" }}>Bathrooms</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit-building/:id" element={<EditBuilding />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/add-resident" element={<AddResident />} />
        <Route path="/edit-resident/:id" element={<EditResident />} />
        <Route path="/bathrooms" element={<BathroomList />} />
        <Route path="/add-bathroom" element={<AddBathroom />} />
        <Route path="/edit-bathroom/:id" element={<EditBathroom />} />
      </Routes>
    </Router>
  );
}