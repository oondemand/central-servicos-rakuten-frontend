// src/components/ticket/TicketModal.js
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import TicketForm from "./TicketForm";

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent bg="brand.50" color="brand.800">
        <ModalHeader bg="brand.100">{isEditMode ? "Editar Ticket" : "Adicionar Novo Ticket"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TicketForm isEditMode={isEditMode} ticket={ticket} closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TicketModal;
