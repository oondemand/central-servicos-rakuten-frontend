// src/components/ticket/TicketForm.js
import React from "react";
import { Formik, Form } from "formik";
import { useToast, VStack, Box } from "@chakra-ui/react";

import { ticketValidationSchema } from "../../validation/ticketValidationSchema";
import { ticketInitValues } from "../../initValues/ticketInitValues";

import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";

import TicketFields from "./TicketFields";
import TicketActions from "./TicketActions";
import TicketStatusButtons from "./TicketStatusButtons";
import PrestadorForm from "../PrestadorForm";
import ServicoForm from "../ServicoForm";

import { salvarPrestador } from "../../services/prestadorService";
import { salvarServico } from "../../services/servicoService";

const TicketForm = ({ isEditMode, ticket, closeModal }) => {
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
    <Formik
      initialValues={ticketInitValues(isEditMode, ticket)}
      validationSchema={ticketValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <VStack spacing={4} align="stretch">
            <TicketFields formik={formik} />
            <PrestadorForm formik={formik} />
            <ServicoForm formik={formik} />
            {isEditMode && <TicketStatusButtons formik={formik} ticket={ticket} />}
            <TicketActions formik={formik} ticket={ticket} isEditMode={isEditMode} closeModal={closeModal} />
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default TicketForm;
