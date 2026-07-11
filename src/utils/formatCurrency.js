/**
 * Formats a number as a Kenyan Shilling (KSh) price
 * @param {number} amount - The numeric amount
 * @returns {string} The formatted price
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return 'KSh 0';
  return 'KSh ' + new Intl.NumberFormat('en-KE').format(amount);
}
