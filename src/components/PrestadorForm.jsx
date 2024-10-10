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
                touched={formik.touched.prestador?.tipo}
                errors={formik.errors.prestador?.tipo}
              />
              <FormField
                label="Documento (CPF/CNPJ)"
                name="prestador.documento"
                type="text"
                touched={formik.touched.prestador?.documento}
                errors={formik.errors.prestador?.documento}
                mask={
                  formik.values.prestador?.tipo === "pf" ? "999.999.999-99" : "99.999.999/9999-99"
                }
              />
            </HStack>
            <HStack spacing={4} align="stretch">
              <FormField
                label="Nome"
                name="prestador.nome"
                type="text"
                touched={formik.touched.prestador?.nome}
                errors={formik.errors.prestador?.nome}
              />
              <FormField
                label="E-mail"
                name="prestador.email"
                type="email"
                touched={formik.touched.prestador?.email}
                errors={formik.errors.prestador?.email}
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
                touched={formik.touched.prestador?.status}
                errors={formik.errors.prestador?.status}
              />
              <FormField
                label="Comentários de Revisão"
                name="prestador.comentariosRevisao"
                type="textarea"
                touched={formik.touched.prestador?.comentariosRevisao}
                errors={formik.errors.prestador?.comentariosRevisao}
              />
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default PrestadorForm;
