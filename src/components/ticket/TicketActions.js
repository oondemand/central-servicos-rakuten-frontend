import React from "react";
import { ModalFooter, ButtonGroup, Button } from "@chakra-ui/react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const TicketActions = ({ formik, isEditMode, closeModal }) => {
  const handleApprove = async () => {
    if (!isEditMode) return;
    const sucesso = await formik.aprovacaoTicket(formik.values._id, true);
    if (sucesso) {
      formik.toast({
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
    const sucesso = await formik.aprovacaoTicket(formik.values._id, false);
    if (sucesso) {
      formik.toast({
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
    const confirmDelete = window.confirm("Tem certeza que deseja arquivar este ticket?");
    if (!confirmDelete) return;

    const ticketUpdate = { _id: formik.values._id, status: "arquivado" };
    const sucesso = await formik.salvarTicket(ticketUpdate);

    if (sucesso) {
      formik.toast({
        title: "Ticket arquivado com sucesso!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    }
  };

  return (
    <ModalFooter display={"flex"} justifyContent={"space-between"} pt={4}>
      {isEditMode && (
        <ButtonGroup spacing={4}>
          <Button onClick={handleApprove} colorScheme="green" leftIcon={<FaCheck />}>
            Aprovar Ticket
          </Button>
          <Button onClick={handleReject} colorScheme="red" leftIcon={<FaTimes />}>
            Recusar Ticket
          </Button>
          <Button onClick={handleArquivar} colorScheme="red" variant="outline" leftIcon={<FaTrash />}>
            Arquivar Ticket
          </Button>
        </ButtonGroup>
      )}
      <ButtonGroup>
        <Button onClick={closeModal} colorScheme="gray">
          Cancelar
        </Button>
        <Button type="submit" colorScheme="blue" isLoading={formik.isSubmitting}>
          {isEditMode ? "Salvar Alterações" : "Salvar"}
        </Button>
      </ButtonGroup>
    </ModalFooter>
  );
};

export default TicketActions;