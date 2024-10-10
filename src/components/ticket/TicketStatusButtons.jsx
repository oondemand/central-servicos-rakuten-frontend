// src/components/ticket/TicketStatusButtons.js
import React from "react";
import { FormControl, VStack, Button } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useTicket } from "../../contexts/TicketContext";
import { useToast } from "@chakra-ui/react";

const TicketStatusButtons = ({ ticket }) => {
  const toast = useToast();
  const formik = useFormikContext();
  const { alterarStatusTicket } = useTicket();

  const handleStatusChange = async (newStatus) => {
    try {
      await alterarStatusTicket(ticket._id, newStatus);
      ticket.status = newStatus;
      formik.setFieldValue("status", newStatus);
    } catch (error) {
      console.error("Erro ao alterar status do ticket:", error);
      toast({
        title: "Erro ao alterar status do ticket",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <FormControl>
      <VStack spacing={10} align="stretch" height="100%" bg="white" rounded="md" p={4}>
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
