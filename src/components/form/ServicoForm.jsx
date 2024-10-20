// src/components/form/ServicoForm.jsx
import React from "react";
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
import { Field, FieldArray } from "formik";
import FormField from "@/components/common/FormField";

const ServicoForm = () => {
  return (
    <Box mt={4}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Serviços
      </Text>
      <FieldArray name="servicos">
        {({ push, remove, form }) => (
          <VStack align="stretch" spacing={4}>
            <Table variant="simple">
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
                        <HStack>
                          <Box width="50px">
                            <FormField
                              name={`servicos.${index}.mesCompetencia`}
                              type="number"
                              min={1}
                              max={12}
                              placeholder="Mês"
                            />
                          </Box>
                          <Box width="70px">
                            <FormField
                              name={`servicos.${index}.anoCompetencia`}
                              type="number"
                              min={2000}
                              placeholder="Ano"
                            />
                          </Box>
                        </HStack>
                      </Td>
                      <Td>
                        <FormField
                          name={`servicos.${index}.valorPrincipal`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormField
                          name={`servicos.${index}.valorBonus`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormField
                          name={`servicos.${index}.valorAjusteComercial`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormField
                          name={`servicos.${index}.valorHospedagemAnuncio`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </Td>
                      <Td>
                        <FormField
                          name={`servicos.${index}.valorTotal`}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
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
                    <Td colSpan={10}>
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
                  valorTotal: "",
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
