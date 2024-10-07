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
import ServicoForm from "./ServicoForm";

const PrestadorForm = ({ formik }) => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      {/* Accordion para Prestador */}
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Informações do Prestador
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Flex mb={4} gap={4} direction="column">
            {/* Nome do Prestador */}
            <FormControl isRequired isInvalid={!!formik.errors.prestador?.nome}>
              <FormLabel>Nome</FormLabel>
              <Input
                name="prestador.nome"
                value={formik.values.prestador.nome}
                onChange={formik.handleChange}
                placeholder="Nome do Prestador"
              />
              {formik.errors.prestador?.nome && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.nome}
                </Box>
              )}
            </FormControl>

            {/* Tipo do Prestador */}
            <FormControl isRequired isInvalid={!!formik.errors.prestador?.tipo}>
              <FormLabel>Tipo</FormLabel>
              <Select
                name="prestador.tipo"
                placeholder="Selecione o tipo"
                value={formik.values.prestador.tipo}
                onChange={formik.handleChange}
              >
                <option value="pj">Pessoa Jurídica</option>
                <option value="pf">Pessoa Física</option>
              </Select>
              {formik.errors.prestador?.tipo && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.tipo}
                </Box>
              )}
            </FormControl>

            {/* Documento do Prestador */}
            <FormControl isRequired isInvalid={!!formik.errors.prestador?.documento}>
              <FormLabel>Documento</FormLabel>
              <Input
                as={InputMask}
                mask={
                  formik.values.prestador.tipo === "pj"
                    ? "99.999.999/9999-99"
                    : "999.999.999-99"
                }
                name="prestador.documento"
                value={formik.values.prestador.documento}
                onChange={formik.handleChange}
                placeholder={
                  formik.values.prestador.tipo === "pj" ? "CNPJ" : "CPF"
                }
              />
              {formik.errors.prestador?.documento && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.documento}
                </Box>
              )}
            </FormControl>

            {/* Email do Prestador */}
            <FormControl isRequired isInvalid={!!formik.errors.prestador?.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="prestador.email"
                type="email"
                value={formik.values.prestador.email}
                onChange={formik.handleChange}
                placeholder="Email do Prestador"
              />
              {formik.errors.prestador?.email && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.email}
                </Box>
              )}
            </FormControl>

            {/* Status do Prestador */}
            <FormControl isRequired isInvalid={!!formik.errors.prestador?.status}>
              <FormLabel>Status</FormLabel>
              <Select
                name="prestador.status"
                placeholder="Selecione o status"
                value={formik.values.prestador.status}
                onChange={formik.handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="em-analise">Em Análise</option>
                <option value="pendente-de-revisao">Pendente de Revisão</option>
                <option value="inativo">Inativo</option>
                <option value="arquivado">Arquivado</option>
              </Select>
              {formik.errors.prestador?.status && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.status}
                </Box>
              )}
            </FormControl>
          </Flex>
        </AccordionPanel>
      </AccordionItem>



      {/* Accordion para Serviço */}
    {/* <ServicoForm></ServicoForm> */}
    </Accordion>
  );
};

export default PrestadorForm;
