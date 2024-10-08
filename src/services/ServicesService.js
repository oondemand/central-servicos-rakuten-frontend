import api from "../api/apiService";

export const SalvarServico = async (servicos) => {
    try {
      const response = await api.post('servicos', servicos);
      return response.data; // Retorna os dados da resposta
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      throw error; // Repassa o erro para que o chamador possa tratá-lo
    }
  };