// src/utils/formatacoes.js
export const formatarDocumento = (documento) => {
  if (!documento) return "";
  const cleaned = documento.replace(/\D/g, "");

  if (cleaned.length === 13) {
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `#${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
  } else if (cleaned.length === 14) {
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
  }

  return documento;
};

export function parseBRLCurrencyToNumber(valorStr) {
  const isNegative = valorStr.includes("-");

  const valorLimpo = valorStr
    .replace("R$", "")
    .replace("-", "")
    .replaceAll(/\./g, "")
    .replace(",", ".")
    .trim();

  const numero = parseFloat(valorLimpo);
  return isNegative ? -numero : numero;
}
