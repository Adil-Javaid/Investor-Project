import React, { useEffect, useState } from "react";
import "./TokenPurchase.css";

const TokenPurchase: React.FC = () => {
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [bonusCode, setBonusCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [bonusCodesData, setBonusCodesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBonusCodes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bonus/all");
        const data = await response.json();
        setBonusCodesData(data); 
      } catch (error) {
        console.error("Error fetching bonus codes:", error);
        setError("Failed to fetch bonus codes.");
      }
    };

    fetchBonusCodes();
  }, []);

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAmount(Number(e.target.value));
  };

  const handleBonusCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setBonusCode(code);
    validateBonusCode(code);
  };

  const validateBonusCode = (code: string) => {
    const currentDate = new Date();

    
    const bonusCodeEntry = bonusCodesData.find((b) => b.code === code);

    if (bonusCodeEntry) {
      if (
        bonusCodeEntry.active &&
        new Date(bonusCodeEntry.expirationDate) > currentDate
      ) {
        setDiscount(bonusCodeEntry.discountPercentage);
        setError(""); 
      } else {
        setDiscount(0);
        setError("Invalid or expired bonus code."); 
      }
    } else {
      
      setDiscount(0);
      setError("Invalid or expired bonus code.");
    }
  };

  const calculateTotal = () => {
    const discountAmount = (tokenAmount * discount) / 100;
    return tokenAmount - discountAmount;
  };

  return (
    <div className="token-purchase">
      <h2>Token Purchase</h2>
      <div className="form-group">
        <label htmlFor="token-amount">Token Amount:</label>
        <input
          type="number"
          id="token-amount"
          value={tokenAmount}
          onChange={handleTokenAmountChange}
          min="0"
        />
      </div>
      <div className="form-group">
        <label htmlFor="bonus-code">Bonus Code:</label>
        <input
          type="text"
          id="bonus-code"
          value={bonusCode}
          onChange={handleBonusCodeChange}
        />
        {error && <p className="error">{error}</p>}
      </div>
      <div className="result">
        <p>
          Total after discount: {calculateTotal() >= 0 ? calculateTotal() : 0}{" "}
          tokens
        </p>
      </div>
    </div>
  );
};

export default TokenPurchase;
