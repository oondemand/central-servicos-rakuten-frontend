import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useTicket } from "../../contexts/TicketContext";

// Definir o schema de validação com Yup
const validationSchema = Yup.object({
  titulo: Yup.string()
    .required("Título é obrigatório"),
  observacao: Yup.string()
    .required("Observação é obrigatória"),
});

const AddTicketModal = ({ closeModal }) => {
  const { salvarTicket } = useTicket();
  const { baseSelecionada } = useBaseOmie();
  const { listaTickets } = useTicket();

  const formik = useFormik({
    initialValues: {
      titulo: "",
      observacao: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const newTicket = {
        baseOmie: baseSelecionada._id,
        etapa: listaTickets[0]?.etapa || "",
        titulo: values.titulo,
        observacao: values.observacao,
        status: "aguardando-inicio",
      };
      const sucesso = await salvarTicket(newTicket);
      setSubmitting(false);
      if (sucesso) closeModal();
    },
  });

  return (
    <Modal isOpen={true} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Novo Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <FormControl mb={4} isInvalid={formik.errors.titulo && formik.touched.titulo}>
              <FormLabel>Título do ticket</FormLabel>
              <Input
                type="text"
                id="titulo"
                name="titulo"
                value={formik.values.titulo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.titulo && formik.errors.titulo ? (
                <div style={{ color: "red" }}>{formik.errors.titulo}</div>
              ) : null}
            </FormControl>
            <FormControl mb={4} isInvalid={formik.errors.observacao && formik.touched.observacao}>
              <FormLabel>Observação</FormLabel>
              <Textarea
                id="observacao"
                name="observacao"
                value={formik.values.observacao}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
              />
              {formik.touched.observacao && formik.errors.observacao ? (
                <div style={{ color: "red" }}>{formik.errors.observacao}</div>
              ) : null}
            </FormControl>
            <ModalFooter>
              <Button onClick={closeModal} colorScheme="gray" mr={3}>
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={formik.isSubmitting}
              >
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTicketModal;
