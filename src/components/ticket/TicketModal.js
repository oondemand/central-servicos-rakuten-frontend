import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import TicketForm from "./TicketForm";

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (isOpen && colorMode !== "dark") {
      toggleColorMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const modalBg = useColorModeValue("white", "gray.800");

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl">
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader>{isEditMode ? "Editar Ticket" : "Adicionar Novo Ticket"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TicketForm isEditMode={isEditMode} ticket={ticket} closeModal={closeModal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TicketModal;