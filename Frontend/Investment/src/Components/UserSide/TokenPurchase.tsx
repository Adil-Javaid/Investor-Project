import React, { useState, useEffect } from "react";
import "./TokenPurchase.css";

const TokenPurchase: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [bonusCode, setBonusCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [bonusCodesData, setBonusCodesData] = useState<any[]>([]);
  const [tokenOptions, setTokenOptions] = useState<any[]>([]);
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100);
  const [usedBonusCodes, setUsedBonusCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tokensPerPage = 6;

  useEffect(() => {
    fetchBonusCodes();
  }, []);

  const fetchBonusCodes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/bonus/all");
      const data = await response.json();
      setBonusCodesData(data);
      setTokenOptions(
        data.map((bonus: any) => ({
          _id: bonus._id,
          code: bonus.code,
          price: bonus.tokenPrice,
        }))
      );
    } catch (error) {
      console.error("Error fetching bonus codes:", error);
      setError("Failed to fetch bonus codes.");
    }
  };

  const handleCreateAccount = async () => {
    const id = `investor-${Math.random().toString(36).substr(2, 9)}`;
    setInvestorId(id);

    try {
      const response = await fetch(
        "http://localhost:8000/api/investor/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  const handleBonusCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBonusCode(e.target.value);
    validateBonusCode(e.target.value);
  };

  const validateBonusCode = (code: string) => {
    const bonusCodeEntry = bonusCodesData.find((b) => b.code === code);
    const currentDate = new Date();

    if (
      bonusCodeEntry &&
      bonusCodeEntry.active &&
      new Date(bonusCodeEntry.expirationDate) > currentDate
    ) {
      setDiscount(bonusCodeEntry.discountPercentage);
      setError("");
    } else {
      setDiscount(0);
      setError("Invalid, expired, or deactivated bonus code.");
    }
  };

  const handleTokenSelection = (tokenId: string) => {
    setSelectedToken(tokenId);
    setBonusCode("");
    setDiscount(0);
    setError("");
  };

  const handlePurchase = async () => {
    if (!investorId || !selectedToken || purchaseAmount <= 0) {
      setError("Please create an account, select a token, and enter a valid amount.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/bonus/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId,
          code: bonusCode,
          tokenAmount: purchaseAmount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUsedBonusCodes((prev) => [...prev, bonusCode]);
        alert(`Purchase successful! You bought tokens: ${data.finalTokenAmount}`);
        resetPurchaseForm();
      } else {
        setError(data.message || "Purchase failed.");
      }
    } catch (error) {
      console.error("Error making purchase:", error);
      setError("Failed to make purchase.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPurchaseForm = () => {
    setSelectedToken(null);
    setPurchaseAmount(100); // Reset to default
    setBonusCode("");
    setDiscount(0);
  };

  const calculateTotalTokens = () => {
    const bonusTokens = (purchaseAmount * discount) / 100;
    return purchaseAmount + bonusTokens;
  };

  // Pagination Logic
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = tokenOptions.slice(indexOfFirstToken, indexOfLastToken);

  const totalPages = Math.ceil(tokenOptions.length / tokensPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="token-purchase-page">
      <header>
        <h1>Token Purchase Portal</h1>
        <p>Get exclusive tokens with bonus discounts!</p>
      </header>

      <section className="account-section">
        {!investorId && (
          <div className="create-account">
            <h3>Create Your Account</h3>
            <button className="primary-btn" onClick={handleCreateAccount}>
              Create Account
            </button>
          </div>
        )}
        {investorId && <p className="investor-id">Investor ID: {investorId}</p>}
      </section>

      {investorId && (
        <section className="purchase-section">
          <h2>Purchase Tokens</h2>
          <div className="token-list">
            {currentTokens.map((token) => (
              <div className="token-card" key={token._id}>
                <div className="token-details">
                  <h3>Bonus Code: {token.code}</h3>
                  <p>Price: {token.price} USD</p>
                </div>
                <button className="primary-btn" onClick={() => handleTokenSelection(token._id)}>
                  Select Token
                </button>

                {selectedToken === token._id && (
                  <div className="purchase-form">
                    <div className="form-group">
                      <label htmlFor="purchase-amount">Enter Number of Tokens:</label>
                      <input
                        type="number"
                        id="purchase-amount"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bonus-code">Bonus Code:</label>
                      <input
                        type="text"
                        id="bonus-code"
                        value={bonusCode}
                        onChange={handleBonusCodeChange}
                        placeholder="Enter bonus code"
                      />
                      {error && <p className="error">{error}</p>}
                    </div>
                    <p className="total-tokens">
                      Total Tokens after bonus: <strong>{calculateTotalTokens()}</strong>
                    </p>
                    <button className="primary-btn confirm-purchase" onClick={handlePurchase} disabled={isLoading}>
                      {isLoading ? "Processing..." : "Confirm Purchase"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {tokenOptions.length > tokensPerPage && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default TokenPurchase;
