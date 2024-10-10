// src/components/ticket/TicketModal.js
import React from "react";
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
  Button,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import TicketFields from "./TicketFields";
import TicketActions from "./TicketActions";
import PrestadorForm from "../PrestadorForm";
import ServicoForm from "../ServicoForm";
import TicketStatusButtons from "./TicketStatusButtons";
import { ticketValidationSchema } from "../../validation/ticketValidationSchema";
import { ticketInitValues } from "../../initValues/ticketInitValues";
import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";
import { salvarPrestador } from "../../services/prestadorService";
import { salvarServico } from "../../services/servicoService";
import { useToast } from "@chakra-ui/react";

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const { salvarTicket } = useTicket();
  const { baseOmie } = useBaseOmie();
  const { listaEtapas } = useEtapa();
  const toast = useToast();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    values.prestador.documento = values.prestador.documento.replace(/[^\d]/g, "");
    try {
      let prestadorId = null;
      let servicoId = null;

      if (isEditMode) {
        prestadorId = ticket.prestador._id;
        servicoId = ticket.servico._id;

        const prestadorResponse = await salvarPrestador({
          ...values.prestador,
          _id: prestadorId,
        });
        const servicoResponse = await salvarServico({
          ...values.servico,
          _id: servicoId,
        });
        prestadorId = prestadorResponse.prestador._id;
        servicoId = servicoResponse.servico._id;
      } else {
        const prestadorResponse = await salvarPrestador(values.prestador);
        const servicoResponse = await salvarServico(values.servico);
        prestadorId = prestadorResponse.prestador._id;
        servicoId = servicoResponse.servico._id;
      }

      const ticketData = isEditMode
        ? {
            _id: ticket._id,
            titulo: values.titulo,
            observacao: values.observacao,
            status: values.status,
            prestadorId,
            servicoId,
          }
        : {
            baseOmieId: baseOmie?._id || "66fecc5b0c2acb31fa820b16",
            etapa: listaEtapas[0]?.codigo || "",
            titulo: values.titulo,
            observacao: values.observacao,
            status: "aguardando-inicio",
            prestadorId,
            servicoId,
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
        initialValues={ticketInitValues(isEditMode, ticket)}
        validationSchema={ticketValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <ModalContent
              color="brand.800"
              bg="brand.50"
              height="90vh" // Ajuste a altura conforme necessário
              rounded="md" // Define os cantos arredondados
              shadow="lg" // Define a sombra
            >
              <Flex direction="column" height="100%">
                {/* Cabeçalho Fixo */}
                <Box position="sticky" top="0" zIndex="1" borderBottom="1px solid #e2e8f0">
                  <ModalHeader>
                    {isEditMode ? "Editar Ticket" : "Adicionar Novo Ticket"}
                  </ModalHeader>
                  <ModalCloseButton />
                </Box>

                {/* Corpo Rolável */}
                <Box flex="1" overflowY="auto" p={2}>
                  <ModalBody>
                    <Flex direction={{ base: "column", md: "row" }} gap={4}>
                      {/* Área do Formulário - 75% da largura */}
                      <Box flex={{ base: "1", md: "3" }}>
                        <Flex direction="column" gap={4}>
                          <TicketFields formik={formik} />
                        </Flex>
                      </Box>

                      {/* Área dos Botões de Status - 25% da largura */}
                      {isEditMode && (
                        <Box flex={{ base: "1", md: "1" }}>
                          <TicketStatusButtons formik={formik} ticket={ticket} />
                        </Box>
                      )}
                    </Flex>
                    <Box mt={4}>
                      <PrestadorForm formik={formik} />
                      <ServicoForm formik={formik} />
                    </Box>
                  </ModalBody>
                </Box>

                {/* Footer Fixo com Ações */}
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
