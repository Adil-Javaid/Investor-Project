import React from "react";
import BonusCodeForm from "./BonusCodeForm";
import BonusCodeList from "./BonusCodeList";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
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
          <BonusCodeList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
