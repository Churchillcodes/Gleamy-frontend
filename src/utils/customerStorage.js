const STORAGE_KEY = "gleamy_customer";
const EXPIRY_DAYS = 30;

export function saveCustomerDetails({ customerName, customerPhone }) {
  const payload = {
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    savedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadCustomerDetails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const data = JSON.parse(raw);

    const age = Date.now() - data.savedAt;

    const maxAge = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (age > maxAge) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      customerName: data.customerName || "",
      customerPhone: data.customerPhone || "",
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearCustomerDetails() {
  localStorage.removeItem(STORAGE_KEY);
}
