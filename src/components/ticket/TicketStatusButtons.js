// src/components/ticket/TicketStatusButtons.js
import React from "react";
import { FormControl, VStack, Button, useColorModeValue } from "@chakra-ui/react";
import { useTicket } from "../../contexts/TicketContext";

const TicketStatusButtons = ({ formik, ticket }) => {
  const { alterarStatusTicket } = useTicket();

  const handleStatusChange = async (newStatus) => {
    try {
      await alterarStatusTicket(ticket._id, newStatus);
      // Atualiza o estado local do ticket
      ticket.status = newStatus;
      // Atualizar o Formik se o status for parte do formulário
      formik.setFieldValue("status", newStatus);
    } catch (error) {
      console.error("Erro ao alterar status do ticket:", error);
      // Opcional: Adicionar feedback ao usuário, como um toast
    }
  };

  return (
    <FormControl>
      <VStack spacing={10} align="stretch" height="100%"  bg="white" rounded="md" p={4}>
        <Button
          onClick={() => handleStatusChange("aguardando-inicio")}
          bg={ticket.status === "aguardando-inicio" ? "yellow.400" : "brand.200"}
          color="brand.50"
          width="100%"
          _hover={{
            bg: ticket.status === "aguardando-inicio" ? "yellow.500" : "brand.300",
          }}
        >
          Aguardando Início
        </Button>
        <Button
          onClick={() => handleStatusChange("trabalhando")}
          bg={ticket.status === "trabalhando" ? "green.400" : "brand.200"}
          color="brand.50"
          width="100%"
          _hover={{
            bg: ticket.status === "trabalhando" ? "green.500" : "brand.300",
          }}
        >
          Trabalhando
        </Button>
        <Button
          onClick={() => handleStatusChange("revisao")}
          bg={ticket.status === "revisao" ? "red.400" : "brand.200"}
          color="brand.50"
          width="100%"
          _hover={{
            bg: ticket.status === "revisao" ? "red.500" : "brand.300",
          }}
        >
          Revisão
        </Button>
      </VStack>
    </FormControl>
  );
};

export default TicketStatusButtons;
