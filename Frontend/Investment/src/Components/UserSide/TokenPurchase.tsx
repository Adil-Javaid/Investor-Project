import React, { useState, useEffect } from "react";
import "./TokenPurchase.css"; // Assuming this CSS file contains your styles

const TokenPurchase: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [bonusCode, setBonusCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [bonusCodesData, setBonusCodesData] = useState<any[]>([]);
  const [tokenOptions, setTokenOptions] = useState<any[]>([]);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [usedBonusCodes, setUsedBonusCodes] = useState<string[]>([]);

  // For account creation (assuming investor creation logic)
  const handleCreateAccount = async () => {
    const id = `investor-${Math.random().toString(36).substr(2, 9)}`; // Generate random ID
    setInvestorId(id);

    try {
      // Send a POST request to create the investor account with the generated ID
      const response = await fetch(
        "http://localhost:8000/api/investor/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Investor Name",
            email: "email@example.com",
            investorId: id,
          }),
        }
      );

      if (response.ok) {
        alert(`Account created! Your Investor ID: ${id}`);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account.");
    }
  };


  useEffect(() => {
    const fetchBonusCodes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bonus/all");
        const data = await response.json();
        setBonusCodesData(data);
        const tokens = data.map((bonus) => ({
          _id: bonus._id,
          name: bonus.token,
          price: bonus.tokenPrice,
        }));
        setTokenOptions(tokens);
      } catch (error) {
        console.error("Error fetching bonus codes:", error);
        setError("Failed to fetch bonus codes.");
      }
    };
    fetchBonusCodes();
  }, []);

  const handleBonusCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setBonusCode(code);
    validateBonusCode(code);
  };

  const validateBonusCode = (code: string) => {
    const bonusCodeEntry = bonusCodesData.find((b) => b.code === code);
    const currentDate = new Date();

    if (bonusCodeEntry) {
      if (
        bonusCodeEntry.active &&
        new Date(bonusCodeEntry.expirationDate) > currentDate
      ) {
        setDiscount(bonusCodeEntry.discountPercentage);
        setError("");
      } else {
        setDiscount(0);
        setError("Invalid, expired, or deactivated bonus code.");
      }
    } else {
      setDiscount(0);
      setError("Invalid or expired bonus code.");
    }
  };

  const handleTokenSelection = (tokenId: string, price: number) => {
    setSelectedToken(tokenId);
    setPurchasePrice(price);
    setBonusCode("");
    setDiscount(0);
  };

  const handlePurchase = async () => {
    if (!investorId || !selectedToken || purchasePrice <= 0) {
      setError(
        "Please create an account, select a token, and enter a valid price."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/bonus/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investorId, // Use the generated investorId
          code: bonusCode,
          tokenAmount: purchasePrice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsedBonusCodes((prev) => [...prev, bonusCode]);
        alert(
          `Purchase successful! You bought tokens worth: ${data.finalTokenAmount}`
        );
        setSelectedToken(null); // Reset after successful purchase
      } else {
        setError(data.message || "Purchase failed.");
      }
    } catch (error) {
      console.error("Error making purchase:", error);
      setError("Failed to make purchase.");
    }
  };

  const calculateTotal = () => {
    const discountAmount = (purchasePrice * discount) / 100;
    return purchasePrice - discountAmount;
  };

  return (
    <div className="token-purchase">
      <h2>Token Purchase</h2>

      {!investorId && (
        <div className="account-creation">
          <h3>Create an Account</h3>
          <button onClick={handleCreateAccount}>Create Account</button>
        </div>
      )}

      {investorId && <p>Your Investor ID: {investorId}</p>}

      <div className="token-selection">
        <h3>Select a Token</h3>
        <ul>
          {tokenOptions.map((token) => (
            <li key={token._id}>
              <p>Token: {token.name}</p>
              <p>Price: {token.price} USD</p>
              <button
                onClick={() => handleTokenSelection(token._id, token.price)}
              >
                Buy Token
              </button>

              {/* Show purchase form below the selected token */}
              {selectedToken === token._id && (
                <div className="purchase-form">
                  <div className="form-group">
                    <label htmlFor="purchase-price">
                      Enter Purchase Price:
                    </label>
                    <input
                      type="number"
                      id="purchase-price"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
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
                  <p>Total after discount: {calculateTotal()} USD</p>
                  <button onClick={handlePurchase}>Confirm Purchase</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TokenPurchase;
