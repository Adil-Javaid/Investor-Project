import React, { useState } from "react";
import { generateBonusCode } from "../../Services/bonusService";
import './bonuscodeform.css'

const BonusCodeForm: React.FC = () => {
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [expirationDate, setExpirationDate] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await generateBonusCode(
        discountPercentage,
        expirationDate
      );
      alert(`Bonus code generated: ${response.data.code}`);
    } catch (error) {
      console.error(error);
      alert("Error generating bonus code.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bonus-form">
        <label>Discount Percentage</label>
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          min={1}
          max={100}
          required
        />
      </div>
      <div>
        <label>Expiration Date</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Generate Bonus Code</button>
    </form>
  );
};

export default BonusCodeForm;
