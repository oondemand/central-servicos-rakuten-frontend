// ContaPagar.js
import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTicket } from "../contexts/TicketContext";
import CartaoContaPagar from "./contaPagar/CartaoContaPagarOmie";

const EtapaIntegracaoOmie = () => {
  const { listaTickets } = useTicket();

  return (
    <Box bg="brand.100" p={2} rounded="md" shadow="md" minH={420}>
      <Flex justifyContent="center" alignItems="center">
        <Heading size="md" color="brand.800">
          Integração Omie
        </Heading>
      </Flex>

      {listaTickets
        .filter((ticket) => ticket.etapa === "integracao-omie")
        .map((ticket) => (
          <CartaoContaPagar key={ticket._id} ticket={ticket} />
        ))}
    </Box>
  );
};

export default EtapaIntegracaoOmie;
