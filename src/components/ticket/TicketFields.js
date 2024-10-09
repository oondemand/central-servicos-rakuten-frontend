// src/components/ticket/TicketFields.js
import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";

const TicketFields = ({ formik }) => {
  return (
    <Flex justifyContent="space-between" width="100%">
      <Flex flex="1" flexDirection="column">
        <FormControl isInvalid={formik.errors.titulo && formik.touched.titulo} mb={4}>
          <FormLabel htmlFor="titulo">Título do Ticket</FormLabel>
          <Input
            type="text"
            id="titulo"
            name="titulo"
            value={formik.values.titulo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Título do Ticket"
          />
          {formik.touched.titulo && formik.errors.titulo && (
            <FormErrorMessage>{formik.errors.titulo}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={formik.errors.observacao && formik.touched.observacao} mb={4}>
          <FormLabel htmlFor="observacao">Observação</FormLabel>
          <Textarea
            id="observacao"
            name="observacao"
            value={formik.values.observacao}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            placeholder="Observação do Ticket"
          />
          {formik.touched.observacao && formik.errors.observacao && (
            <FormErrorMessage>{formik.errors.observacao}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default TicketFields;
