import React, { useEffect, useState } from "react";
import {
  getAllBonusCodes,
  toggleBonusCodeStatus,
} from "../../Services/bonusService";
import "./bonuslist.css";

interface BonusCode {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  active: boolean;
}

const BonusCodeList: React.FC<{ onSelectBonusCode: (id: string) => void }> = ({
  onSelectBonusCode,
}) => {
  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>([]);

  useEffect(() => {
    fetchBonusCodes();
  }, []);

  const fetchBonusCodes = async () => {
    try {
      const response = await getAllBonusCodes();
      setBonusCodes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (codeId: string, active: boolean) => {
    try {
      await toggleBonusCodeStatus(codeId, !active);
      fetchBonusCodes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bonus-list">
      <h2>Bonus Code Management</h2>
      <ul>
        {bonusCodes.map((code) => (
          <li key={code._id} onClick={() => onSelectBonusCode(code._id)}>
            <h3>Code: {code.code}</h3>
            <p>Discount: {code.discountPercentage}%</p>
            <p>Expires: {new Date(code.expirationDate).toLocaleDateString()}</p>
            <button onClick={() => handleToggle(code._id, code.active)}>
              {code.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BonusCodeList;
