// src/services/authService.js
import api from "./api";

export const register = (data) => {
  return api.post("/auth/registrar-usuario", data);
};

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const validateToken = (token) => {
  return api
    .get(`/auth/validar-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
};

export const esqueciMinhaSenha = async (email) => {
  return await api.post("/auth/esqueci-minha-senha", { email });
};

export const criarNovaSenha = async (values) => {
  const code = localStorage.getItem("code");
  const { data } = await api.post("/auth/alterar-senha", { ...values, code });
  return data;
};
