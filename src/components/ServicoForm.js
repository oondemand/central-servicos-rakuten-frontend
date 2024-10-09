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
    <Accordion allowToggle defaultIndex={[0]}>
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
            <FormControl
              isRequired
              isInvalid={!!formik.errors.servico?.valor && formik.touched.servico?.valor}
            >
              <FormLabel>Valor</FormLabel>
              <Input
                name="servico.valor"
                value={formik.values.servico.valor || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Valor do Serviço"
              />
              <FormErrorMessage>{formik.errors.servico?.valor}</FormErrorMessage>
            </FormControl>

            {/* Campo Data */}
            <FormControl
              isRequired
              isInvalid={!!formik.errors.servico?.data && formik.touched.servico?.data}
            >
              <FormLabel>Data</FormLabel>
              <Input
                type="date"
                name="servico.data"
                value={formik.values.servico.data || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Data do Serviço"
              />
              <FormErrorMessage>{formik.errors.servico?.data}</FormErrorMessage>
            </FormControl>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ServicoForm;
