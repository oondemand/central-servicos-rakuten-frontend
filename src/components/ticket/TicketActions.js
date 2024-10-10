// src/components/ticket/TicketActions.js
import React, { useRef } from "react";
import {
  ButtonGroup,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTicket } from "../../contexts/TicketContext";
import { useFormikContext } from "formik";

const TicketActions = ({ ticket, isEditMode, closeModal }) => {
  const { salvarTicket, aprovarTicket, reprovarTicket } = useTicket();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const formik = useFormikContext(); // Obtém o contexto do Formik

  const handleApprove = async () => {
    if (!isEditMode) return;
    try {
      const sucesso = await aprovarTicket(ticket._id);
      if (sucesso) {
        closeModal();
      }
    } catch (error) {
      console.error("Erro ao aprovar ticket:", error);
      // Opcional: Adicionar feedback ao usuário
    }
  };

  const handleReject = async () => {
    if (!isEditMode) return;
    try {
      const sucesso = await reprovarTicket(ticket._id);
      if (sucesso) {
        closeModal();
      }
    } catch (error) {
      console.error("Erro ao recusar ticket:", error);
      // Opcional: Adicionar feedback ao usuário
    }
  };

  const handleArquivar = () => {
    if (!isEditMode) return;
    onOpen();
  };

  const confirmArquivar = async () => {
    try {
      const ticketUpdate = { _id: ticket._id, status: "arquivado" };
      const sucesso = await salvarTicket(ticketUpdate);

      if (sucesso) {
        closeModal();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao arquivar ticket:", error);
      // Opcional: Adicionar feedback ao usuário
    }
  };

  return (
    <>
      <Flex justifyContent="space-between" width="100%">
        <ButtonGroup spacing={4}>
          {isEditMode && (
            <>
              <Button onClick={handleApprove} colorScheme="green" leftIcon={<FaCheck />}>
                Aprovar Ticket
              </Button>
              <Button onClick={handleReject} colorScheme="red" leftIcon={<FaTimes />}>
                Recusar Ticket
              </Button>
              <Button onClick={handleArquivar} colorScheme="yellow" leftIcon={<FaTrash />}>
                Arquivar Ticket
              </Button>
            </>
          )}
        </ButtonGroup>
        <ButtonGroup spacing={4}>
          <Button bg="gray.500" color="white" onClick={closeModal}>
            Cancelar
          </Button>
          <Button type="submit" colorScheme="brand" isLoading={formik.isSubmitting}>
            {isEditMode ? "Salvar Alterações" : "Salvar"}
          </Button>
        </ButtonGroup>
      </Flex>

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
