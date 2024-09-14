import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/apiService"; // Supondo que apiService já está configurado para fazer chamadas à API

// Criação do contexto para Etapas
const EtapaContext = createContext();

// Provedor do contexto para Etapas
export const EtapaProvider = ({ children }) => {
  const [listaEtapas, setListaEtapas] = useState([]); // Armazena a lista de etapas carregada

  // Função que carrega a lista de etapas da API
  useEffect(() => {
    const carregarEtapas = async () => {
      try {
        const response = await api.get("/etapas/ativas"); // Chama a API para carregar as etapas
        setListaEtapas(response.data); // Atualiza o estado com a lista de etapas recebida
      } catch (error) {
        console.error("Erro ao carregar etapas:", error);
      }
    };

    carregarEtapas(); // Carrega as etapas assim que o componente é montado
  }, []);

  return <EtapaContext.Provider value={{ listaEtapas }}>{children}</EtapaContext.Provider>;
};

// Hook para usar o contexto de Etapas em outros componentes
export const useEtapa = () => useContext(EtapaContext);
