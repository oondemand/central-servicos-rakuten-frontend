import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/apiService";

const BaseOmieContext = createContext();

export const BaseOmieProvider = ({ children }) => {
  const [listaBases, setListaBases] = useState([]);
  const [baseOmie, setBaseOmie] = useState(null);

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
