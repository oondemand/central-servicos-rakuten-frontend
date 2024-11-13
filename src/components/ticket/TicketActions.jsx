import { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoFileTrayStacked } from "react-icons/io5";
import { useFormikContext } from "formik";
import { useTicket } from "../../contexts/TicketContext";

const TicketActions = ({
  abrirPainelPrestador,
  ticket,
  isEditMode,
  closeModal,
  onCancel,
  cancelar,
}) => {
  const formik = useFormikContext();

  const { salvarTicket, aprovarTicket, reprovarTicket } = useTicket();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const cancelRef = useRef();

  const [acao, setAcao] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSaveClick = async () => {
    const errors = await formik.validateForm();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      if (errors.prestador) {
        abrirPainelPrestador(); 
      }
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    } else {
      formik.handleSubmit();
    }
  };

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
        cancelar();
        // toast.success(`Ticket ${acao}do com sucesso!`);
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
                _hover={{ bg: "green.400" }}
                bg="green.success"
                rightIcon={<FaCheck />}
              >
                Aprovar NFSe
              </Button>
              <Button
                onClick={() => handleActionClick("reprovar")}
                colorScheme="red"
                rightIcon={<FaTimes />}
              >
                Recusar NFSe
              </Button>
              <Button
                onClick={() => handleActionClick("arquivar")}
                _hover={{ bg: "#5a6268" }}
                colorScheme="white"
                bg="#6C757D"
                rightIcon={<IoFileTrayStacked />}
              >
                Arquivar
              </Button>
            </>
          )}
        </ButtonGroup>

        <ButtonGroup spacing={4}>
          <Button
            bg="#89898B"
            color="white"
            _hover={{ bg: "#808080" }}
            onClick={cancelar}
          >
            Cancelar
          </Button>
          <Tooltip
            label="Há erros no formulário. Por favor, corrija-os antes de salvar."
            isOpen={showTooltip}
            placement="top"
            hasArrow
            bg="yellow.400"
            color="white"
            textAlign="center"
          >
            <Button
              type="submit"
              colorScheme="brand"
              bg="blue.500"
              isLoading={formik.isSubmitting}
              onClick={handleSaveClick}
            >
              {isEditMode ? "Salvar" : "Salvar"}
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Flex>

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
