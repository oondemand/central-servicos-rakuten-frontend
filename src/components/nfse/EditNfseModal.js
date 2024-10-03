import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Box,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSpinner } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import { useNFSe } from "../../contexts/NfseContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";

const EditNfseModal = ({ nfse, isOpen, onClose }) => {
  const toast = useToast();
  const { listaBases, baseSelecionada } = useBaseOmie();
  const { adicionarNfse, editarNfse } = useNFSe();
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState(nfse?.infoNfse.prestador.tipo || "pf");
  
  const { colorMode, toggleColorMode } = useColorMode();

  // Força o modo escuro quando o modal é aberto
  useEffect(() => {
    if (isOpen && colorMode !== "dark") {
      toggleColorMode();
    }
  }, [isOpen, colorMode, toggleColorMode]);

  const validationSchema = Yup.object().shape({
    numero: Yup.string().required("Número é obrigatório"),
    dataEmissao: Yup.date().required("Data de Emissão é obrigatória"),
    competencia: Yup.string().required("Competência é obrigatória"),
    optanteSimplesNacional: Yup.number()
      .required("Optante pelo Simples Nacional é obrigatório")
      .nullable(),
    discriminacao: Yup.string()
      .max(500, "Máximo de 500 caracteres")
      .required("Discriminação é obrigatória"),
    valorServicos: Yup.number()
      .required("Valor dos Serviços é obrigatório")
      .min(0, "O valor deve ser maior que zero"),
    issRetido: Yup.string().required("ISS Retido é obrigatório"),
    aliquota: Yup.number()
      .required("Alíquota é obrigatória")
      .min(0, "A alíquota deve ser maior que zero"),
    valorIss: Yup.number()
      .required("Valor ISS é obrigatório")
      .min(0, "O valor deve ser maior que zero"),
    documentoPrestador: Yup.string().required("Documento é obrigatório"),
    nomePrestador: Yup.string().required("Nome/Razão Social é obrigatório"),
    documentoTomador: Yup.string().required("Documento do Tomador é obrigatório"),
    nomeTomador: Yup.string().required("Nome do Tomador é obrigatório"),
  });
  console.log("Loading state before operation:", loading);

  const handleSubmit = async (values, actions) => {
    setLoading(true);

    const nfseData = {
      infoNfse: {
        numero: values.numero,
        dataEmissao: values.dataEmissao,
        prestador: {
          tipo: values.tipoPrestador,
          documento: values.documentoPrestador.replace(/[./-]/g, ""),
          nome: values.nomePrestador,
        },
        tomador: {
          tipo: values.tipoTomador,
          documento: values.documentoTomador.replace(/[./-]/g, ""),
          nome: values.nomeTomador,
        },
        declaracaoPrestacaoServico: {
          competencia: values.competencia,
          servico: {
            valores: {
              aliquota: values.aliquota,
              valorIss: values.valorIss,
              valorServicos: values.valorServicos,
            },
            issRetido: values.issRetido,
            discriminacao: values.discriminacao,
          },
          optanteSimplesNacional: values.optanteSimplesNacional,
        },
      },
    };

    try {
      let sucesso;
      if (nfse && nfse._id) {
        sucesso = await editarNfse(nfse._id, nfseData);
      } else {
        sucesso = await adicionarNfse(nfseData);
      }

      if (sucesso) {
        toast({
          title: "NFSe salva com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Erro ao salvar NFSe.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  const initialValues = {
    numero: nfse?.infoNfse.numero || "",
    dataEmissao: nfse?.infoNfse.dataEmissao
      ? new Date(nfse.infoNfse.dataEmissao).toISOString().split("T")[0]
      : "",
    competencia:
      nfse?.infoNfse.declaracaoPrestacaoServico.competencia || "",
    optanteSimplesNacional:
      nfse?.infoNfse.declaracaoPrestacaoServico.optanteSimplesNacional || "",
    discriminacao:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.discriminacao || "",
    valorServicos:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.valores
        .valorServicos || "",
    issRetido:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.issRetido || "",
    aliquota:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.valores.aliquota || "",
    valorIss:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.valores.valorIss || "",
    tipoPrestador: nfse?.infoNfse.prestador.tipo || "pf",
    documentoPrestador: nfse?.infoNfse.prestador.documento || "",
    nomePrestador: nfse?.infoNfse.prestador.nome || "",
    tipoTomador: nfse?.infoNfse.tomador.tipo || "pf",
    documentoTomador: nfse?.infoNfse.tomador.documento || "",
    nomeTomador: nfse?.infoNfse.tomador.nome || "",
  };

  // Definindo cores com base no modo de cor atual
  const accordionBg = useColorModeValue("gray.100", "gray.700");
  const accordionHoverBg = useColorModeValue("gray.200", "gray.600");
  const accordionBorderColor = useColorModeValue("gray.300", "gray.600");
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("white", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader>Editar NFSe</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form style={{ height: '720px', overflowY: 'scroll', overflowX: 'hidden' }}>
              <ModalBody>
                {/* Accordions */}
                <Accordion defaultIndex={[0]} allowMultiple>
                  {/* Tomador */}
                  <AccordionItem border="1px solid" borderColor={accordionBorderColor} borderRadius="md" mb={4}>
                    <h2>
                      <AccordionButton _expanded={{ bg: accordionHoverBg, color: "white" }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Tomador
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bg={accordionBg}>
                      <Flex mb={4} gap={4}>
                        <FormControl>
                          <FormLabel>Selecione a Empresa</FormLabel>
                          <Select
                            name="documentoTomador"
                            placeholder="Selecione uma empresa"
                            value={values.documentoTomador}
                            onChange={(e) => {
                              const cnpjSelecionado = e.target.value;
                              const empresa = listaBases.find(
                                (emp) => emp.cnpj === cnpjSelecionado
                              );
                              if (empresa) {
                                setFieldValue("documentoTomador", empresa.cnpj);
                                setFieldValue("nomeTomador", empresa.nome);
                              } else {
                                setFieldValue("documentoTomador", "");
                                setFieldValue("nomeTomador", "");
                              }
                            }}
                            isDisabled={!!baseSelecionada}
                            bg={inputBg}
                          >
                            {listaBases.map((empresa) => (
                              <option key={empresa.cnpj} value={empresa.cnpj}>
                                {empresa.nome}
                              </option>
                            ))}
                          </Select>
                          <ErrorMessage
                            name="documentoTomador"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>CNPJ do Tomador</FormLabel>
                          <Field name="documentoTomador">
                            {({ field }) => (
                              <Input
                                as={InputMask}
                                mask="99.999.999/9999-99"
                                {...field}
                                placeholder="CNPJ"
                                isDisabled={!!baseSelecionada}
                                bg={inputBg}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="documentoTomador"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* Prestador */}
                  <AccordionItem border="1px solid" borderColor={accordionBorderColor} borderRadius="md" mb={4}>
                    <h2>
                      <AccordionButton _expanded={{ bg: accordionHoverBg, color: "white" }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Prestador
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bg={accordionBg}>
                      <Flex mb={4} gap={4}>
                        <FormControl>
                          <FormLabel>Tipo</FormLabel>
                          <Select
                            name="tipoPrestador"
                            value={values.tipoPrestador}
                            onChange={(e) => {
                              setTipo(e.target.value);
                              setFieldValue("tipoPrestador", e.target.value);
                            }}
                            bg={inputBg}
                          >
                            <option value="pf">Pessoa Física</option>
                            <option value="pj">Pessoa Jurídica</option>
                          </Select>
                          <ErrorMessage
                            name="tipoPrestador"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Documento (CPF/CNPJ)</FormLabel>
                          <Field name="documentoPrestador">
                            {({ field }) => (
                              <Input
                                as={InputMask}
                                mask={
                                  tipo === "pf"
                                    ? "999.999.999-99"
                                    : "99.999.999/9999-99"
                                }
                                placeholder={
                                  tipo === "pf" ? "CPF" : "CNPJ"
                                }
                                {...field}
                                bg={inputBg}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="documentoPrestador"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Nome/Razão Social</FormLabel>
                          <Input
                            name="nomePrestador"
                            placeholder={
                              tipo === "pf" ? "Nome Completo" : "Razão Social"
                            }
                            value={values.nomePrestador}
                            onChange={(e) =>
                              setFieldValue("nomePrestador", e.target.value)
                            }
                            bg={inputBg}
                          />
                          <ErrorMessage
                            name="nomePrestador"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* Informações da NFSe */}
                  <AccordionItem border="1px solid" borderColor={accordionBorderColor} borderRadius="md" mb={4}>
                    <h2>
                      <AccordionButton _expanded={{ bg: accordionHoverBg, color: "white" }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Informações da NFSe
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bg={accordionBg}>
                      <Flex mb={4} gap={4}>
                        <FormControl>
                          <FormLabel>Número</FormLabel>
                          <Input
                            type="number"
                            name="numero"
                            value={values.numero}
                            onChange={(e) =>
                              setFieldValue("numero", e.target.value)
                            }
                            bg={inputBg}
                          />
                          <ErrorMessage
                            name="numero"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Data de Emissão</FormLabel>
                          <Input
                            type="date"
                            name="dataEmissao"
                            value={values.dataEmissao}
                            onChange={(e) =>
                              setFieldValue("dataEmissao", e.target.value)
                            }
                            bg={inputBg}
                          />
                          <ErrorMessage
                            name="dataEmissao"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>
                      </Flex>

                      <Flex mb={4} gap={4}>
                        <FormControl>
                          <FormLabel>Competência</FormLabel>
                          <Field name="competencia">
                            {({ field }) => (
                              <Input
                                as={InputMask}
                                mask="99/9999"
                                placeholder="MM/YYYY"
                                {...field}
                                bg={inputBg}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="competencia"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Optante pelo Simples Nacional</FormLabel>
                          <Select
                            name="optanteSimplesNacional"
                            value={values.optanteSimplesNacional}
                            onChange={(e) =>
                              setFieldValue(
                                "optanteSimplesNacional",
                                e.target.value
                              )
                            }
                            bg={inputBg}
                          >
                            <option value="">Selecione</option>
                            <option value="1">Sim</option>
                            <option value="0">Não</option>
                          </Select>
                          <ErrorMessage
                            name="optanteSimplesNacional"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* Serviço */}
                  <AccordionItem border="1px solid" borderColor={accordionBorderColor} borderRadius="md" mb={4}>
                    <h2>
                      <AccordionButton _expanded={{ bg: accordionHoverBg, color: "white" }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Serviço
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bg={accordionBg}>
                      <FormControl mb={4}>
                        <FormLabel>Discriminação</FormLabel>
                        <Textarea
                          name="discriminacao"
                          maxLength={500}
                          value={values.discriminacao}
                          onChange={(e) =>
                            setFieldValue("discriminacao", e.target.value)
                          }
                          bg={inputBg}
                        />
                        <ErrorMessage
                          name="discriminacao"
                          component="div"
                          style={{ color: "red", marginTop: "0.5rem" }}
                        />
                      </FormControl>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* Valores */}
                  <AccordionItem border="1px solid" borderColor={accordionBorderColor} borderRadius="md" mb={4}>
                    <h2>
                      <AccordionButton _expanded={{ bg: accordionHoverBg, color: "white" }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          Valores
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} bg={accordionBg}>
                      <Flex mb={4} gap={4}>
                        <FormControl>
                          <FormLabel>Valor dos Serviços</FormLabel>
                          <Input
                            type="number"
                            name="valorServicos"
                            value={values.valorServicos}
                            onChange={(e) =>
                              setFieldValue("valorServicos", e.target.value)
                            }
                            bg={inputBg}
                          />
                          <ErrorMessage
                            name="valorServicos"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>ISS Retido</FormLabel>
                          <Select
                            name="issRetido"
                            value={values.issRetido}
                            onChange={(e) =>
                              setFieldValue("issRetido", e.target.value)
                            }
                            bg={inputBg}
                          >
                            <option value="">Selecione</option>
                            <option value="1">Sim</option>
                            <option value="0">Não</option>
                          </Select>
                          <ErrorMessage
                            name="issRetido"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Alíquota</FormLabel>
                          <Input
                            type="number"
                            name="aliquota"
                            value={values.aliquota}
                            onChange={(e) =>
                              setFieldValue("aliquota", e.target.value)
                            }
                            bg={inputBg}
                          />
                          <ErrorMessage
                            name="aliquota"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Valor ISS</FormLabel>
                          <Input
                            type="number"
                            name="valorIss"
                            value={values.valorIss}
                            onChange={(e) =>
                              setFieldValue("valorIss", e.target.value)
                            }
                            bg={inputBg}
                          />
                          <ErrorMessage
                            name="valorIss"
                            component="div"
                            style={{ color: "red", marginTop: "0.5rem" }}
                          />
                        </FormControl>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </ModalBody>

              <ModalFooter>
                <Flex gap={4}>
                  <Button onClick={onClose} colorScheme="gray">
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={loading}
                    leftIcon={
                      loading ? (
                        <Spinner size="sm" />
                      ) : (
                      <></>
                      )
                    }
                  >
                    Salvar
                  </Button>
                </Flex>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default EditNfseModal;
