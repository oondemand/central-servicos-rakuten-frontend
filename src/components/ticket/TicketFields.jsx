// src/components/ticket/TicketFields.js
import React from "react";
import { VStack } from "@chakra-ui/react";
import FormField from "@/components/common/FormField";
import { useFormikContext } from "formik";

const TicketFields = () => {
  const formik = useFormikContext();
  return (
    <VStack spacing={1} align="stretch" bg="white" rounded="md" p={4}>
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
