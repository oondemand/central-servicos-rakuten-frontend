import React, { useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import TicketFields from "./TicketFields";
import TicketActions from "./TicketActions";
import PrestadorForm from "../PrestadorForm";
import ServicoForm from "../ServicoForm";
import TicketStatusButtons from "./TicketStatusButtons";
import { ticketValidationSchema } from "../../validation/ticketValidationSchema";
import { prestadorValidationSchema } from "../../validation/prestadorValidationSchema";
import { servicoValidationSchema } from "../../validation/servicoValidationSchema";
import { ticketInitValues } from "../../initValues/ticketInitValues";
import { prestadorInitValues } from "../../initValues/prestadorInitValues";
import { servicoInitValues } from "../../initValues/servicoInitValues";
import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";
import { salvarPrestador } from "../../services/prestadorService";
import { salvarServico } from "../../services/servicoService";
import { useToast } from "@chakra-ui/react";
import * as Yup from "yup";

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const { salvarTicket } = useTicket();
  const { baseOmie } = useBaseOmie();
  const { listaEtapas } = useEtapa();
  const toast = useToast();
  const [mostrarPrestador, setMostrarPrestador] = useState(ticket.prestador ? true : false);
  const [mostrarServico, setMostrarServico] = useState(ticket.servico ? true : false);

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
        servico: servicoValidationSchema,
      });
    } else {
      schema = schema.shape({
        servico: Yup.object().nullable(),
      });
    }

    return schema;
  }, [mostrarPrestador, mostrarServico]);

  const combinedInitValues = useMemo(() => {
    let initValues = {
      titulo: "",
      observacao: "",
      prestador: prestadorInitValues,
      servico: servicoInitValues,
    };

    if (ticket) {
      initValues = {
        ...initValues,
        titulo: ticket.titulo,
        observacao: ticket.observacao,
        prestador: ticket.prestador || prestadorInitValues,
        servico: ticket.servico || servicoInitValues,
      };
    }

    return initValues;
  }, [ticket]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let prestadorId = null;
      let servicoId = null;

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

      console.log("mostrarServico", mostrarServico);
      if (mostrarServico && values.servico) {
        if (isEditMode && ticket.servico) {
          servicoId = ticket.servico._id;
          const servicoResponse = await salvarServico({
            ...values.servico,
            _id: servicoId,
          });
          servicoId = servicoResponse.servico._id;
        } else {
          const servicoResponse = await salvarServico(values.servico);
          servicoId = servicoResponse.servico._id;
        }
      }

      const ticketData = isEditMode
        ? {
            _id: ticket._id,
            titulo: values.titulo,
            observacao: values.observacao,
            status: values.status,
            prestadorId,
            servicoId: servicoId,
          }
        : {
            baseOmieId: baseOmie?._id,
            etapa: listaEtapas[0]?.codigo || "",
            titulo: values.titulo,
            observacao: values.observacao,
            status: "aguardando-inicio",
            prestadorId,
            servicoId: servicoId,
          };

      console.log("ticketData", ticketData);

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

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl" isCentered>
      <ModalOverlay />
      <Formik
        initialValues={combinedInitValues}
        validationSchema={combinedValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                          onClick={() => setMostrarPrestador(false)}
                          colorScheme="red"
                          variant="outline"
                        >
                          Remover Prestador
                        </Button>
                      )}

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
                          onClick={() => setMostrarServico(false)}
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
                      closeModal={closeModal}
                    />
                  </Flex>
                </ModalFooter>
              </Flex>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default TicketModal;
