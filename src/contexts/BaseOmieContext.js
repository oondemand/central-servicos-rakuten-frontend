import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/apiService";

const BaseOmieContext = createContext();

export const BaseOmieProvider = ({ children }) => {
  const [listaBases, setListaBases] = useState([]);
  const [baseSelecionada, setBaseSelecionada] = useState(null);

  useEffect(() => {
    const carregarBases = async () => {
      try {
        const response = await api.get("/baseomies");
        setListaBases(response.data);
      } catch (error) {
        console.error("Erro ao carregar Bases Omie:", error);
      }
    };

    carregarBases();
  }, []);

  const selecionarBase = (cnpj) => {
    const base = listaBases.find((emp) => emp.cnpj === cnpj);
    setBaseSelecionada(base);
  };

  return (
    <BaseOmieContext.Provider value={{ listaBases, baseSelecionada, selecionarBase }}>
      {children}
    </BaseOmieContext.Provider>
  );
};

export const useBaseOmie = () => useContext(BaseOmieContext);
