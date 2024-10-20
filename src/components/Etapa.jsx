// src/components/Etapa.js
import React, { useState } from "react";
import { useTicket } from "../contexts/TicketContext";
import CartaoTicket from "./ticket/CartaoTicket";
import TicketModal from "./ticket/TicketModal";
import { Box, Button, Flex, Heading, IconButton, Spinner, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import AcoesEtapa from "./AcoesEtapa";

const Etapa = ({ index, etapa }) => {
  const { listaTickets, buscarTicketPorId } = useTicket();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

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
    <Box bg="brand.400" p={2} rounded="md" shadow="md" minH={420}>
      <Flex justifyContent="center" alignItems="center">
        <Heading size="md" color="white">
          {etapa.nome}
        </Heading>
      </Flex>
      <AcoesEtapa etapa={etapa} setIsAddModalOpen={setIsAddModalOpen} />

      {listaTickets
        .filter((ticket) => ticket.etapa === etapa.codigo)
        .map((ticket) => (
          <CartaoTicket key={ticket._id} ticket={ticket} onClick={() => handleEditTicket(ticket)} />
        ))}

      {/* Modal para adicionar novo ticket */}
      {isAddModalOpen && <TicketModal isOpen={isAddModalOpen} closeModal={closeModal} />}

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
