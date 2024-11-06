// src/components/form/ServicoForm.jsx
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
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

const ServicoForm = ({ setValeuArrayService, onSomaTotalChange }) => {
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const { values, setFieldValue } = useFormikContext();

  const atualizarTotalLinha = (index) => {
    const servico = values.servicos[index];
    const {
      valorPrincipal,
      valorBonus,
      valorAjusteComercial,
      valorHospedagemAnuncio,
    } = servico;

    const total =
      (parseFloat(valorPrincipal) || 0) +
      (parseFloat(valorBonus) || 0) +
      (parseFloat(valorAjusteComercial) || 0) +
      (parseFloat(valorHospedagemAnuncio) || 0);

    setFieldValue(`servicos.${index}.valorTotal`, total.toFixed(2));
  };

  const calcularSomaTotal = () => {
    const somaTotal = values.servicos.reduce(
      (soma, servico) => soma + (parseFloat(servico.valorTotal) || 0),
      0
    );
    onSomaTotalChange(somaTotal); 
    return somaTotal;
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
                      {/* Competência Mês e Ano */}
                      <Td>
                        <HStack spacing={2}>
                          <Box width="60px">
                            <FormFieldTooltip
                              name={`servicos.${index}.mesCompetencia`}
                              type="number"
                              min={1}
                              max={12}
                              placeholder="Mês"
                              setShowErrorTooltip={setShowErrorTooltip}
                              showErrorTooltip={showErrorTooltip}
                            />
                          </Box>
                          <Box width="70px">
                            <FormFieldTooltip
                              name={`servicos.${index}.anoCompetencia`}
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder="Ano"
                              setShowErrorTooltip={setShowErrorTooltip}
                              showErrorTooltip={showErrorTooltip}
                              onChange={(e) => {
                                const ano = e.target.value.replace(/\D/g, "");
                                setFieldValue(
                                  `servicos.${index}.anoCompetencia`,
                                  ano.slice(0, 4)
                                );
                              }}
                            />
                          </Box>
                        </HStack>
                      </Td>
                      {/* Campos de Valor com Cor Condicional */}
                      <Td>
                        <NumericFormat
                          name={`servicos.${index}.valorPrincipal`}
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative
                          prefix="R$ "
                          placeholder="R$ 0,00"
                          customInput={FormFieldTooltip}
                          onValueChange={(values) => {
                            setFieldValue(
                              `servicos.${index}.valorPrincipal`,
                              values.floatValue
                            );
                            atualizarTotalLinha(index);
                          }}
                          style={{
                            color:
                              form.values.servicos[index].valorPrincipal < 0
                                ? "red"
                                : "inherit",
                          }}
                        />
                      </Td>
                      <Td>
                        <NumericFormat
                          name={`servicos.${index}.valorBonus`}
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative
                          prefix="R$ "
                          placeholder="R$ 0,00"
                          customInput={FormFieldTooltip}
                          onValueChange={(values) => {
                            setFieldValue(
                              `servicos.${index}.valorBonus`,
                              values.floatValue
                            );
                            atualizarTotalLinha(index);
                          }}
                          style={{
                            color:
                              form.values.servicos[index].valorBonus < 0
                                ? "red"
                                : "inherit",
                          }}
                        />
                      </Td>
                      <Td>
                        <NumericFormat
                          name={`servicos.${index}.valorAjusteComercial`}
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative
                          prefix="R$ "
                          placeholder="R$ 0,00"
                          customInput={FormFieldTooltip}
                          onValueChange={(values) => {
                            setFieldValue(
                              `servicos.${index}.valorAjusteComercial`,
                              values.floatValue
                            );
                            atualizarTotalLinha(index);
                          }}
                          style={{
                            color:
                              form.values.servicos[index].valorAjusteComercial <
                              0
                                ? "red"
                                : "inherit",
                          }}
                        />
                      </Td>
                      <Td>
                        <NumericFormat
                          name={`servicos.${index}.valorHospedagemAnuncio`}
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative
                          prefix="R$ "
                          placeholder="R$ 0,00"
                          customInput={FormFieldTooltip}
                          onValueChange={(values) => {
                            setFieldValue(
                              `servicos.${index}.valorHospedagemAnuncio`,
                              values.floatValue
                            );
                            atualizarTotalLinha(index);
                          }}
                          style={{
                            color:
                              form.values.servicos[index]
                                .valorHospedagemAnuncio < 0
                                ? "red"
                                : "inherit",
                          }}
                        />
                      </Td>
                      <Td>
                        <NumericFormat
                          value={form.values.servicos[index].valorTotal}
                          displayType="text"
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          decimalScale={2}
                          fixedDecimalScale
                          customInput={FormFieldTooltip}
                          placeholder="R$ 0,00"
                          isReadOnly
                          style={{
                            color:
                              form.values.servicos[index].valorTotal < 0
                                ? "red"
                                : "inherit",
                          }}
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

                {form.values.servicos.length > 0 && (
                  <Tr>
                    <Td colSpan={5} textAlign="right" fontWeight="bold">
                      Soma Total:
                    </Td>
                    <Td fontWeight="bold">
                      <Box whiteSpace="nowrap">
                        <NumericFormat
                          value={calcularSomaTotal()}
                          displayType="text"
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          decimalScale={2}
                          fixedDecimalScale
                          style={{
                            fontWeight: "bold",
                            fontSize: "1rem",
                            color: calcularSomaTotal() < 0 ? "red" : "inherit",
                          }}
                        />
                      </Box>
                    </Td>
                    <Td></Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Button
              colorScheme="teal"
              onClick={() => {
                push({
                  mesCompetencia: "",
                  anoCompetencia: "",
                  valorPrincipal: "",
                  valorBonus: "",
                  valorAjusteComercial: "",
                  valorHospedagemAnuncio: "",
                  valorTotal: 0,
                  correcao: false,
                  status: "ativo",
                }),
                  setValeuArrayService(true);
              }}
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
