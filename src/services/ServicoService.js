import api from "../api/apiService";

export const salvarServico = async (servico) => {
  try {
    if (servico._id) {
      return alterarServico(servico._id, servico);
    } else {
      return adicionarServico(servico);
    }
  } catch (error) {
    console.error("Erro ao salvar serviço:", error);
    throw error;
  }
};

// Serviço para adicionar um novo serviço
export const adicionarServico = async (servico) => {
  try {
    const response = await api.post("servicos", servico);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao adicionar serviço:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para alterar um serviço (usando PATCH)
export const alterarServico = async (id, camposParaAtualizar) => {
  try {
    const response = await api.patch(`servicos/${id}`, camposParaAtualizar);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao alterar serviço:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para carregar um serviço pelo ID
export const carregarServico = async (id) => {
  try {
    const response = await api.get(`servicos/${id}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao carregar serviço:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};