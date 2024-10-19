import React, { useState, useEffect } from "react";
import { getBonusHistory } from "../../Services/bonusService";
import './bonushistory.css'

interface Investor {
  _id: string;
  name: string;
  tokenPurchased: number;
}

interface BonusCodeHistory {
  code: string;
  usedBy: Investor[];
}

const BonusHistory: React.FC<{ codeId: string }> = ({ codeId }) => {
  const [history, setHistory] = useState<BonusCodeHistory | null>(null);

  useEffect(() => {
    fetchBonusHistory();
  }, []);

  const fetchBonusHistory = async () => {
    try {
      const response = await getBonusHistory(codeId);
      setHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!history) return <div>Loading...</div>;

  return (
    <div className="bonus-history">
      <h3>Bonus Code History for {history.code}</h3>
      <ul>
        {history.usedBy.map((investor) => (
          <li key={investor._id}>
            Investor: {investor.name} | Tokens Purchased:{" "}
            {investor.tokenPurchased}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BonusHistory;
