// src/validation/pisValidator.js
export const isValidPIS = (pis) => {
    const cleaned = pis.replace(/\D/g, '');
  
    if (cleaned.length !== 11) return false;
  
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
  
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i], 10) * weights[i];
    }
  
    const remainder = sum % 11;
    let checkDigit = 11 - remainder;
  
    if (checkDigit >= 10) checkDigit = 0;
  
    return checkDigit === parseInt(cleaned[10], 10);
  };
  