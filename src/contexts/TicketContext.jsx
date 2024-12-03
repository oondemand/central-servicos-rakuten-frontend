import { useToast } from "@chakra-ui/react";
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  alterarTicket,
  aprovarTicket as aprovarTicketService,
  carregarTicket,
  listarArquivosDoTicket,
  listarTickets,
  reprovarTicket as reprovarTicketService,
  salvarTicket as salvarTicketService,
} from "../services/ticketService";
import { useBaseOmie } from "./BaseOmieContext";

import { deleteFile, uploadFiles } from "../services/ticketService";

const TicketContext = createContext();

const normalizarTexto = (texto) => {
  return texto.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
};

export const TicketProvider = ({ children }) => {
  const [listaTodosTickets, setListaTodosTickets] = useState([]);
  const [listaTickets, setListaTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { baseOmie } = useBaseOmie();
  const toast = useToast();

  const salvarTicket = useCallback(
    async (ticket) => {
      setLoading(true);
      try {
        const sucesso = await salvarTicketService(ticket);
        if (ticket._id) {
          toast({
            title: "Ticket atualizado com sucesso!",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Ticket adicionado com sucesso!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        carregarTickets();
        return sucesso;
      } catch (err) {
        console.error("Erro ao salvar ticket:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError(
          ticket._id ? "Erro ao editar ticket." : "Erro ao adicionar ticket."
        );
        toast({
          title: ticket._id
            ? "Erro ao editar ticket."
            : "Erro ao adicionar ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return err.response?.data;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const aprovarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await aprovarTicketService(id);
        carregarTickets();

        toast({
          title: "Ticket aprovado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return true;
      } catch (err) {
        const mensagem =
          err.response?.data?.message || "Erro ao aprovar ticket";
        const detalhes = err.response?.data?.detalhes || err.message;
        toast({
          title: mensagem,
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setError(mensagem);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const reprovarTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await reprovarTicketService(id);
        carregarTickets();

        toast({
          title: "Ticket recusado com sucesso!",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return true;
      } catch (err) {
        const mensagem =
          err.response?.data?.message || "Erro ao recusar ticket";
        const detalhes = err.response?.data?.detalhes || err.message;
        toast({
          title: mensagem,
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setError(mensagem);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const alterarStatusTicket = useCallback(
    async (id, novoStatus) => {
      setLoading(true);
      try {
        await alterarTicket(id, { status: novoStatus });
        carregarTickets();

        toast({
          title: "Status do ticket atualizado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return true;
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

  const carregarTickets = useCallback(async () => {
    setLoading(true);
    try {
      console.log("carregarTickets");
      const filtro = baseOmie ? { baseOmieId: baseOmie._id } : {};
      console.log("Carregando tickets com filtro:", filtro);
      const response = await listarTickets(filtro);
      console.log("Tickets carregados:", response);

      setListaTodosTickets(response);
      setListaTickets(response);
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
        return true;
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
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const buscarTicketPorId = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await carregarTicket(id);
        setError(null);
        return response;
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
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const buscarArquivosDoTicket = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await listarArquivosDoTicket(id);
        setError(null);
        return response;
      } catch (err) {
        console.error("Erro ao buscar arquivos do ticket pelo ID:", err);
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao buscar arquivos.");
        toast({
          title: "Erro ao buscar arquivos do ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const uploadArquivoDoTicket = useCallback(
    async (ticketId, file) => {
      setLoading(true);
      try {
        const response = await uploadFiles(ticketId, file);
        setError(null);
        toast({
          title: "Arquivo importado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return response;
      } catch (err) {
        setError("Erro ao importar arquivo.");

        if (err.status === 413) {
          toast({
            title: "Erro ao importar arquivo",
            description: "Arquivo muito grande.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return null;
        }

        const detalhes = err.response?.data?.detalhes || err.message;
        toast({
          title: "Erro ao importar arquivo do ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const removerArquivoDoTicket = useCallback(
    async (fileId) => {
      setLoading(true);
      try {
        const response = await deleteFile(fileId);
        setError(null);
        toast({
          title: "Arquivo removido com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return response;
      } catch (err) {
        const detalhes = err.response?.data?.detalhes || err.message;
        setError("Erro ao remover arquivo.");
        toast({
          title: "Erro ao remover arquivo do ticket.",
          description: detalhes,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const buscarTickets = ({ arrayDeBusca }) => {
    console.log("Iniciando busca com:", arrayDeBusca);
    console.log("Lista de todos os tickets antes da busca:", listaTodosTickets);

    // console.log("LOG MAIS IMPORTANTE ->", arrayDeBusca, listaTodosTickets);

    const todosTicktsEncontrados2 = [];
    const ticketsJaAdicionados2 = new Set();

    for (const termoDeBusca of arrayDeBusca) {
      if (termoDeBusca.length === 0) continue;
      for (const ticket of listaTodosTickets) {
        varificarTicketExistente(normalizarTexto(termoDeBusca), ticket);
      }
    }

    function varificarTicketExistente(termoDeBuscaNormalizado, ticket) {
      if (ticketsJaAdicionados2.has(ticket._id)) return;

      const camposDeBusca = [
        ticket.titulo,
        ticket.observacao,
        ticket.prestador.nome,
        ticket.prestador.documento,
        ticket.prestador.sid,
        ticket.prestador.sciUnico,
      ];

      const camposDeBuscaTicket = camposDeBusca.some(
        (campo) =>
          campo && normalizarTexto(campo).includes(termoDeBuscaNormalizado)
      );

      if (camposDeBuscaTicket) {
        todosTicktsEncontrados2.push(ticket);
        ticketsJaAdicionados2.add(ticket._id);
        return;
      }

      for (const servico of ticket.servicos) {
        const camposDeBusca = [
          servico.mesCompetencia,
          servico.anoCompetencia,
          servico.valorTotal,
        ];

        const servicoDoTicket = camposDeBusca.some(
          (campo) =>
            campo && normalizarTexto(campo).includes(termoDeBuscaNormalizado)
        );

        if (servicoDoTicket) {
          todosTicktsEncontrados2.push(ticket);
          ticketsJaAdicionados2.add(ticket._id);
          return;
        }
      }
    }

    return todosTicktsEncontrados2;
  };

  const filtrarTickets = useCallback(
    ({ stringDeBusca }) => {
      if (loading) {
        console.log("Tickets ainda estão sendo carregados.");
        return;
      }

      if (!stringDeBusca || stringDeBusca.length <= 1) {
        setListaTickets(listaTodosTickets);
      } else {
        stringDeBusca = stringDeBusca.trimEnd().trimStart();
        const arrayDeBusca = stringDeBusca.split(";");

        console.log("listaTodosTickets", listaTodosTickets);
        const ticketsFiltrados = buscarTickets({ arrayDeBusca });

        setListaTickets(ticketsFiltrados);
      }
    },
    [listaTodosTickets, loading]
  );

  useEffect(() => {
    console.log("Log");
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
        buscarArquivosDoTicket,
        uploadArquivoDoTicket,
        removerArquivoDoTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);

export default TicketContext;
