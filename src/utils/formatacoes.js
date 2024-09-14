function formatarDocumento(documento) {
  if (!documento) return '';
  const cleaned = documento.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

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

  return documento; // Retorna o documento original se não corresponder ao formato esperado
}

module.exports = { formatarDocumento };