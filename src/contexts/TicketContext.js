// src/contexts/TicketContext.js
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import {
  salvarTicket as salvarTicketService,
  alterarTicket,
  aprovarTicket as aprovarTicketService,
  reprovarTicket as reprovarTicketService,
  carregarTicket,
  listarTickets,
} from "../services/ticketService";
import { useBaseOmie } from "./BaseOmieContext";
import { useToast } from "@chakra-ui/react";

// Cria o contexto para Ticket
const TicketContext = createContext();

// Provedor do contexto de Ticket
export const TicketProvider = ({ children }) => {
  const [listaTodosTickets, setListaTodosTickets] = useState([]); // Estado para armazenar todos os tickets
  const [listaTickets, setListaTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { baseOmie } = useBaseOmie();
  const toast = useToast();

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
      setListaTickets(listaTodosTickets);
    } else {
      const termoNormalizado = normalizarTexto(termo);

      const ticketsFiltrados = listaTodosTickets.filter((ticket) => {
        const base = baseOmie ? baseOmie : {};
        const { nome, documento } = base;

        return (
          normalizarTexto(ticket.titulo).includes(termoNormalizado) ||
          normalizarTexto(ticket.observacao).includes(termoNormalizado) ||
          normalizarTexto(nome).includes(termoNormalizado) ||
          normalizarTexto(documento).includes(termoNormalizado)
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
        await salvarTicketService(ticket);
        if (ticket._id) {
          // setListaTickets((prevTickets) =>
          //   prevTickets.map((t) => (t._id === ticket._id ? response : t))
          // );
          toast({
            title: "Ticket atualizado com sucesso!",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else {
          // setListaTickets((prevTickets) => [...prevTickets, response]);
          toast({
            title: "Ticket adicionado com sucesso!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        await carregarTickets();
        return true;
      } catch (err) {
        console.error("Erro ao salvar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError(ticket._id ? "Erro ao editar ticket." : "Erro ao adicionar ticket.");
        toast({
          title: ticket._id ? "Erro ao editar ticket." : "Erro ao adicionar ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
        toast({
          title: "Ticket aprovado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return true; // Indica sucesso
      } catch (err) {
        const mensagem = err.response?.data?.message || "Erro ao aprovar ticket";
        const detalhes = err.response?.data?.detalhes || err.message;
        toast({
          title: mensagem,
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setError(mensagem);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
        toast({
          title: "Ticket recusado com sucesso!",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return true; // Indica sucesso
      } catch (err) {
        const mensagem = err.response?.data?.message || "Erro ao recusar ticket";
        const detalhes = err.response?.data?.detalhes || err.message;
        toast({
          title: mensagem,
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setError(mensagem);
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
        toast({
          title: "Status do ticket atualizado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao atualizar status do ticket.", err);

        toast({
          title: "Erro ao atualizar status do ticket.",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
      toast({
        title: "Erro ao buscar tickets.",
        description: detalhes,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [baseOmie, toast]);

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
        toast({
          title: "Ticket arquivado com sucesso!",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return true; // Indica sucesso
      } catch (err) {
        console.error("Erro ao arquivar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao arquivar ticket.");
        toast({
          title: "Erro ao arquivar ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false; // Indica falha
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Função para buscar ticket por ID
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
        toast({
          title: "Erro ao buscar ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return null; // Retorna null se falhar
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
