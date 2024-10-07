// src/components/TicketModal/PrestadorForm.js

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

const ServicoForm = ({ formik }) => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      {/* Accordion para Serviço */}
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Informações do Serviço
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Flex mb={4} gap={4} direction="column">
            {/* Descrição do Serviço */}
            <FormControl isRequired isInvalid={!!formik.errors.servico?.descricao}>
              <FormLabel>Descrição</FormLabel>
              <Input
                name="servico.descricao"
                value={formik.values.servico.descricao}
                onChange={formik.handleChange}
                placeholder="Descrição do Serviço"
              />
              {formik.errors.servico?.descricao && (
                <Box color="red.500" mt={1}>
                  {formik.errors.servico.descricao}
                </Box>
              )}
            </FormControl>

            {/* Valor do Serviço */}
            <FormControl isRequired isInvalid={!!formik.errors.servico?.valor}>
              <FormLabel>Valor</FormLabel>
              <Input
                name="servico.valor"
                type="number"
                value={formik.values.servico.valor}
                onChange={formik.handleChange}
                placeholder="Valor do Serviço"
              />
              {formik.errors.servico?.valor && (
                <Box color="red.500" mt={1}>
                  {formik.errors.servico.valor}
                </Box>
              )}
            </FormControl>

            {/* Data do Serviço */}
            <FormControl isRequired isInvalid={!!formik.errors.servico?.data}>
              <FormLabel>Data</FormLabel>
              <Input
                name="servico.data"
                type="date"
                value={formik.values.servico.data}
                onChange={formik.handleChange}
                placeholder="Data do Serviço"
              />
              {formik.errors.servico?.data && (
                <Box color="red.500" mt={1}>
                  {formik.errors.servico.data}
                </Box>
              )}
            </FormControl>

            {/* Status do Serviço */}
            <FormControl isRequired isInvalid={!!formik.errors.servico?.status}>
              <FormLabel>Status</FormLabel>
              <Select
                name="servico.status"
                placeholder="Selecione o status"
                value={formik.values.servico.status}
                onChange={formik.handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="arquivado">Arquivado</option>
              </Select>
              {formik.errors.servico?.status && (
                <Box color="red.500" mt={1}>
                  {formik.errors.servico.status}
                </Box>
              )}
            </FormControl>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ServicoForm;
