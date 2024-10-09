// ContaPagar.js
import React from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { useTicket } from "../contexts/TicketContext";
import CartaoContaPagar from "./contaPagar/CartaoContaPagarOmie";

const ContaPagar = () => {
  const { listaTickets } = useTicket();

  return (
    <Box p={4} rounded="md" shadow="md" width="240px" flexShrink={0}>
      <Heading size="md" mb={4}>Contas a Pagar</Heading>
      <VStack spacing={4} align="stretch">
        {listaTickets
          .filter((ticket) => ticket.etapa === "conta-pagar")
          .map((ticket) => (
            <CartaoContaPagar key={ticket._id} ticket={ticket} />
          ))}
      </VStack>
    </Box>
  );
};

export default ContaPagar;
