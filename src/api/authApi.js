import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginUsuario = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
    return response.data;
  } catch (error) {
    throw new Error("Erro ao autenticar usuário");
  }
};

// Implementando a função validarToken
export const validarToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/validar-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Supondo que a resposta contenha os dados do usuário
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};
