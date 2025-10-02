import type { ClaseDias } from "./types";

export const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const calculateDaysDifference = (fechaString: string) => {
  const today = new Date();
  const [day, month, year] = fechaString.split("/").map(Number);
  const fecha = new Date(year, month - 1, day);
  const diff = Math.ceil((+fecha - +today) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getDaysClass = (dias: number): ClaseDias => {
  if (dias > 60) return "positivo";
  if (dias >= 0) return "cercano";
  return "negativo";
};
