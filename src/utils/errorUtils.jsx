// src/utils/errorUtils.js
export const getErrorMessage = (error) => {
  if (error.response?.data?.mensagem) {
    return error.response.data.mensagem;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else {
    return "Ocorreu um erro inesperado.";
  }
};
