// src/components/PrestadorForm.js
import React from "react";
import { VStack, HStack, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import FormField from "@/components/common/FormField";

const PrestadorForm = () => {
  const formik = useFormikContext();

  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem borderRadius="md" mb={4}>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Informações do Prestador
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} align="stretch">
              <FormField
                label="Tipo"
                name="prestador.tipo"
                type="select"
                options={[
                  { value: "pf", label: "Pessoa Física (CPF)" },
                  { value: "pj", label: "Pessoa Jurídica (CNPJ)" },
                ]}
              />
              <FormField
                label="Documento (CPF/CNPJ)"
                name="prestador.documento"
                type="text"
              />
            </HStack>
            <HStack spacing={4} align="stretch">
              <FormField
                label="Nome"
                name="prestador.nome"
                type="text"
              />
              <FormField
                label="E-mail"
                name="prestador.email"
                type="email"
              />
            </HStack>
            <HStack spacing={4} align="stretch">
              <FormField
                label="Status"
                name="prestador.status"
                type="select"
                options={[
                  { value: "ativo", label: "Ativo" },
                  { value: "em-analise", label: "Em Análise" },
                  { value: "pendente-de-revisao", label: "Pendente de Revisão" },
                  { value: "inativo", label: "Inativo" },
                  { value: "arquivado", label: "Arquivado" },
                ]}
              />
              <FormField
                label="Comentários de Revisão"
                name="prestador.comentariosRevisao"
                type="textarea"
              />
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default PrestadorForm;
