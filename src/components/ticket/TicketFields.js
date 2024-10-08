import React from "react";
import { FormControl, FormLabel, Input, Textarea, Box, Flex } from "@chakra-ui/react";

const TicketFields = ({ formik }) => {
  return (
    <Flex justifyContent="space-between" width="100%">
      <Flex flex="1" flexDirection="column">
        <FormControl mb={4} isInvalid={formik.errors.titulo && formik.touched.titulo}>
          <FormLabel>Título do Ticket</FormLabel>
          <Input
            type="text"
            id="titulo"
            name="titulo"
            value={formik.values.titulo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Título do Ticket"
          />
          {formik.touched.titulo && formik.errors.titulo ? (
            <Box color="red.500" mt={1}>
              {formik.errors.titulo}
            </Box>
          ) : null}
        </FormControl>
        <FormControl mb={4} isInvalid={formik.errors.observacao && formik.touched.observacao}>
          <FormLabel>Observação</FormLabel>
          <Textarea
            id="observacao"
            name="observacao"
            value={formik.values.observacao}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            placeholder="Observação do Ticket"
          />
          {formik.touched.observacao && formik.errors.observacao ? (
            <Box color="red.500" mt={1}>
              {formik.errors.observacao}
            </Box>
          ) : null}
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default TicketFields;