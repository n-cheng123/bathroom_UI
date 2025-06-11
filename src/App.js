import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { Home, EditBuilding } from "./Building";
import { Residents, AddResident, EditResident } from "./Residents";
import { BathroomList, AddBathroom, EditBathroom } from "./Bathroom";


export default function App() {
  return (
    <Router>
      <nav>
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