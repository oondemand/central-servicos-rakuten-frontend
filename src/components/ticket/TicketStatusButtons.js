// src/components/ticket/TicketStatusButtons.js
import React from "react";
import { FormControl, FormLabel, Button, ButtonGroup } from "@chakra-ui/react";
import { useTicket } from "../../contexts/TicketContext";

const TicketStatusButtons = ({ formik, ticket }) => {
  const { alterarStatusTicket } = useTicket();
  const handleStatusChange = (newStatus) => {
    alterarStatusTicket(ticket._id, newStatus);
    ticket.status = newStatus;
  };

  return (
    <FormControl mb={3}>
      <FormLabel>Status</FormLabel>
      <ButtonGroup spacing={4} variant="outline">
        <Button
          onClick={() => handleStatusChange("aguardando-inicio")}
          colorScheme={ticket.status === "aguardando-inicio" ? "yellow" : "gray"}
        >
          Aguardando Início
        </Button>
        <Button
          onClick={() => handleStatusChange("trabalhando")}
          colorScheme={ticket.status === "trabalhando" ? "green" : "gray"}
        >
          Trabalhando
        </Button>
        <Button
          onClick={() => handleStatusChange("revisao")}
          colorScheme={ticket.status === "revisao" ? "red" : "gray"}
        >
          Revisão
        </Button>
      </ButtonGroup>
    </FormControl>
  );
};

export default TicketStatusButtons;
