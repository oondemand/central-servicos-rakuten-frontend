// src/contexts/BaseOmieContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import { useToast } from "@chakra-ui/react";

const BaseOmieContext = createContext();

export const BaseOmieProvider = ({ children }) => {
  const [listaBases, setListaBases] = useState([]);
  const [baseOmie, setBaseOmie] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const carregarBases = async () => {
      try {
        const response = await api.get("/baseomies");
        setListaBases(response.data);
      } catch (error) {
        console.error("Erro ao carregar Bases Omie:", error);
        toast({
          title: "Erro ao carregar Bases Omie.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    carregarBases();
  }, [toast]);

  const selecionarBase = (id) => {
    const base = listaBases.find((base) => base._id === id);
    setBaseOmie(base);
  };

  return (
    <BaseOmieContext.Provider value={{ listaBases, baseOmie, selecionarBase }}>
      {children}
    </BaseOmieContext.Provider>
  );
};

export const useBaseOmie = () => useContext(BaseOmieContext);
