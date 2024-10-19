// src/services/bonusService.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/bonus";

export const generateBonusCode = (
  discountPercentage: number,
  expirationDate: string
) => {
  return axios.post(`${API_URL}/generate`, {
    discountPercentage,
    expirationDate,
  });
};

export const getAllBonusCodes = () => {
  return axios.get(`${API_URL}/all`);
};

export const toggleBonusCodeStatus = (codeId: string, active: boolean) => {
  return axios.post(`${API_URL}/toggle`, { codeId, active });
};

export const getBonusHistory = (codeId: string) => {
  return axios.get(`${API_URL}/history/${codeId}`);
};
