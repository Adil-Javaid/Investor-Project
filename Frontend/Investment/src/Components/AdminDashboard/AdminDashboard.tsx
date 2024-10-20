import React, { useState } from "react";
import BonusCodeForm from "./BonusCodeForm";
import BonusCodeList from "./BonusCodeList";
import "./AdminDashboard.css";
import BonusCodeHistory from "./BonusHistory";

const AdminDashboard: React.FC = () => {
  const [selectedBonusCode, setSelectedBonusCode] = useState<string | null>(
    null
  );
  const investorId = "investor-z1pq907eo"; 

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <div>
          <h2>Create Bonus Code</h2>
          <BonusCodeForm />
        </div>
        <div>
          <h2>Manage Bonus Codes</h2>
          <BonusCodeList onSelectBonusCode={setSelectedBonusCode} />
        </div>
      </div>
      {selectedBonusCode && (
        <div className="dashboard-content">
          <div style={{ width: "100%" }}>
            <h2>Bonus Code Usage History</h2>
            <BonusCodeHistory investorId={investorId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
