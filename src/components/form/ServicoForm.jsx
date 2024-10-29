// src/components/form/ServicoForm.jsx
import React, { useEffect } from "react";
import {
  VStack,
  HStack,
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FieldArray, useFormikContext } from "formik";
import FormFieldTooltip from "../common/FormFildTooltip";
import FormField from "../common/FormField";

const ServicoForm = () => {
  const { values, setFieldValue } = useFormikContext();

  const atualizarTotalLinha = (index) => {
    const servico = values.servicos[index];
    const {
      valorPrincipal,
      valorBonus,
      valorAjusteComercial,
      valorHospedagemAnuncio,
    } = servico;

    if (
      valorPrincipal !== "" &&
      valorBonus !== "" &&
      valorAjusteComercial !== "" &&
      valorHospedagemAnuncio !== ""
    ) {
      const total =
        (Number(valorPrincipal) || 0) +
        (Number(valorBonus) || 0) +
        (Number(valorAjusteComercial) || 0) +
        (Number(valorHospedagemAnuncio) || 0);

      setFieldValue(`servicos.${index}.valorTotal`, Number(total.toFixed(2)));
    }
  };

  useEffect(() => {
    values.servicos?.forEach((_, index) => {
      atualizarTotalLinha(index);
    });
  }, [values.servicos, setFieldValue]);

  return (
    <Box mt={2}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Serviços
      </Text>
      <FieldArray name="servicos">
        {({ push, remove, form }) => (
          <VStack align="stretch">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Competência</Th>
                  <Th>Valor Principal</Th>
                  <Th>Valor Bônus</Th>
                  <Th>Valor Ajuste Comercial</Th>
                  <Th>Valor Hospedagem Anúncio</Th>
                  <Th>Valor Total</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {form.values.servicos && form.values.servicos.length > 0 ? (
                  form.values.servicos.map((servico, index) => (
                    <Tr key={index}>
                      <Td>
                        {/* Competência: Mês e Ano */}
                        <HStack spacing={2}>
                          <Box width="60px">
                            <FormFieldTooltip
                              name={`servicos.${index}.mesCompetencia`}
                              type="number"
                              min={1}
                              max={12}
                              placeholder="Mês"
                            />
                          </Box>
                          <Box width="70px">
                            <FormFieldTooltip
                              name={`servicos.${index}.anoCompetencia`}
                              type="number"
                              min={2000}
                              placeholder="Ano"
                            />
                          </Box>
                        </HStack>
                      </Td>
                      <Td>
                        <FormFieldTooltip
                          name={`servicos.${index}.valorPrincipal`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormFieldTooltip
                          name={`servicos.${index}.valorBonus`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormFieldTooltip
                          name={`servicos.${index}.valorAjusteComercial`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormFieldTooltip
                          name={`servicos.${index}.valorHospedagemAnuncio`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormFieldTooltip
                          name={`servicos.${index}.valorTotal`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          isDisabled={true} // Desabilita o campo "Valor Total"
                        />
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Remover Serviço"
                          icon={<CloseIcon />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => remove(index)}
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8}>
                      <Text textAlign="center">Nenhum serviço adicionado.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Button
              colorScheme="teal"
              onClick={() =>
                push({
                  mesCompetencia: "",
                  anoCompetencia: "",
                  valorPrincipal: "",
                  valorBonus: "",
                  valorAjusteComercial: "",
                  valorHospedagemAnuncio: "",
                  valorTotal: 0, // Define o valor como número
                  correcao: false,
                  status: "ativo",
                })
              }
            >
              Adicionar Serviço
            </Button>
          </VStack>
        )}
      </FieldArray>
    </Box>
  );
};

export default ServicoForm;
