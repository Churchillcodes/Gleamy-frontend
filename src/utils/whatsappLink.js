import { DEFAULT_WHATSAPP_NUMBER } from "./constants";

/**
 * Generates a WhatsApp deep link
 * @param {string} text - The message to encode
 * @param {string} [phone] - The recipient phone number (defaults to DEFAULT_WHATSAPP_NUMBER)
 * @returns {string} The formatted URL
 */
export function generateWhatsAppLink(text, phone = DEFAULT_WHATSAPP_NUMBER) {
  // Clean phone number (remove +, spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates a WhatsApp link for a product inquiry
 * @param {object} product - The product object
 * @returns {string} The formatted URL
 */
export function getProductInquiryLink(product) {
  const isMadeToOrder = product.isMadeToOrder === true;
  const priceStr = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(product.listedPrice);

  let text = "";
  if (isMadeToOrder) {
    text = `Hi gleamy Baby Cots & Furniture, I'm interested in ordering a custom "${product.name}" (Listed Price: ${priceStr}). Could we discuss the details and production time?`;
  } else {
    text = `Hi gleamy Baby Cots & Furniture, I'm interested in buying the "${product.name}" (Listed Price: ${priceStr}). Is it available in stock?`;
  }

  return generateWhatsAppLink(text);
}

/**
 * Generates a WhatsApp link from the contact form
 * @param {string} name - Customer's name
 * @param {string} phone - Customer's phone number
 * @param {string} message - Customer's custom message
 * @returns {string} The formatted URL
 */
export function getContactFormLink(name, phone, message) {
  const text = `Hi gleamy Baby Cots & Furniture, my name is ${name} (Phone: ${phone}). I have the following inquiry:\n\n${message}`;
  return generateWhatsAppLink(text);
}
