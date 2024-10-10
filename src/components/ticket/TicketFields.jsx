// src/components/ticket/TicketFields.js
import React from "react";
import { VStack } from "@chakra-ui/react";
import FormField from "@/components/common/FormField";

const TicketFields = () => {
  return (
    <VStack spacing={1} align="stretch" bg="white" rounded="md" p={4}>
      <FormField label="Título do Ticket" name="titulo" type="text" />
      <FormField label="Observação" name="observacao" type="textarea" />
    </VStack>
  );
};

export default TicketFields;
