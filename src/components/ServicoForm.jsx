// src/components/ServicoForm.js
import React from "react";
import {
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import FormField from "@/components/common/FormField";

const ServicoForm = () => {
  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem borderRadius="md" mb={4}>
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
            <HStack spacing={4} align="stretch">
              <FormField
                label="Data"
                name="servico.data"
                type="date"
              />
              <FormField
                label="Valor"
                name="servico.valor"
                type="number"
              />
            </HStack>
            <FormField
              label="Descrição"
              name="servico.descricao"
              type="textarea"
            />
            <HStack spacing={4} align="stretch">
              <FormField
                label="Status"
                name="servico.status"
                type="select"
                options={[
                  { value: "ativo", label: "Ativo" },
                  { value: "em-analise", label: "Em Análise" },
                  { value: "pendente-de-revisao", label: "Pendente de Revisão" },
                  { value: "arquivado", label: "Arquivado" },
                ]}
              />
              <FormField
                label="Comentários de Revisão"
                name="servico.comentariosRevisao"
                type="textarea"
              />
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ServicoForm;
