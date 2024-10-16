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
  Checkbox,
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
            {/* Prestador e Competência */}
            <HStack spacing={4} align="stretch">
              {/* <FormField
                label="Prestador"
                name="servico.prestador"
                type="select"
                options={prestadores.map((prestador) => ({
                  value: prestador._id,
                  label: prestador.nome,
                }))}
                placeholder="Selecione um prestador"
              /> */}
              <FormField
                label="Mês Competência"
                name="servico.mesCompetencia"
                type="number"
                min={1}
                max={12}
                placeholder="Selecione o mês"
              />
              <FormField
                label="Ano Competência"
                name="servico.anoCompetencia"
                type="number"
                min={2000}
                placeholder="Ano"
              />
            </HStack>

            {/* Valores */}
            <VStack spacing={4} align="stretch">
              <HStack>
                <FormField
                  label="Valor Principal"
                  name="servico.valorPrincipal"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
                <FormField
                  label="Valor Bônus"
                  name="servico.valorBonus"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
                <FormField
                  label="Valor Ajuste Comercial"
                  name="servico.valorAjusteComercial"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
                <FormField
                  label="Valor Hospedagem Anúncio"
                  name="servico.valorHospedagemAnuncio"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
                <FormField
                  label="Valor Total"
                  name="servico.valorTotal"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
              </HStack>
            </VStack>

            {/* Correção e Status */}
            <HStack spacing={4} align="center">
              <Checkbox name="servico.correcao">Correção</Checkbox>
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
                placeholder="Selecione o status"
              />
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ServicoForm;
