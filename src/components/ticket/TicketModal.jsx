// src/components/ticket/TicketModal.js
import React, { useMemo, useState, useRef } from "react";
import _ from "lodash";
import { motion } from "framer-motion";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  HStack,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";
import { useTicket } from "../../contexts/TicketContext";
import { prestadorInitValues } from "../../initValues/prestadorInitValues";
import { servicoInitValues } from "../../initValues/servicoInitValues";
import { salvarPrestador } from "../../services/prestadorService";
import { salvarServico } from "../../services/servicoService";
import { prestadorValidationSchema } from "../../validation/prestadorValidationSchema";
import { servicoValidationSchema } from "../../validation/servicoValidationSchema";
import { ticketValidationSchema } from "../../validation/ticketValidationSchema";
import PrestadorForm from "../form/PrestadorForm";
import ServicoForm from "../form/ServicoForm";
import TicketActions from "./TicketActions";
import TicketFields from "./TicketFields";
import TicketStatusButtons from "./TicketStatusButtons";

import { FilesViewComponent } from "./FilesViewComponent";
import { ImportFilesComponent } from "./ImportFilesComponent";

const MotionModalContent = motion(ModalContent);

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const { salvarTicket } = useTicket();
  const { baseOmie } = useBaseOmie();
  const { listaEtapas } = useEtapa();

  const toast = useToast();

  // Estados para controlar a exibição dos formulários
  const [mostrarPrestador, setMostrarPrestador] = useState(
    ticket?.prestador ? true : true
  );
  const [mostrarServico, setMostrarServico] = useState(
    ticket?.servicos.length > 0 ? true : false
  );

  // Estados para controlar os diálogos de confirmação
  const [confirmacao, setConfirmacao] = useState({
    fecharModal: false,
    removerPrestador: false,
    removerServico: false,
  });
  const [cnpjValido, setCnpjValido] = useState(null);
  const [cpfValido, setCpfValido] = useState(null);
  const [formHasErrors, setFormHasErrors] = useState(false);
  const [valeuArrayService, setValeuArrayService] = useState(false);
  const [displayNome, setDisplayNome] = useState("");
  const [displaySid, setDisplaySid] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [somaTotalServicos, setSomaTotalServicos] = useState(0);

  // Referências para os AlertDialogs
  const cancelRefFechar = useRef();
  const cancelRefRemoverPrestador = useRef();
  const cancelRefRemoverServico = useRef();

  const combinedValidationSchema = useMemo(() => {
    let schema = ticketValidationSchema;

    if (mostrarPrestador || !mostrarPrestador) {
      schema = schema.shape({
        prestador: prestadorValidationSchema.shape({
          sid: Yup.string().required("SID é obrigatório"),
          documento: Yup.string()
            .required("Documento é obrigatório")
            .test("documento-valido", "Documento inválido", function () {
              const { tipo } = this.parent;
              if (ticket) return true;
              return tipo === "pf" ? cpfValido : cnpjValido;
            }),
        }),
      });
    } else {
      schema = schema.shape({
        prestador: Yup.object().nullable(),
      });
    }

    if (mostrarServico && valeuArrayService) {
      schema = schema.shape({
        servicos: Yup.array()
          .of(servicoValidationSchema)
          .min(1, "É necessário adicionar pelo menos um serviço"),
      });
    } else {
      schema = schema.shape({
        servicos: Yup.array().of(Yup.object().nullable()),
      });
    }

    return schema;
  }, [
    mostrarPrestador,
    mostrarServico,
    cpfValido,
    cnpjValido,
    valeuArrayService,
  ]);

  const combinedInitValues = useMemo(() => {
    let initValues = {
      titulo: "",
      observacao: "",
      prestador: prestadorInitValues,
      servicos: [],
      arquivos: [],
      sciUnico: ""
    };

    if (ticket) {
      initValues = {
        ...initValues,
        titulo: ticket?.titulo,
        arquivos: ticket?.arquivos,
        observacao: ticket?.observacao,
        prestador: {
          ...ticket?.prestador,
          pessoaFisica: {
            ...ticket?.prestador?.pessoaFisica,
            dataNascimento: ticket?.prestador?.pessoaFisica?.dataNascimento
              ? ticket.prestador?.pessoaFisica?.dataNascimento?.slice(0, 10)
              : "",
          },
        },
        servicos: ticket?.servicos
          ? ticket?.servicos.map((servico) => ({
              ...servicoInitValues,
              ...servico,
            }))
          : [],
      };
    }

    return initValues;
  }, [ticket]);

  const abrirPainelPrestador = () => {
    if (!mostrarPrestador) {
      setMostrarPrestador(true);
    }
  };

  const handleUpdatePrestadorInfo = (nome, sid, isTyping) => {
    setDisplayNome(nome);
    setDisplaySid(sid);
    setIsTyping(isTyping);
  };

  const handleSomaTotalChange = (soma) => {
    setSomaTotalServicos(soma);
  };

  // Handler de submissão
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    setFormHasErrors(false);

    try {
      let prestadorId = null;
      let servicosIds = [];

      if (mostrarPrestador || values.prestador) {
        const documentoLimpo = values.prestador.documento
          ? values.prestador.documento.replace(/[^\d]/g, "")
          : "";


        const cepLimpo = values.prestador.endereco?.cep
          ? values.prestador.endereco.cep.replace(/[^\d]/g, "")
          : "";

        const prestadorDados = {
          ...values.prestador,
          documento: documentoLimpo,
          endereco: {
            ...values.prestador.endereco,
            cep: cepLimpo,
          },
        };

        if (prestadorDados.endereco && prestadorDados.endereco.bairro) {
          delete prestadorDados.endereco.bairro;
        }

        if (isEditMode && ticket.prestador) {
          prestadorId = ticket.prestador._id;
          const prestadorResponse = await salvarPrestador({
            ...prestadorDados,
            _id: prestadorId,
          });
          prestadorId = prestadorResponse.prestador._id;
        } else {
          const prestadorResponse = await salvarPrestador(prestadorDados);
          prestadorId = prestadorResponse.prestador._id;
        }
      }

      if (mostrarServico || values.servicos.length > 0) {
        for (let i = 0; i < values.servicos.length; i++) {
          const servico = values.servicos[i];
          if (servico) {
            let servicoId = null;
            if (isEditMode && ticket.servicos && ticket.servicos[i]) {
              servicoId = ticket.servicos[i]._id;
              const servicoResponse = await salvarServico({
                ...servico,
                _id: servicoId,
              });
              servicoId = servicoResponse.servico._id;
            } else {
              const servicoResponse = await salvarServico(servico);
              servicoId = servicoResponse.servico._id;
            }
            servicosIds.push(servicoId);
          }
        }
      }

      const ticketData = isEditMode
        ? {
            _id: ticket._id,
            titulo: values.titulo,
            observacao: values.observacao,
            status: values.status,
            prestadorId,
            servicosIds,
          }
        : {
            baseOmieId: baseOmie?._id,
            etapa: listaEtapas[0]?.codigo || "",
            titulo: values.titulo,
            observacao: values.observacao,
            status: "aguardando-inicio",
            prestadorId,
            servicosIds,
          };

      const sucessoTicket = await salvarTicket(ticketData);

      if (sucessoTicket.ticket?._id) {
        closeModal();
        // toast({
        //   title: "Ticket salvo com sucesso.",
        //   status: "success",
        //   duration: 5000,
        //   isClosable: true,
        // });
      } else {
        throw new Error("Erro ao salvar ticket.");
      }
    } catch (error) {
      console.error("Erro ao salvar ticket:", error);
      setErrors(error);

      toast({
        title: "Erro ao salvar ticket.",
        description:
          error.response.data.detalhes || error.response.data.message || "Ocorreu um erro inesperado.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentoValido = (isValid, tipo) => {
    if (tipo === "pj") setCnpjValido(isValid);
    if (tipo === "pf") setCpfValido(isValid);
  };

  // Funções para abrir os diálogos de confirmação
  const abrirConfirmarFechar = (formik) => {
    if (formik !== undefined) {
      const formAlterado =
        formik.values.titulo !== formik.initialValues.titulo ||
        formik.values.observacao !== formik.initialValues.observacao ||
        verificarAlteracoesPrestador(
          formik.values.prestador,
          formik.initialValues.prestador
        ) ||
        verificarAlteracoesServicos(
          formik.values.servicos,
          formik.initialValues.servicos
        );

      if (formAlterado) {
        setConfirmacao((prev) => ({ ...prev, fecharModal: true }));
      } else {
        confirmarFechar();
      }
    }
  };

  const verificarAlteracoesPrestador = (prestadorAtual, prestadorInicial) => {
    return (
      prestadorAtual.nome !== prestadorInicial.nome ||
      prestadorAtual.tipo !== prestadorInicial.tipo ||
      prestadorAtual.documento !== prestadorInicial.documento ||
      prestadorAtual.email !== prestadorInicial.email ||
      prestadorAtual.comentariosRevisao !==
        prestadorInicial.comentariosRevisao ||
      prestadorAtual.status !== prestadorInicial.status ||
      verificarAlteracoesPessoaFisica(
        prestadorAtual.pessoaFisica,
        prestadorInicial.pessoaFisica
      ) ||
      verificarAlteracoesDadosBancarios(
        prestadorAtual.dadosBancarios,
        prestadorInicial.dadosBancarios
      ) ||
      // Verificacao do endereco
      verificarAlteracoesEndereco(
        prestadorAtual.endereco,
        prestadorInicial.endereco
      )
    );
  };

  const verificarAlteracoesPessoaFisica = (
    pessoaFisicaAtual,
    pessoaFisicaInicial
  ) => {
    if (
      !pessoaFisicaAtual ||
      !pessoaFisicaInicial ||
      pessoaFisicaAtual.dataNascimento === ""
    )
      return false;
    return (
      pessoaFisicaAtual.rg.numero !== pessoaFisicaInicial.rg.numero ||
      pessoaFisicaAtual.rg.orgaoEmissor !==
        pessoaFisicaInicial.rg.orgaoEmissor ||
      pessoaFisicaAtual.dataNascimento !== pessoaFisicaInicial.dataNascimento ||
      pessoaFisicaAtual.pis !== pessoaFisicaInicial.pis ||
      pessoaFisicaAtual.nomeMae !== pessoaFisicaInicial.nomeMae
    );
  };

  const verificarAlteracoesDadosBancarios = (
    bancariosAtual,
    bancariosInicial
  ) => {
    if (!bancariosAtual || !bancariosInicial) return false;
    return (
      bancariosAtual.banco !== bancariosInicial.banco ||
      bancariosAtual.agencia !== bancariosInicial.agencia ||
      bancariosAtual.conta !== bancariosInicial.conta ||
      bancariosAtual.tipoConta !== bancariosInicial.tipoConta
    );
  };

  const verificarAlteracoesEndereco = (enderecoAtual, enderecoInicial) => {
    if (!enderecoAtual || !enderecoInicial) return false;
    return (
      enderecoAtual.cep !== enderecoInicial.cep ||
      enderecoAtual.rua !== enderecoInicial.rua ||
      enderecoAtual.numero !== enderecoInicial.numero ||
      enderecoAtual.complemento !== enderecoInicial.complemento ||
      enderecoAtual.cidade !== enderecoInicial.cidade ||
      enderecoAtual.estado !== enderecoInicial.estado
    );
  };

  const verificarAlteracoesServicos = (servicosAtuais, servicosIniciais) => {
    if (
      servicosAtuais.length === servicosIniciais.length ||
      servicosIniciais === undefined
    )
      return false;

    for (let i = 0; i < servicosAtuais.length; i++) {
      const servicoAtual = servicosAtuais[i];
      const servicoInicial = servicosIniciais[i];

      if (
        servicoAtual?.mesCompetencia !== servicoInicial?.mesCompetencia ||
        servicoAtual?.anoCompetencia !== servicoInicial?.anoCompetencia ||
        servicoAtual?.valorPrincipal !== servicoInicial?.valorPrincipal ||
        servicoAtual?.valorBonus !== servicoInicial?.valorBonus ||
        servicoAtual?.valorAjusteComercial !==
          servicoInicial?.valorAjusteComercial ||
        servicoAtual.valorHospedagemAnuncio !==
          servicoInicial?.valorHospedagemAnuncio ||
        servicoAtual?.valorTotal == servicoInicial?.valorTotal ||
        servicoAtual?.status !== servicoInicial?.status ||
        servicoAtual?.correcao !== servicoInicial?.correcao
      ) {
        return true;
      }
    }

    return false;
  };

  // Funções para confirmar as ações
  const confirmarFechar = () => {
    setConfirmacao((prev) => ({ ...prev, fecharModal: false }));
    closeModal();
  };

  const confirmarRemoverPrestador = () => {
    setConfirmacao((prev) => ({ ...prev, removerPrestador: false }));
    setMostrarPrestador(false);
  };

  const confirmarRemoverServico = () => {
    setMostrarServico(false);
    setConfirmacao((prev) => ({ ...prev, removerServico: false }));
  };

  return (
    <Formik
      initialValues={combinedInitValues}
      validationSchema={combinedValidationSchema}
      enableReinitialize
      validateOnChange={false}
      onSubmit={(values, actions) => {
        actions.validateForm().then((errors) => {
          if (Object.keys(errors).length > 0) {
            setFormHasErrors(true);
          } else {
            setFormHasErrors(false);
            handleSubmit(values, actions);
          }
        });
      }}
    >
      {(formik) => (
        <>
          <Modal
            isOpen={isOpen}
            onClose={() => abrirConfirmarFechar(formik)}
            size="6xl"
            isCentered
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <Form>
              <MotionModalContent
                color="brand.500"
                bg="brand.25"
                height="90vh"
                rounded="md"
                shadow="lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                <Flex direction="column" height="100%">
                  <Box
                    position="sticky"
                    top="0"
                    zIndex="1"
                    borderBottom="1px solid #e2e8f0"
                  >
                    <ModalHeader color="brand.350">
                      {isEditMode
                        ? "Detalhe do Ticket"
                        : "Adicionar Novo Ticket"}
                    </ModalHeader>

                    <ModalCloseButton
                      color="brand.500"
                      onClick={() => abrirConfirmarFechar(formik)}
                    />
                  </Box>

                  <Box flex="1" overflowY="auto" p={2}>
                    <ModalBody>
                      <Flex direction={{ base: "column", md: "row" }} gap={4}>
                        <Box flex={{ base: "1", md: "3" }}>
                          <Flex direction="column" gap={4}>
                            <TicketFields />
                          </Flex>
                        </Box>
                        {isEditMode && (
                          <Box flex={{ base: "1", md: "1" }}>
                            <TicketStatusButtons ticket={ticket} />
                          </Box>
                        )}
                      </Flex>

                      <Accordion
                        allowMultiple
                        mt={4}
                        index={[
                          mostrarPrestador ? 0 : -1, // index 0 é o Accordion "Prestador"
                          mostrarServico ? 1 : -1, // index 1 é o Accordion "Serviço"
                        ]}
                      >
                        {/* Accordion para Prestador */}
                        <AccordionItem border="none" my="30px">
                          <h2>
                            <AccordionButton
                              onClick={() =>
                                setMostrarPrestador((prev) => !prev)
                              }
                              bg={mostrarPrestador ? "#f8f7f7" : "transparent"}
                              _hover={{ bg: "#f8f7f7" }}
                              rounded="md"
                              minH="50px"
                            >
                              <Box
                                as="span"
                                flex="1"
                                textAlign="left"
                                color="#3D1C4F"
                                fontSize="17px"
                              >
                                <Text fontWeight="bold" fontSize="lg">
                                  Prestador
                                </Text>
                                {(displayNome || displaySid) && (
                                  <Text
                                    fontWeight="semibold"
                                    fontSize="md"
                                    color="green.600"
                                    mt={1}
                                  >
                                    {displayNome && `${displayNome}`}
                                    {displayNome && displaySid && " | "}
                                    {displaySid && `SID: ${displaySid}`}
                                  </Text>
                                )}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel
                            pb={4}
                            bg={mostrarPrestador ? "#f8f7f7" : "transparent"}
                          >
                            {mostrarPrestador && (
                              <Box mt={4}>
                                <PrestadorForm
                                  onDocumentoValido={handleDocumentoValido}
                                  onUpdatePrestadorInfo={
                                    handleUpdatePrestadorInfo
                                  }
                                  ticket={ticket}
                                />
                              </Box>
                            )}
                          </AccordionPanel>
                        </AccordionItem>

                        {/* Accordion para Serviço */}
                        <AccordionItem border="none" my="30px">
                          <h2>
                            <AccordionButton
                              onClick={() => setMostrarServico((prev) => !prev)}
                              bg={mostrarServico ? "#f8f7f7" : "transparent"}
                              _hover={{ bg: "#f8f7f7" }}
                              rounded="md"
                              minH="50px"
                            >
                              <Box
                                as="span"
                                flex="1"
                                textAlign="left"
                                color="#3D1C4F"
                                fontSize="17px"
                              >
                                <Text fontWeight="bold" fontSize="lg">
                                  Serviço
                                </Text>
                                <Text
                                  fontWeight="semibold"
                                  fontSize="md"
                                  color="green.600"
                                  mt={1}
                                >
                                  Total: R$ {somaTotalServicos.toFixed(2)}
                                </Text>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel
                            pb={4}
                            bg={mostrarServico ? "#f8f7f7" : "transparent"}
                          >
                            {mostrarServico && (
                              <Box mt={4}>
                                <ServicoForm
                                  mostrarServico={mostrarServico}
                                  setValeuArrayService={setValeuArrayService}
                                  onSomaTotalChange={handleSomaTotalChange}
                                />
                              </Box>
                            )}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>

                      <Box flex="1" px={2}>
                        {isEditMode && (
                          <>
                            <ImportFilesComponent ticketId={ticket._id} />
                            <FilesViewComponent />
                          </>
                        )}
                      </Box>
                    </ModalBody>
                  </Box>

                  <ModalFooter borderTop="1px solid #e2e8f0">
                    <Flex width="100%" justifyContent="space-between">
                      <TicketActions
                        ticket={ticket}
                        isEditMode={isEditMode}
                        formHasErrors={formHasErrors}
                        closeModal={abrirConfirmarFechar}
                        onCancel={abrirConfirmarFechar}
                        cancelar={closeModal}
                        abrirPainelPrestador={abrirPainelPrestador}
                      />
                    </Flex>
                  </ModalFooter>
                </Flex>
              </MotionModalContent>
            </Form>
          </Modal>

          {/* AlertDialogs para confirmações */}
          <AlertDialog
            isOpen={confirmacao.fecharModal}
            leastDestructiveRef={cancelRefFechar}
            onClose={() =>
              setConfirmacao((prev) => ({ ...prev, fecharModal: false }))
            }
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirmar Fechamento
                </AlertDialogHeader>

                <AlertDialogBody>
                  Tem certeza de que deseja fechar o modal? Todas as alterações
                  não salvas serão perdidas.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={cancelRefFechar}
                    onClick={() =>
                      setConfirmacao((prev) => ({
                        ...prev,
                        fecharModal: false,
                      }))
                    }
                  >
                    Cancelar
                  </Button>
                  <Button colorScheme="red" onClick={confirmarFechar} ml={3}>
                    Fechar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          {/* Outros AlertDialogs */}
          {/* AlertDialog para confirmar remoção do prestador */}
          <AlertDialog
            isOpen={confirmacao.removerPrestador}
            leastDestructiveRef={cancelRefRemoverPrestador}
            onClose={() =>
              setConfirmacao((prev) => ({ ...prev, removerPrestador: false }))
            }
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirmar Remoção do Prestador
                </AlertDialogHeader>

                <AlertDialogBody>
                  Tem certeza de que deseja remover o prestador? Esta ação não
                  pode ser desfeita.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={cancelRefRemoverPrestador}
                    onClick={() =>
                      setConfirmacao((prev) => ({
                        ...prev,
                        removerPrestador: false,
                      }))
                    }
                  >
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={confirmarRemoverPrestador}
                    ml={3}
                  >
                    Remover
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          {/* AlertDialog para confirmação de remover serviço */}
          <AlertDialog
            isOpen={confirmacao.removerServico}
            leastDestructiveRef={cancelRefRemoverServico}
            onClose={() =>
              setConfirmacao((prev) => ({ ...prev, removerServico: false }))
            }
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirmar Remoção do Serviço
                </AlertDialogHeader>

                <AlertDialogBody>
                  Tem certeza de que deseja remover o(s) serviço(s)? Esta ação
                  não pode ser desfeita.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={cancelRefRemoverServico}
                    onClick={() =>
                      setConfirmacao((prev) => ({
                        ...prev,
                        removerServico: false,
                      }))
                    }
                  >
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={confirmarRemoverServico}
                    ml={3}
                  >
                    Remover
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </Formik>
  );
};

export default TicketModal;
