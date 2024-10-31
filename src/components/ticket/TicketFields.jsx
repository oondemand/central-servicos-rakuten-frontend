// src/components/ticket/TicketFields.js
import React from "react";
import { VStack } from "@chakra-ui/react";
import FormField from "@/components/common/FormField";

const TicketFields = () => {
  return (
    <VStack spacing={0} align="stretch" bg="white" rounded="md" p={4}>
      <FormField
        label="Título do Ticket"
        name="titulo"
        type="text"
        placeholder="Título do Ticket"
        _placeholder={{ color: "rgba(0, 0, 0, 0.36)" }} 
      />
      <FormField
        name="observacao"
        type="textarea"
        placeholder="Observações"
        _placeholder={{ color: "rgba(0, 0, 0, 0.36)" }}
      />
    </VStack>
  );
};

export default TicketFields;
