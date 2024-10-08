import api from "../api/apiService";

export const SalvarPrestador = async (prestadores) => {
    try {
      const response = await api.post('prestadores', prestadores);
      return response.data; // Retorna os dados da resposta
    } catch (error) {
      console.error('Erro ao salvar prestador:', error);
      throw error; // Repassa o erro para que o chamador possa tratá-lo
    }
  };