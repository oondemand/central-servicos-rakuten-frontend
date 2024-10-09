// src/components/ServicoForm.js
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";

const ServicoForm = ({ formik }) => {
  return (
    <Accordion allowToggle>
      <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="md" mb={4}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Informações do Serviço
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack spacing={4} align="stretch">
            <FormControl
              isRequired
              isInvalid={!!formik.errors.servico?.descricao && formik.touched.servico?.descricao}
            >
              <FormLabel>Descrição</FormLabel>
              <Input
                name="servico.descricao"
                value={formik.values.servico.descricao || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Descrição do Serviço"
              />
              <FormErrorMessage>{formik.errors.servico?.descricao}</FormErrorMessage>
            </FormControl>
            {/* Adicione outros campos do formulário do serviço aqui */}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ServicoForm;
