"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    async function loadAgencies() {
      try {
        const res = await axios.get("/api/agencies");
        setAgencies(res.data.agencies);
      } catch (err) {
        console.error("Failed to load agencies:", err);
      }
    }

    loadAgencies();
  }, []);

  return (
    <div>
      <h1>All Agencies</h1>
      <div>{agencies}</div>
      {/* {agencies.map((agency) => (
        <div key={agency.}>
          <h2>{agency.name}</h2>
          <p>📍 {agency.location}</p>
          <p>☎ {agency.phone}</p>
          <p>⭐ {agency.rating}</p>
          <p>✉ {agency.email}</p>
          <hr />
        </div>
      ))} */}
    </div>
  );
}
