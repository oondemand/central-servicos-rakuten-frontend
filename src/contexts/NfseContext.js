import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import api from "../api/apiService";

import { useEmpresa } from "./EmpresaContext";
import { useNotificacao } from "./NotificacaoContext";

const NfseContext = createContext();

export const NFSeProvider = ({ children }) => {
  const [listaTodasNfses, setListaTodasNfses] = useState([]); // Para armazenar todas as NFS-e
  const [listaNfses, setListaNfses] = useState([]); // Para exibir as NFS-e filtradas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { adicionarNotificacao } = useNotificacao();
  const { empresaSelecionada } = useEmpresa();

  // Função para carregar todas as NFS-e
  const carregarNfse = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/nfse/sem-ticket";
      if (empresaSelecionada) url += `?infoNfse.tomador.documento=${empresaSelecionada.cnpj}`;

      const response = await api.get(url);
      setListaTodasNfses(response.data); // Armazena todas as NFS-e
      setListaNfses(response.data); // Inicializa listaNfses com todos os dados
      setError(null);
    } catch (error) {
      console.error("Erro ao carregar NFS-e:", error);
      const detalhes = error.response?.data?.detalhes || error.message;
      setError("Erro ao carregar NFS-e.");
      adicionarNotificacao("erro", "Erro ao carregar NFS-e.", detalhes);
    } finally {
      setLoading(false);
    }
  }, [adicionarNotificacao, empresaSelecionada]);

  // Função para filtrar NFS-e com base na pesquisa
  const filtrarNfses = (termo) => {
    if (!termo) {
      setListaNfses(listaTodasNfses); // Se não houver termo, mostrar todas as NFS-e
    } else {
      const termoNormalizado = termo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const nfsesFiltradas = listaTodasNfses.filter((nfse) => {
        const { prestador, tomador } = nfse.infoNfse;
        const discriminacao = nfse.infoNfse.declaracaoPrestacaoServico.servico.discriminacao;

        return (
          nfse.infoNfse.numero.toString().includes(termoNormalizado) ||
          prestador.documento.includes(termoNormalizado) ||
          prestador.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(termoNormalizado) ||
          tomador.documento.includes(termoNormalizado) ||
          tomador.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(termoNormalizado) ||
          discriminacao
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(termoNormalizado)
        );
      });
      setListaNfses(nfsesFiltradas);
    }
  };

  const adicionarNfse = useCallback(
    async (nfseData) => {
      setLoading(true);
      try {
        const response = await api.post("/nfse", nfseData);
        setListaNfses((prevList) => [...prevList, response.data]);
        setError(null);
        adicionarNotificacao("info", "NFS-e adicionada com sucesso!", true);
        return true; // Indica sucesso
      } catch (error) {
        console.error("Erro ao adicionar NFS-e:", error);
        const detalhes = error.response?.data?.detalhes || error.message;
        if (error.response && error.response.status === 400) {
          adicionarNotificacao("erro", "Erro de validação ao adicionar NFS-e.", detalhes, false);
        } else {
          setError("Erro ao adicionar a NFS-e.");
          adicionarNotificacao("erro", "Erro ao adicionar a NFS-e.", detalhes, false);
        }
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  const editarNfse = useCallback(
    async (id, nfseData) => {
      setLoading(true);
      try {
        const response = await api.put(`/nfse/${id}`, nfseData);
        setListaNfses((prevList) =>
          prevList.map((nfse) => (nfse._id === id ? response.data : nfse))
        );
        setError(null);
        adicionarNotificacao("info", "NFS-e atualizada com sucesso!", true);
        return true; // Indica sucesso
      } catch (error) {
        console.error("Erro ao atualizar NFS-e:", error);
        const detalhes = error.response?.data?.detalhes || error.message;
        setError("Erro ao atualizar a NFS-e.");
        adicionarNotificacao("erro", "Erro ao atualizar a NFS-e.", detalhes);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  const removerNfse = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await api.delete(`/nfse/${id}`);
        setListaNfses((prevList) => prevList.filter((nfse) => nfse._id !== id));
        setError(null);
        adicionarNotificacao("info", "NFS-e removida com sucesso!", true);
        return true; // Indica sucesso
      } catch (error) {
        console.error("Erro ao remover NFS-e:", error);
        const detalhes = error.response?.data?.detalhes || error.message;
        setError("Erro ao remover a NFS-e.");
        adicionarNotificacao("erro", "Erro ao remover a NFS-e.", detalhes);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  const processarXml = useCallback(
    async (xmlString) => {
      setLoading(true);
      try {
        const response = await api.post("/nfse/processar-xml", { xml: xmlString });
        setError(null);
        return response.data.nfse; // Retorna os dados da NFSe processados
      } catch (error) {
        console.error("Erro ao processar XML:", error);
        const detalhes = error.response?.data?.detalhes || error.message;
        setError("Erro ao processar XML.");
        adicionarNotificacao("erro", "Erro ao processar XML.", detalhes);
        return null; // Retorna null em caso de falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  useEffect(() => {
    carregarNfse();
  }, [carregarNfse]);

  return (
    <NfseContext.Provider
      value={{
        listaNfses,
        loading,
        error,
        carregarNfse,
        adicionarNfse,
        editarNfse,
        removerNfse,
        processarXml,
        filtrarNfses,
      }}
    >
      {children}
    </NfseContext.Provider>
  );
};

export const useNFSe = () => useContext(NfseContext);
