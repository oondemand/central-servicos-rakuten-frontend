// src/services/PrestadorService.js
import api from "./api";

export const importarComissoes = async (comissoes) => {
  try {
    const response = await api.post("acoes-etapas/importar-comissoes", comissoes);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao importar comissões:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const exportarServicos = async (servicos) => {
  try {
    const response = await api.post("acoes-etapas/exportar-servicos", servicos);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao exportar serviços:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const exportarPrestadores = async (prestadores) => {
  try {
    const response = await api.post("acoes-etapas/exportar-prestadores", prestadores);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao exportar prestadores:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
}

export const importarPrestadores = async (prestadores) => {
  try {
    const response = await api.post("acoes-etapas/importar-prestadores", prestadores);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao importar prestadores:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const importarRPAs = async (rpas) => {
  try {
    const response = await api.post("acoes-etapas/importar-rpas", rpas);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao importar RPAs:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
}