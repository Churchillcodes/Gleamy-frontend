export const DEFAULT_WHATSAPP_NUMBER = "254719748944"; // Nairobi, Kenya (+254 719748944)

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3500";

export const CATEGORIES = [
  "Baby Furniture",
  "Storage Furniture",
  "Living Room Furniture",
];

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "In Production",
  "Ready",
  "Delivered",
  "Cancelled",
];

export const ROLES = {
  User: 2001,
  Manager: 1984,
  Admin: 5150,
};
