// src/services/PrestadorService.js
import api from "./api";

export const salvarPrestador = async (prestador) => {
  try {
    if (prestador._id) {
      return alterarPrestador(prestador._id, prestador);
    } else {
      return adicionarPrestador(prestador);
    }
  } catch (error) {
    console.error("Erro ao salvar prestador:", error);
    throw error;
  }
};

// Serviço para adicionar um novo prestador
export const adicionarPrestador = async (prestador) => {
  try {
    const response = await api.post("prestadores", prestador);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao adicionar prestador:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para alterar um prestador (usando PATCH)
export const alterarPrestador = async (id, camposParaAtualizar) => {
  try {
    const response = await api.patch(`prestadores/${id}`, camposParaAtualizar);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao alterar prestador:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para carregar um prestador pelo ID
export const carregarPrestador = async (id) => {
  try {
    const response = await api.get(`prestadores/${id}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao carregar prestador:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para listar todos os prestadores com ou sem filtro
export const listarPrestadores = async (filtro) => {
  try {
    const response = await api.get("prestadores", { params: filtro });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao listar prestadores:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// carregar prestador por SID
export const carregarPrestadorPorSid = async (sid) => {
  try {
    const response = await api.get(`prestadores/sid/${sid}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao carregar prestador por SID:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const obterPrestadorPorDocumento = async (documento) => {
  try {
    const response = await api.get(`/prestadores/documento/${documento}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error("Erro ao buscar prestador por documento.");
  }
};

export const obterPrestadorPorEmail = async (email) => {
  try {
    const response = await api.get(`/prestadores/email/${email}`);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    throw error;
  }
};

export const obterPrestadorPorPis = async (pis) => {
  try {
    const response = await api.get(`/prestadores/pis/${pis}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};
