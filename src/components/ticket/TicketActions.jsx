// src/components/ticket/TicketActions.js
import React, { useRef, useState } from "react";
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

const TicketActions = ({
  ticket,
  isEditMode,
  closeModal,
  onCancel,
  cancelar,
}) => {
  const formik = useFormikContext();
  const { salvarTicket, aprovarTicket, reprovarTicket } = useTicket();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [acao, setAcao] = useState(null);

  const handleConfirmAction = async () => {
    if (!isEditMode || !acao) return;

    try {
      let sucesso = false;

      if (acao === "aprovar") {
        sucesso = await aprovarTicket(ticket._id);
      } else if (acao === "reprovar") {
        sucesso = await reprovarTicket(ticket._id);
      } else if (acao === "arquivar") {
        const ticketUpdate = { _id: ticket._id, status: "arquivado" };
        sucesso = await salvarTicket(ticketUpdate);
      }

      if (sucesso) {
        closeModal();
        toast.success(`Ticket ${acao}do com sucesso!`);
      }
    } catch (error) {
      console.error(`Erro ao ${acao} ticket:`, error);
      toast.error(`Erro ao ${acao} o ticket. Tente novamente.`);
    } finally {
      onClose();
      setAcao(null);
    }
  };

  const handleActionClick = (acao) => {
    setAcao(acao);
    onOpen();
  };

  return (
    <>
      <Flex justifyContent="space-between" width="100%">
        <ButtonGroup spacing={4}>
          {isEditMode && (
            <>
              <Button
                onClick={() => handleActionClick("aprovar")}
                colorScheme="green"
                leftIcon={<FaCheck />}
              >
                Aprovar Ticket
              </Button>
              <Button
                onClick={() => handleActionClick("reprovar")}
                colorScheme="red"
                leftIcon={<FaTimes />}
              >
                Recusar Ticket
              </Button>
              <Button
                onClick={() => handleActionClick("arquivar")}
                colorScheme="yellow"
                leftIcon={<FaTrash />}
              >
                Arquivar Ticket
              </Button>
            </>
          )}
        </ButtonGroup>
        <ButtonGroup spacing={4}>
          <Button bg="gray.500" color="white" onClick={cancelar}>
            Cancelar
          </Button>
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={formik.isSubmitting}
          >
            {isEditMode ? "Salvar Alterações" : "Salvar"}
          </Button>
        </ButtonGroup>
      </Flex>

      {/* AlertDialog para confirmação de ações */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar {acao && acao.charAt(0).toUpperCase() + acao.slice(1)}
            </AlertDialogHeader>

            <AlertDialogBody>
              {acao === "aprovar" &&
                "Tem certeza que deseja aprovar este ticket?"}
              {acao === "reprovar" &&
                "Tem certeza que deseja recusar este ticket?"}
              {acao === "arquivar" &&
                "Tem certeza que deseja arquivar este ticket? Essa ação não pode ser desfeita."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme={
                  acao === "aprovar"
                    ? "green"
                    : acao === "reprovar"
                    ? "red"
                    : "yellow"
                }
                onClick={handleConfirmAction}
                ml={3}
              >
                {acao && acao.charAt(0).toUpperCase() + acao.slice(1)}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default TicketActions;
