// src/components/ticket/TicketModal.js

import React, { useMemo, useState, useRef } from "react";
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
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useToast } from "@chakra-ui/react";
import * as Yup from "yup";

import TicketFields from "./TicketFields";
import TicketActions from "./TicketActions";
import PrestadorForm from "../form/PrestadorForm";
import ServicoForm from "../form/ServicoForm";
import TicketStatusButtons from "./TicketStatusButtons";
import { ticketValidationSchema } from "../../validation/ticketValidationSchema";
import { prestadorValidationSchema } from "../../validation/prestadorValidationSchema";
import { servicoValidationSchema } from "../../validation/servicoValidationSchema";
import { prestadorInitValues } from "../../initValues/prestadorInitValues";
import { servicoInitValues } from "../../initValues/servicoInitValues";
import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";
import { salvarPrestador } from "../../services/prestadorService";
import { salvarServico } from "../../services/servicoService";

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const { salvarTicket } = useTicket();
  const { baseOmie } = useBaseOmie();
  const { listaEtapas } = useEtapa();
  const toast = useToast();

  // Estados para controlar a exibição dos formulários
  const [mostrarPrestador, setMostrarPrestador] = useState(ticket?.prestador ? true : false);
  const [mostrarServico, setMostrarServico] = useState(ticket?.servicos ? true : false);

  // Estados para controlar os diálogos de confirmação
  const [confirmacao, setConfirmacao] = useState({
    fecharModal: false,
    removerPrestador: false,
    removerServico: false,
  });

  // Referências para os AlertDialogs
  const cancelRefFechar = useRef();
  const cancelRefRemoverPrestador = useRef();
  const cancelRefRemoverServico = useRef();

  // Esquema de validação combinado
  const combinedValidationSchema = useMemo(() => {
    let schema = ticketValidationSchema;

    if (mostrarPrestador) {
      schema = schema.shape({
        prestador: prestadorValidationSchema,
      });
    } else {
      schema = schema.shape({
        prestador: Yup.object().nullable(),
      });
    }

    if (mostrarServico) {
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
  }, [mostrarPrestador, mostrarServico]);

  // Valores iniciais combinados
  const combinedInitValues = useMemo(() => {
    let initValues = {
      titulo: "",
      observacao: "",
      prestador: prestadorInitValues,
      servicos: [],
    };

    if (ticket) {
      initValues = {
        ...initValues,
        titulo: ticket.titulo,
        observacao: ticket.observacao,
        prestador: ticket.prestador || prestadorInitValues,
        servicos: ticket.servicos
          ? ticket.servicos.map((servico) => ({
              ...servicoInitValues,
              ...servico,
            }))
          : [],
      };
    }

    return initValues;
  }, [ticket]);

  // Handler de submissão
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let prestadorId = null;
      let servicosIds = [];

      if (mostrarPrestador && values.prestador) {
        const documentoLimpo = values.prestador.documento
          ? values.prestador.documento.replace(/[^\d]/g, "")
          : "";

        const prestadorDados = {
          ...values.prestador,
          documento: documentoLimpo,
        };

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

      if (mostrarServico && values.servicos.length > 0) {
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
      } else {
        throw new Error("Erro ao salvar ticket.");
      }
    } catch (error) {
      console.error("Erro ao salvar ticket:", error);
      toast({
        title: "Erro ao salvar ticket.",
        description: error.message || "Ocorreu um erro inesperado.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Funções para abrir os diálogos de confirmação
  const abrirConfirmarFechar = () => setConfirmacao((prev) => ({ ...prev, fecharModal: true }));
  const abrirConfirmarRemoverPrestador = () =>
    setConfirmacao((prev) => ({ ...prev, removerPrestador: true }));
  const abrirConfirmarRemoverServico = () =>
    setConfirmacao((prev) => ({ ...prev, removerServico: true }));

  // Funções para confirmar as ações
  const confirmarFechar = () => {
    setConfirmacao((prev) => ({ ...prev, fecharModal: false }));
    closeModal();
  };

  const confirmarRemoverPrestador = () => {
    setMostrarPrestador(false);
    setConfirmacao((prev) => ({ ...prev, removerPrestador: false }));
  };

  const confirmarRemoverServico = () => {
    setMostrarServico(false);
    setConfirmacao((prev) => ({ ...prev, removerServico: false }));
  };

  return (
    <>
      {/* Modal Principal */}
      <Modal
        isOpen={isOpen}
        onClose={abrirConfirmarFechar} // Abre o diálogo de confirmação ao tentar fechar
        size="6xl"
        isCentered
        closeOnOverlayClick={false} // Evita fechar clicando fora
      >
        <ModalOverlay />
        <Formik
          initialValues={combinedInitValues}
          validationSchema={combinedValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnChange={false}
        >
          {(formik) => (
            <Form>
              <ModalContent color="brand.800" bg="brand.50" height="90vh" rounded="md" shadow="lg">
                <Flex direction="column" height="100%">
                  <Box position="sticky" top="0" zIndex="1" borderBottom="1px solid #e2e8f0">
                    <ModalHeader>
                      {isEditMode ? "Editar Ticket" : "Adicionar Novo Ticket"}
                    </ModalHeader>
                    <ModalCloseButton />
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
                      <HStack spacing={4} mt={4}>
                        {/* Botão Adicionar/Remover Prestador */}
                        {!mostrarPrestador ? (
                          <Button
                            onClick={() => setMostrarPrestador(true)}
                            colorScheme="teal"
                            variant="outline"
                          >
                            Adicionar Prestador
                          </Button>
                        ) : (
                          <Button
                            onClick={abrirConfirmarRemoverPrestador} // Abre confirmação no pai
                            colorScheme="red"
                            variant="outline"
                          >
                            Remover Prestador
                          </Button>
                        )}

                        {/* Botão Adicionar/Remover Serviço */}
                        {!mostrarServico ? (
                          <Button
                            onClick={() => setMostrarServico(true)}
                            colorScheme="teal"
                            variant="outline"
                          >
                            Adicionar Serviço
                          </Button>
                        ) : (
                          <Button
                            onClick={abrirConfirmarRemoverServico} // Abre confirmação no pai
                            colorScheme="red"
                            variant="outline"
                          >
                            Remover Serviço
                          </Button>
                        )}
                      </HStack>
                      {mostrarPrestador && (
                        <Box mt={4}>
                          <PrestadorForm />
                        </Box>
                      )}
                      {mostrarServico && (
                        <Box mt={4}>
                          <ServicoForm />
                        </Box>
                      )}
                    </ModalBody>
                  </Box>
                  <ModalFooter borderTop="1px solid #e2e8f0">
                    <Flex width="100%" justifyContent="space-between">
                      <TicketActions
                        ticket={ticket}
                        isEditMode={isEditMode}
                        closeModal={abrirConfirmarFechar} // Passa função para abrir confirmação
                        onCancel={abrirConfirmarFechar} // Passa função para cancelamento
                        // Adicione outras funções conforme necessário
                      />
                    </Flex>
                  </ModalFooter>
                </Flex>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* AlertDialog para confirmação de fechar o Modal Principal */}
      <AlertDialog
        isOpen={confirmacao.fecharModal}
        leastDestructiveRef={cancelRefFechar}
        onClose={() => setConfirmacao((prev) => ({ ...prev, fecharModal: false }))}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Fechamento
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza de que deseja fechar o modal? Todas as alterações não salvas serão perdidas.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefFechar} onClick={() => setConfirmacao((prev) => ({ ...prev, fecharModal: false }))}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmarFechar}
                ml={3}
              >
                Fechar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* AlertDialog para confirmação de remover Prestador */}
      <AlertDialog
        isOpen={confirmacao.removerPrestador}
        leastDestructiveRef={cancelRefRemoverPrestador}
        onClose={() => setConfirmacao((prev) => ({ ...prev, removerPrestador: false }))}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Remoção do Prestador
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza de que deseja remover o prestador? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefRemoverPrestador} onClick={() => setConfirmacao((prev) => ({ ...prev, removerPrestador: false }))}>
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

      {/* AlertDialog para confirmação de remover Serviço */}
      <AlertDialog
        isOpen={confirmacao.removerServico}
        leastDestructiveRef={cancelRefRemoverServico}
        onClose={() => setConfirmacao((prev) => ({ ...prev, removerServico: false }))}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Remoção do Serviço
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza de que deseja remover o(s) serviço(s)? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefRemoverServico} onClick={() => setConfirmacao((prev) => ({ ...prev, removerServico: false }))}>
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
  );
};

export default TicketModal;
