// src/components/PrestadorForm.js
import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Select,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

const PrestadorForm = ({ formik }) => {
  return (
    <Box p={8} rounded="lg" shadow="lg" width="100%" maxW="md" mb={4}>
      <VStack spacing={4} align="stretch">
        {/* Campo Tipo */}
        <FormControl isInvalid={formik.touched.tipo && formik.errors.tipo} mb={4}>
          <FormLabel htmlFor="tipo">Tipo</FormLabel>
          <Select
            id="tipo"
            name="tipo"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tipo}
          >
            <option value="pf">Pessoa Física (CPF)</option>
            <option value="pj">Pessoa Jurídica (CNPJ)</option>
          </Select>
          <FormErrorMessage>{formik.errors.tipo}</FormErrorMessage>
        </FormControl>

        {/* Campo Nome */}
        <FormControl isInvalid={formik.touched.nome && formik.errors.nome} mb={4}>
          <FormLabel htmlFor="nome">Nome</FormLabel>
          <Input
            id="nome"
            name="nome"
            type="text"
            placeholder="Digite o nome"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nome}
          />
          <FormErrorMessage>{formik.errors.nome}</FormErrorMessage>
        </FormControl>

        {/* Campo E-mail */}
        <FormControl isInvalid={formik.touched.email && formik.errors.email} mb={4}>
          <FormLabel htmlFor="email">E-mail</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Digite o e-mail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>

        {/* Campo Documento */}
        <FormControl isInvalid={formik.touched.documento && formik.errors.documento} mb={4}>
          <FormLabel htmlFor="documento">Documento (CPF/CNPJ)</FormLabel>
          <Input
            as={InputMask}
            mask={formik.values.tipo === "pf" ? "999.999.999-99" : "99.999.999/9999-99"}
            placeholder={formik.values.tipo === "pf" ? "CPF" : "CNPJ"}
            id="documento"
            name="documento"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.documento}
            height="40px"
          />
          <FormErrorMessage>{formik.errors.documento}</FormErrorMessage>
        </FormControl>
      </VStack>
    </Box>
  );
};

export default PrestadorForm;
