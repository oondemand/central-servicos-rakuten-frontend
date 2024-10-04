// src/components/ticket/TicketModal.jsx
import React, { useEffect } from "react";
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
  ButtonGroup,
  useToast,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";

const validationSchema = Yup.object({
  titulo: Yup.string().required("Título é obrigatório"),
  observacao: Yup.string().required("Observação é obrigatória"),
});

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const {
    salvarTicket,
    alterarStatusTicket,
    aprovacaoTicket,
    deletarTicket,
    listaTickets,
  } = useTicket();
  const { baseSelecionada } = useBaseOmie();
  const toast = useToast();
  const { listaEtapas } = useEtapa();

  const formik = useFormik({
    initialValues: {
      titulo: isEditMode ? ticket.titulo : "",
      observacao: isEditMode ? ticket.observacao : "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      if (isEditMode) {
        const updatedTicket = {
          ...ticket,
          titulo: values.titulo,
          observacao: values.observacao,
        };
        const sucesso = await salvarTicket(updatedTicket);
        setSubmitting(false);
        if (sucesso) {
          toast({
            title: "Ticket atualizado com sucesso!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          closeModal();
        }
      } else {
        const newTicket = {
          baseOmie: baseSelecionada._id,
          etapa: listaEtapas[0].codigo,
          titulo: values.titulo,
          observacao: values.observacao,
          status: "aguardando-inicio",
        };
        const sucesso = await salvarTicket(newTicket);
        setSubmitting(false);
        if (sucesso) closeModal();
      }
    },
  });

  const handleApprove = async () => {
    if (!isEditMode) return;
    toast.closeAll();
    const sucesso = await aprovacaoTicket(ticket._id, true); // Aprovar o ticket
    if (sucesso) {
      toast({
        title: "Ticket aprovado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    }
  };

  const handleReject = async () => {
    if (!isEditMode) return;
    toast.closeAll();
    const sucesso = await aprovacaoTicket(ticket._id, false); // Recusar o ticket
    if (sucesso) {
      toast({
        title: "Ticket recusado com sucesso!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    }
  };

  const handleArquivar = async () => {
    if (!isEditMode) return;
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este ticket?"
    );
    if (!confirmDelete) return;

    const ticketUpdate = { _id: ticket._id, status: "arquivado" };
    const sucesso = await salvarTicket(ticketUpdate);

    if (sucesso) {
      toast({
        title: "Ticket deletado com sucesso!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isEditMode) return;
    await alterarStatusTicket(ticket._id, newStatus);
  };
  const { colorMode, toggleColorMode } = useColorMode();

  // Força o modo escuro quando o modal é aberto
  useEffect(() => {
    if (isOpen && colorMode !== "dark") {
      toggleColorMode();
    }
  }, [isOpen, colorMode, toggleColorMode]);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        {isEditMode ? "Editar Ticket" : "Adicionar Novo Ticket"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <Flex justifyContent="space-between" width="100%">
          <Flex flex={isEditMode ? "0 0 70%" : "100%"} flexDirection="column">

              <FormControl
                mb={4}
                isInvalid={formik.errors.titulo && formik.touched.titulo}
              >
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
              <FormControl
                mb={4}
                isInvalid={
                  formik.errors.observacao && formik.touched.observacao
                }
              >
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
            </Flex>
  
            {isEditMode && (
              <FormControl mb={3} flex="0 0 25%">
                <FormLabel>Status</FormLabel>
                <Flex flexDirection={"column"} spacing={4}>
                  <Button
                    onClick={() => handleStatusChange("aguardando-inicio")}
                    colorScheme={
                      ticket.status === "aguardando-inicio" ? "yellow" : "gray"
                    }
                    mb={2}
                  >
                    Aguardando Início
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("trabalhando")}
                    colorScheme={
                      ticket.status === "trabalhando" ? "green" : "gray"
                    }
                    mb={2}
                  >
                    Trabalhando
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("revisao")}
                    colorScheme={ticket.status === "revisao" ? "red" : "gray"}
                  >
                    Revisão
                  </Button>
                </Flex>
              </FormControl>
            )}
          </Flex>
  
          <ModalFooter display={"flex"} justifyContent={"space-between"} pt={20}>
            {isEditMode && (
              <ButtonGroup spacing={4}>
                <Button
                  onClick={handleApprove}
                  colorScheme="green"
                  leftIcon={<FaCheck />}
                >
                  Aprovar Ticket
                </Button>
                <Button
                  onClick={handleReject}
                  colorScheme="red"
                  leftIcon={<FaTimes />}
                >
                  Recusar Ticket
                </Button>
                <Button
                  onClick={handleArquivar}
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FaTrash />}
                >
                  Deletar Ticket
                </Button>
              </ButtonGroup>
            )}
            <ButtonGroup>
              <Button onClick={closeModal} colorScheme="gray">
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={formik.isSubmitting}
              >
                {isEditMode ? "Salvar Alterações" : "Salvar"}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </form>
      </ModalBody>
    </ModalContent>
  </Modal>
  
  );
};

export default TicketModal;
