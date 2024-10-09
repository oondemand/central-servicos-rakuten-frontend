// src/components/ticket/TicketFields.js
import React from "react";
import { VStack } from "@chakra-ui/react";
import FormField from "../common/FormField";

const TicketFields = ({ formik }) => {
  return (
    <VStack spacing={1} align="stretch">
      <FormField
        label="Título do Ticket"
        name="titulo"
        type="text"
        touched={formik.touched.titulo}
        errors={formik.errors.titulo}
      />
      <FormField
        label="Observação"
        name="observacao"
        type="textarea"
        touched={formik.touched.observacao}
        errors={formik.errors.observacao}
      />
    </VStack>
  );
};

export default TicketFields;
