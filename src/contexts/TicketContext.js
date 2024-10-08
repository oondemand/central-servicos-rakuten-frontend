import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import {
  salvarTicket as salvarTicketService,
  alterarTicket,
  aprovarTicket as aprovarTicketService,
  reprovarTicket as reprovarTicketService,
  carregarTicket,
  listarTickets,
} from "../services/TicketService";
import { useNotificacao } from "./NotificacaoContext";
import { useBaseOmie } from "./BaseOmieContext";

// Cria o contexto para Ticket
const TicketContext = createContext();

// Provedor do contexto de Ticket
export const TicketProvider = ({ children }) => {
  const [listaTodosTickets, setListaTodosTickets] = useState([]); // Estado para armazenar todos os tickets
  const [listaTickets, setListaTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { adicionarNotificacao } = useNotificacao();
  const { baseOmie } = useBaseOmie();

  // Função para normalizar strings, removendo acentos e convertendo para minúsculas
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD") // Decompor caracteres especiais (como acentos)
      .replace(/[̀-ͯ]/g, ""); // Remover sinais diacríticos (acentos)
  };

  // Função para filtrar tickets com base na pesquisa
  const filtrarTickets = (termo) => {
    if (!termo) {
      setListaTickets(listaTodosTickets); // Se não houver termo, mostrar todos os tickets
    } else {
      const termoNormalizado = normalizarTexto(termo);

      const ticketsFiltrados = listaTodosTickets.filter((ticket) => {
        const { baseOmie } = ticket.baseOmie;

        // Filtrar por número da NFS-e, documentos, nomes e discriminação do serviço
        return (
          ticket.titulo.toString().includes(termoNormalizado) ||
          ticket.observacao.toString().includes(termoNormalizado) ||
          normalizarTexto(baseOmie.nome).includes(termoNormalizado) ||
          normalizarTexto(baseOmie.documento).includes(termoNormalizado)
        );
      });

      setListaTickets(ticketsFiltrados);
    }
  };

  // Função para salvar ticket (adicionar ou editar)
  const salvarTicket = useCallback(
    async (ticket) => {
      setLoading(true);
      try {
        const response = await salvarTicketService(ticket);
        if (ticket._id) {
          setListaTickets((prevTickets) =>
            prevTickets.map((t) => (t._id === ticket._id ? response : t))
          );
          adicionarNotificacao("info", "Ticket atualizado com sucesso!", true);
        } else {
          setListaTickets((prevTickets) => [...prevTickets, response]);
          adicionarNotificacao("info", "Ticket adicionado com sucesso!", true);
        }
        setError(null);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao salvar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError(ticket._id ? "Erro ao editar ticket." : "Erro ao adicionar ticket.");
        adicionarNotificacao(
          "erro",
          ticket._id ? "Erro ao editar ticket." : "Erro ao adicionar ticket.",
          detalhes
        );
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [adicionarNotificacao]
  );

  // Função para alterar o status do ticket
  const alterarStatusTicket = useCallback(
    async (id, novoStatus) => {
      setLoading(true);
      try {
        await alterarTicket(id, { status: novoStatus });
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
      const filtro = baseOmie ? { baseOmieId: baseOmie._id } : {};
      const response = await listarTickets(filtro);

      setListaTodosTickets(response); // Armazena todos os tickets
      setListaTickets(response); // Inicializa listaTickets com todos os tickets
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar tickets:", err);
      const detalhes = err.response?.data?.detalhes || err.message;
      setError("Erro ao buscar tickets.");
      adicionarNotificacao("erro", "Erro ao buscar tickets.", detalhes);
    } finally {
      setLoading(false);
    }
  }, [baseOmie, adicionarNotificacao]);

  // Função para deletar (arquivar) um ticket
  const deletarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await alterarTicket(id, { status: "arquivado" });
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === id ? response : ticket))
        );
        setError(null);
        adicionarNotificacao("info", "Ticket arquivado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao arquivar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao arquivar ticket.");
        adicionarNotificacao("erro", "Erro ao arquivar ticket.", detalhes);
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
        const response = await aprovarTicketService(id);
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === id ? response : ticket))
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

  // Função para reprovar um ticket
  const reprovarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await reprovarTicketService(id);
        setListaTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === id ? response : ticket))
        );
        setError(null);
        adicionarNotificacao("info", "Ticket recusado com sucesso!", true);
        return true; // Indica sucesso
      } catch (err) {
        const mensagem = err.response?.data?.message || "Erro ao recusar ticket";
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

  const buscarTicketPorId = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await carregarTicket(id);
        setError(null);
        return response; // Retorna o ticket encontrado
      } catch (err) {
        console.error("Erro ao buscar ticket pelo ID:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao buscar ticket.");
        adicionarNotificacao("erro", "Erro ao buscar ticket.", detalhes);
        return null; // Retorna null se falhar
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
        salvarTicket,
        deletarTicket,
        aprovarTicket,
        reprovarTicket,
        alterarStatusTicket,
        filtrarTickets,
        buscarTicketPorId,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// Hook para usar o contexto de Ticket
export const useTicket = () => useContext(TicketContext);

export default TicketContext;
