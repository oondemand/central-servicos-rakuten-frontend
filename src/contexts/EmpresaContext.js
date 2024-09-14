import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/apiService";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
  const [listaEmpresas, setListaEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        const response = await api.get("/empresas");
        setListaEmpresas(response.data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };

    carregarEmpresas();
  }, []);

  const selecionarEmpresa = (cnpj) => {
    const empresa = listaEmpresas.find((emp) => emp.cnpj === cnpj);
    setEmpresaSelecionada(empresa);
  };

  return (
    <EmpresaContext.Provider value={{ listaEmpresas, empresaSelecionada, selecionarEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => useContext(EmpresaContext);
