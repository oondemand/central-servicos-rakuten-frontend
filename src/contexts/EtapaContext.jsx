// src/contexts/EtapaContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import { useToast } from "@chakra-ui/react";

const EtapaContext = createContext();

export const EtapaProvider = ({ children }) => {
  const [listaEtapas, setListaEtapas] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const carregarEtapas = async () => {
      try {
        const response = await api.get("/etapas/ativas");
        setListaEtapas(response.data);
      } catch (error) {
        console.error("Erro ao carregar etapas:", error);
        toast({
          title: "Erro ao carregar etapas.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    carregarEtapas();
  }, [toast]);

  return <EtapaContext.Provider value={{ listaEtapas }}>{children}</EtapaContext.Provider>;
};

export const useEtapa = () => useContext(EtapaContext);
