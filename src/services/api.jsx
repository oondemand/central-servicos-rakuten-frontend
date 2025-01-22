import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

// Função auxiliar para verificar se a requisição é para autenticação
const isAuthRequest = (url) => {
  return url.includes("/auth/login") || url.includes("/auth/registrar-usuario");
};

// Interceptador para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      if (!isAuthRequest(originalRequest.url)) {
        // Apenas realizar logout/redirecionamento se a requisição NÃO for de autenticação
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login"; // Redireciona para login
      }
      // Se for uma requisição de autenticação, não faz nada aqui
    }
    return Promise.reject(error);
  }
);

export default api;
