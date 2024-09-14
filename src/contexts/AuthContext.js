import React, { createContext, useContext, useState, useEffect } from 'react';
import { validarToken } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log("Iniciando verificação do token...");
        const token = localStorage.getItem('token');
        if (token) {
            // console.log("Token encontrado, validando...");
            validarToken(token)
                .then((userData) => {
                    // console.log("Token válido, configurando usuário:", userData);
                    setUser({ ...userData, token });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Erro na validação do token:", error);
                    logout();
                    setLoading(false);
                });
        } else {
            // console.log("Nenhum token encontrado.");
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        // console.log("Realizando login:", userData);
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        // console.log("Realizando logout.");
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
