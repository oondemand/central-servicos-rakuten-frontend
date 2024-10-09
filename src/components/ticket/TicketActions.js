// src/components/ticket/TicketActions.js
import React, { useRef } from "react";
import {
  ModalFooter,
  ButtonGroup,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTicket } from "../../contexts/TicketContext";

const TicketActions = ({ formik, ticket, isEditMode, closeModal }) => {
  const { salvarTicket, aprovarTicket, reprovarTicket } = useTicket();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleApprove = async () => {
    if (!isEditMode) return;
    const sucesso = await aprovarTicket(ticket._id);
    if (sucesso) {
      closeModal();
    }
  }; 

  const handleReject = async () => {
    if (!isEditMode) return;
    const sucesso = await reprovarTicket(ticket._id);
    if (sucesso) {
      closeModal();
    }
  };

  const handleArquivar = () => {
    if (!isEditMode) return;
    onOpen();
  };

  const confirmArquivar = async () => {
    const ticketUpdate = { _id: ticket._id, status: "arquivado" };
    const sucesso = await salvarTicket(ticketUpdate);

    if (sucesso) {
      closeModal();
    }
    onClose();
  };

  return (
    <>
      <ModalFooter display="flex" justifyContent="space-between" pt={4}>
        {isEditMode && (
          <ButtonGroup spacing={4}>
            <Button onClick={handleApprove} colorScheme="green" leftIcon={<FaCheck />}>
              Aprovar Ticket
            </Button>
            <Button onClick={handleReject} colorScheme="red" leftIcon={<FaTimes />}>
              Recusar Ticket
            </Button>
            <Button onClick={handleArquivar} colorScheme="yellow" leftIcon={<FaTrash />}>
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

      {/* AlertDialog para confirmação de arquivamento */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Arquivamento
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Tem certeza que deseja arquivar este ticket? Essa ação não pode ser desfeita.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="yellow" onClick={confirmArquivar} ml={3}>
                Arquivar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default TicketActions;
