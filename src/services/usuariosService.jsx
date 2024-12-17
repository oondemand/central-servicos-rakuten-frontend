// src/services/usuariosService.js
import api from "./api";

// Serviço para Usuários
export const adicionarUsuario = async (usuario) => {
  try {
    const response = await api.post("/usuarios", usuario);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar Usuário:", error);
    throw error;
  }
};

export const alterarUsuario = async (id, usuario) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar Usuário:", error);
    throw error;
  }
};

export const excluirUsuario = async (id) => {
  try {
    await api.delete(`/usuarios/${id}`);
  } catch (error) {
    console.error("Erro ao excluir Usuário:", error);
    throw error;
  }
};

export const listarUsuarios = async () => {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar Usuários:", error);
    throw error;
  }
};

export const enviarConvite = async (userId) => {
  try {
    const response = await api.post("/usuarios/enviar-convite", { userId });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar Usuário:", error);
    throw error;
  }
};
