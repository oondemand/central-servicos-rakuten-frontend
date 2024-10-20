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
  const [mostrarPrestador, setMostrarPrestador] = useState(ticket?.prestador ? true : false);
  const [mostrarServico, setMostrarServico] = useState(ticket?.servicos ? true : false);

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

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl" isCentered>
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
