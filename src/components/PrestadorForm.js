// src/components/PrestadorForm.js

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
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

const PrestadorForm = ({ formik, accordionStyles }) => {
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
            Informações do Prestador
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} bg={accordionBg}>
        <Flex mb={4} gap={4} direction="column">
          {/* Nome e Tipo do Prestador */}
          <Flex gap={4}>
            {/* Nome do Prestador */}
            <FormControl
              isRequired
              isInvalid={!!formik.errors.prestador?.nome && formik.touched.prestador?.nome}
              flex="1"
            >
              <FormLabel>Nome</FormLabel>
              <Input
                name="prestador.nome"
                value={formik.values.prestador.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nome do Prestador"
                bg={inputBg}
              />
              {formik.errors.prestador?.nome && formik.touched.prestador?.nome && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.nome}
                </Box>
              )}
            </FormControl>

            {/* Tipo do Prestador */}
            <FormControl
              isRequired
              isInvalid={!!formik.errors.prestador?.tipo && formik.touched.prestador?.tipo}
              flex="1"
            >
              <FormLabel>Tipo</FormLabel>
              <Select
                name="prestador.tipo"
                placeholder="Selecione o tipo"
                value={formik.values.prestador.tipo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                bg={inputBg}
              >
                <option value="pj">Pessoa Jurídica</option>
                <option value="pf">Pessoa Física</option>
              </Select>
              {formik.errors.prestador?.tipo && formik.touched.prestador?.tipo && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.tipo}
                </Box>
              )}
            </FormControl>
          </Flex>

          {/* Documento e Email do Prestador */}
          <Flex gap={4}>
            {/* Documento do Prestador */}
            <FormControl
              isRequired
              isInvalid={
                !!formik.errors.prestador?.documento && formik.touched.prestador?.documento
              }
              flex="1"
            >
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
                onBlur={formik.handleBlur}
                placeholder={
                  formik.values.prestador.tipo === "pj" ? "CNPJ" : "CPF"
                }
                bg={inputBg}
              />
              {formik.errors.prestador?.documento && formik.touched.prestador?.documento && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.documento}
                </Box>
              )}
            </FormControl>

            {/* Email do Prestador */}
            <FormControl
              isRequired
              isInvalid={!!formik.errors.prestador?.email && formik.touched.prestador?.email}
              flex="1"
            >
              <FormLabel>Email</FormLabel>
              <Input
                name="prestador.email"
                type="email"
                value={formik.values.prestador.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email do Prestador"
                bg={inputBg}
              />
              {formik.errors.prestador?.email && formik.touched.prestador?.email && (
                <Box color="red.500" mt={1}>
                  {formik.errors.prestador.email}
                </Box>
              )}
            </FormControl>
          </Flex>

          {/* Status do Prestador */}
          <FormControl
            isRequired
            isInvalid={!!formik.errors.prestador?.status && formik.touched.prestador?.status}
          >
            <FormLabel>Status</FormLabel>
            <Select
              name="prestador.status"
              placeholder="Selecione o status"
              value={formik.values.prestador.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              bg={inputBg}
            >
              <option value="ativo">Ativo</option>
              <option value="em-analise">Em Análise</option>
              <option value="pendente-de-revisao">Pendente de Revisão</option>
              <option value="inativo">Inativo</option>
              <option value="arquivado">Arquivado</option>
            </Select>
            {formik.errors.prestador?.status && formik.touched.prestador?.status && (
              <Box color="red.500" mt={1}>
                {formik.errors.prestador.status}
              </Box>
            )}
          </FormControl>

          {/* Comentários de Revisão */}
          <FormControl>
            <FormLabel>Comentários de Revisão</FormLabel>
            <Textarea
              name="prestador.comentariosRevisao"
              value={formik.values.prestador.comentariosRevisao}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Comentários de Revisão"
              bg={inputBg}
            />
          </FormControl>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default PrestadorForm;
