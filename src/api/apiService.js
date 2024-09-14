import axios from 'axios';

// Configurar a base URL da API
const API_URL = process.env.REACT_APP_API_URL;

// Criar uma instância do Axios com configuração base
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token JWT a todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com respostas não autorizadas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Caso o token esteja inválido ou a sessão tenha expirado, redirecionar para o login
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
