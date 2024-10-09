// src/components/Etapa.js
import React, { useState } from "react";
import { useTicket } from "../contexts/TicketContext";
import CartaoTicket from "./ticket/CartaoTicket";
import TicketModal from "./ticket/TicketModal"; 
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const Etapa = ({ index, etapa }) => {
  const { listaTickets, buscarTicketPorId } = useTicket();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const handleCadastrarTicket = () => {
    setIsAddModalOpen(true);
  };

  const handleEditTicket = async (ticket) => {
    setLoadingTicket(true);
    try {
      const fetchedTicket = await buscarTicketPorId(ticket._id);
      // console.log(fetchedTicket, "fetchedTicket");

      if (fetchedTicket) {
        setSelectedTicket(fetchedTicket);
      }
    } catch (error) {
      console.error("Erro ao buscar ticket:", error);
    } finally {
      setLoadingTicket(false);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <Box
      rounded="md"
      shadow="sm"
    > 
      <Flex justify="space-between" align="center">
        <Heading size="md" color="brand.800">{etapa.nome}</Heading>
        {index === 0 && (
          <IconButton
            aria-label="Adicionar Ticket"
            icon={<FaPlus />}
            onClick={handleCadastrarTicket}
          />
        )}
      </Flex>

      {listaTickets
        .filter((ticket) => ticket.etapa === etapa.codigo)
        .map((ticket) => (
          <CartaoTicket
            key={ticket._id}
            ticket={ticket}
            onClick={() => handleEditTicket(ticket)}
          />
        ))}

      {/* Modal para adicionar novo ticket */}
      {isAddModalOpen && (
        <TicketModal isOpen={isAddModalOpen} closeModal={closeModal} />
      )}

      {/* Modal para editar ticket existente */}
      {selectedTicket && (
        <TicketModal
          isOpen={Boolean(selectedTicket)}
          closeModal={closeModal}
          ticket={selectedTicket}
        />
      )}

      {/* Exibe um indicativo de carregamento se o ticket estiver sendo buscado */}
      {loadingTicket && (
        <Flex justify="center" mt={4}>
          <Spinner />
          <Text ml={2}>Carregando ticket...</Text>
        </Flex>
      )}
    </Box>
  );
};

export default Etapa;
