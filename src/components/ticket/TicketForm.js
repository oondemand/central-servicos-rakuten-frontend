// src/components/ticket/TicketForm.js
import React from "react";
import { Formik, Form } from "formik";
import { useToast } from "@chakra-ui/react";

import { ticketValidationSchema } from "../../validation/ticketValidationSchema";
import { ticketInitValues } from "../../initValues/ticketInitValues";

import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";

import TicketFields from "./TicketFields";
import TicketActions from "./TicketActions";
import TicketStatusButtons from "./TicketStatusButtons";

import { salvarPrestador } from "../../services/prestadorService";
import { salvarServico } from "../../services/servicoService";

const TicketForm = ({ isEditMode, ticket, closeModal }) => {
  const { salvarTicket } = useTicket();
  const { baseSelecionada } = useBaseOmie();
  const { listaEtapas } = useEtapa();
  const toast = useToast();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    values.prestador.documento = values.prestador.documento.replace(/[^\d]/g, "");
    if (isEditMode) {
      const updatedTicket = {
        ...ticket,
        titulo: values.titulo,
        observacao: values.observacao,
        status: values.status,
        prestador: values.prestador,
        servico: values.servico,
      };
      const sucesso = await salvarTicket(updatedTicket);
      setSubmitting(false);
      if (sucesso) {
        closeModal();
      }
    } else {
      // const sucessoPrestador = await salvarPrestador(values?.prestador);
      // const sucessoServico = await salvarServico(values?.servico);

      // if (sucessoPrestador && sucessoServico) {
      const newTicket = {
        baseOmieId: baseSelecionada?._id || "66fecc5b0c2acb31fa820b16",
        etapa: listaEtapas[0]?.codigo || "",
        titulo: values.titulo,
        observacao: values.observacao,
        status: "aguardando-inicio",
        // prestadorId: sucessoPrestador.prestador._id,
        // servicoId: sucessoServico.servico._id,
      };

      const sucessoTicket = await salvarTicket(newTicket);
      if (sucessoTicket) {
        closeModal();
      } else {
        toast({
          title: "Erro ao criar ticket.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      // } else {
      //   toast({
      //     title: "Erro ao salvar prestador ou serviço.",
      //     status: "error",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // }

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
        <Form onSubmit={formik.handleSubmit}>
          <TicketFields formik={formik} />
          {/* <PrestadorForm formik={formik} />
          <ServicoForm formik={formik} /> */}
          {isEditMode && <TicketStatusButtons formik={formik} />}
          <TicketActions formik={formik} isEditMode={isEditMode} closeModal={closeModal} />
        </Form>
      )}
    </Formik>
  );
};

export default TicketForm;
