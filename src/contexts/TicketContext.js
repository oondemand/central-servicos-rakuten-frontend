import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../api/apiService";
import { useNotificacao } from "./NotificacaoContext";
import { useEmpresa } from "./EmpresaContext";

// Cria o contexto para Ticket
const TicketContext = createContext();

// Provedor do contexto de Ticket
export const TicketProvider = ({ children }) => {
  const [listaTodosTickets, setListaTodosTickets] = useState([]); // Estado para armazenar todos os tickets
  const [listaTickets, setListaTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { adicionarNotificacao } = useNotificacao();
  const { empresaSelecionada } = useEmpresa();

  // Função para normalizar strings, removendo acentos e convertendo para minúsculas
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD") // Decompor caracteres especiais (como acentos)
      .replace(/[\u0300-\u036f]/g, ""); // Remover sinais diacríticos (acentos)
  };

  // Função para filtrar tickets com base na pesquisa
  const filtrarTickets = (termo) => {
    if (!termo) {
      setListaTickets(listaTodosTickets); // Se não houver termo, mostrar todos os tickets
    } else {
      const termoNormalizado = normalizarTexto(termo);

      const ticketsFiltrados = listaTodosTickets.filter((ticket) => {
        const { prestador, tomador } = ticket.nfse.infoNfse;
        const discriminacao = ticket.nfse.infoNfse.declaracaoPrestacaoServico.servico.discriminacao;

        // Filtrar por número da NFS-e, documentos, nomes e discriminação do serviço
        return (
          ticket.nfse.infoNfse.numero.toString().includes(termoNormalizado) ||
          prestador.documento.includes(termoNormalizado) ||
          normalizarTexto(prestador.nome).includes(termoNormalizado) || // Normalização do nome do prestador
          tomador.documento.includes(termoNormalizado) ||
          normalizarTexto(tomador.nome).includes(termoNormalizado) || // Normalização do nome do tomador
          normalizarTexto(discriminacao).includes(termoNormalizado)
        );
      });

      setListaTickets(ticketsFiltrados);
    }
  };

  // Função para alterar o status do ticket
  const alterarStatusTicket = useCallback(
    async (id, novoStatus) => {
      setLoading(true);
      try {
        const response = await api.put(`/tickets/${id}/status`, { status: novoStatus });
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === id ? { ...ticket, status: novoStatus } : ticket
          )
        );
        setError(null);
        adicionarNotificacao("info", "Status do ticket atualizado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao atualizar status do ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao atualizar status do ticket.");
        adicionarNotificacao("erro", "Erro ao atualizar status do ticket.", detalhes);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Função para carregar todos os tickets
  const carregarTickets = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/tickets";
      if (empresaSelecionada) url += `?cnpjTomador=${empresaSelecionada.cnpj}`;

      const response = await api.get(url);

      setListaTodosTickets(response.data); // Armazena todos os tickets
      setListaTickets(response.data); // Inicializa listaTickets com todos os tickets
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar tickets:", err);
      const detalhes = err.response?.data?.detalhes || err.message;
      setError("Erro ao buscar tickets.");
      adicionarNotificacao("erro", "Erro ao buscar tickets.", detalhes);
    } finally {
      setLoading(false);
    }
  }, [adicionarNotificacao, empresaSelecionada]);

  // Função para adicionar um novo ticket
  const adicionarTicket = useCallback(
    async (novoTicket) => {
      setLoading(true);
      try {
        const response = await api.post("/tickets", novoTicket);
        setListaTickets((prevTickets) => [...prevTickets, response.data]);
        setError(null);
        adicionarNotificacao("info", "Ticket adicionado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao adicionar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        if (err.response && err.response.status === 400) {
          adicionarNotificacao("erro", "Erro de validação ao adicionar ticket.", detalhes);
        } else {
          setError("Erro ao adicionar ticket.");
          adicionarNotificacao("erro", "Erro ao adicionar ticket.", detalhes);
        }
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Função para editar um ticket existente
  const editarTicket = useCallback(
    async (id, ticketData) => {
      setLoading(true);
      try {
        const response = await api.put(`/tickets/${id}`, ticketData);
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === id ? response.data : ticket))
        );
        setError(null);
        adicionarNotificacao("info", "Ticket atualizado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao editar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao editar ticket.");
        adicionarNotificacao("erro", "Erro ao editar ticket.", detalhes);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Função para deletar um ticket
  const deletarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await api.delete(`/tickets/${id}`);
        setListaTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== id));
        setError(null);
        adicionarNotificacao("info", "Ticket removido com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao excluir ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao excluir ticket.");
        adicionarNotificacao("erro", "Erro ao excluir ticket.", detalhes);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Função para aprovar um ticket
  const aprovarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await api.post(`/aprovacoes/${id}/aprovar`);
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === id ? response.data : ticket))
        );
        setError(null);
        adicionarNotificacao("info", "Ticket aprovado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        const mensagem = err.response?.data?.message || "Erro ao aprovar ticket";
        const detalhes = err.response?.data?.detalhes || err.message;
        adicionarNotificacao("erro", mensagem, detalhes, false);
        setError(mensagem);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Função para recusar um ticket
  const recusarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await api.post(`/aprovacoes/${id}/recusar`);
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === id ? response.data : ticket))
        );
        setError(null);
        adicionarNotificacao("info", "Ticket recusado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao recusar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao recusar ticket.");
        adicionarNotificacao("erro", "Erro ao recusar ticket.", detalhes);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Carregar os tickets quando o componente for montado
  useEffect(() => {
    carregarTickets();
  }, [carregarTickets]);

  return (
    <TicketContext.Provider
      value={{
        listaTickets,
        loading,
        error,
        carregarTickets,
        adicionarTicket,
        editarTicket,
        deletarTicket,
        aprovarTicket,
        recusarTicket,
        alterarStatusTicket,
        filtrarTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// Hook para usar o contexto de Ticket
export const useTicket = () => useContext(TicketContext);

export default TicketContext;
