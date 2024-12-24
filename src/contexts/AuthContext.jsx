// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // console.log("Inicializando autenticação...");
        const token = localStorage.getItem("token");
        const usuarioData = localStorage.getItem("usuario");

        if (token && usuarioData) {
          // Configura o token no Axios
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Opcional: Validar o token com o backend
          const response = await api.get("/auth/validar-token");
          setUsuario(response.data);

          // const parsedUsuario = JSON.parse(usuarioData);
          // setUsuario(parsedUsuario);
          // console.log("Usuário autenticado:", parsedUsuario);
        }
      } catch (error) {
        console.error("Erro ao inicializar a autenticação:", error);
        toast({
          title: "Erro ao inicializar a autenticação.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        logout(); // Chama a função de logout em caso de erro
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

  const login = async (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    toast({
      title: "Login realizado com sucesso!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    delete api.defaults.headers.common["Authorization"];
    toast({
      title: "Logout realizado com sucesso!",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <AuthContext.Provider value={{ login, logout, usuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
