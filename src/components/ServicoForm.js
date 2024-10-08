// src/components/ServicoForm.js

import React from "react";
import {
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
  useColorModeValue,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

const ServicoForm = ({ formik, accordionStyles }) => {
  const { accordionBg, accordionHoverBg, accordionBorderColor, inputBg } =
    accordionStyles;

  return (
    <AccordionItem
      border="1px solid"
      borderColor={accordionBorderColor}
      borderRadius="md"
      mb={4}
    >
      <h2>
        <AccordionButton
          _expanded={{
            bg: accordionHoverBg,
            color: "white",
          }}
        >
          <Box flex="1" textAlign="left" fontWeight="bold">
            Informações do Serviço
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} bg={accordionBg}>
        <Flex mb={4} gap={4} direction="column">
          {/* Descrição do Serviço */}
          <FormControl
            isRequired
            isInvalid={!!formik.errors.servico?.descricao}
          >
            <FormLabel>Descrição</FormLabel>
            <Input
              name="servico.descricao"
              value={formik.values.servico.descricao}
              onChange={formik.handleChange}
              placeholder="Descrição do Serviço"
              bg={inputBg}
            />
            {formik.errors.servico?.descricao && (
              <Box color="red.500" mt={1}>
                {formik.errors.servico.descricao}
              </Box>
            )}
          </FormControl>

          <Flex gap={4}>
            {/* Valor do Serviço */}
            <FormControl
              isRequired
              isInvalid={!!formik.errors.servico?.valor}
              flex="1"
            >
              <FormLabel>Valor</FormLabel>
              <Input
                name="servico.valor"
                type="number"
                value={formik.values.servico.valor}
                onChange={formik.handleChange}
                placeholder="Valor do Serviço"
                bg={inputBg}
              />
              {formik.errors.servico?.valor && (
                <Box color="red.500" mt={1}>
                  {formik.errors.servico.valor}
                </Box>
              )}
            </FormControl>

            {/* Data do Serviço */}
            <FormControl
              isRequired
              isInvalid={!!formik.errors.servico?.data}
              flex="1"
            >
              <FormLabel>Data</FormLabel>
              <Input
                name="servico.data"
                type="date"
                value={formik.values.servico.data}
                onChange={formik.handleChange}
                placeholder="Data do Serviço"
                bg={inputBg}
              />
              {formik.errors.servico?.data && (
                <Box color="red.500" mt={1}>
                  {formik.errors.servico.data}
                </Box>
              )}
            </FormControl>
          </Flex>

          {/* Status do Serviço */}
          <FormControl
            isRequired
            isInvalid={!!formik.errors.servico?.status}
          >
            <FormLabel>Status</FormLabel>
            <Select
              name="servico.status"
              placeholder="Selecione o status"
              value={formik.values.servico.status}
              onChange={formik.handleChange}
              bg={inputBg}
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
  );
};

export default ServicoForm;
