// ContaPagar.js
import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useTicket } from "../contexts/TicketContext";
import CartaoContaPagar from "./contaPagar/CartaoContaPagarOmie";

const EtapaIntegracaoOmie = () => {
  const { listaTickets } = useTicket();

  return (
    <Box rounded="md" shadow="sm">
      <Heading size="md" mb={4} color="brand.800">
        Integração Omie
      </Heading>

      {listaTickets
        .filter((ticket) => ticket.etapa === "conta-pagar")
        .map((ticket) => (
          <CartaoContaPagar key={ticket._id} ticket={ticket} />
        ))}
    </Box>
  );
};

export default EtapaIntegracaoOmie;
