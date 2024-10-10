// src/services/baseOmieService.js
import api from "./api";

// Serviço para Bases Omie
export const adicionarBaseOmie = async (baseOmie) => {
  try {
    const response = await api.post("/baseomies", baseOmie);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar Base Omie:", error);
    throw error;
  }
};

export const alterarBaseOmie = async (id, baseOmie) => {
  try {
    const response = await api.put(`/baseomies/${id}`, baseOmie);
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar Base Omie:", error);
    throw error;
  }
};

export const excluirBaseOmie = async (id) => {
  try {
    await api.delete(`/baseomies/${id}`);
  } catch (error) {
    console.error("Erro ao excluir Base Omie:", error);
    throw error;
  }
};

export const listarBaseOmies = async () => {
  try {
    const response = await api.get("/baseomies");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar Bases Omie:", error);
    throw error;
  }
};
