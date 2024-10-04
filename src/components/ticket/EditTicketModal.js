import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTicket } from "../../contexts/TicketContext";

const EditTicketModal = ({ ticket, closeModal }) => {
  const { alterarStatusTicket, aprovacaoTicket, deletarTicket, salvarTicket } = useTicket();
  const [titulo, setTitulo] = useState(ticket.titulo);
  const [observacao, setObservacao] = useState(ticket.observacao);
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState({
    save: false,
    approve: false,
    reject: false,
    delete: false,
  });

  const toast = useToast();

  const handleSave = async () => {
    setLoading((prev) => ({ ...prev, save: true }));
    const updatedTicket = { ...ticket, titulo, observacao, status };
    const sucesso = await salvarTicket(updatedTicket);
    setLoading((prev) => ({ ...prev, save: false }));
    if (sucesso) {
      toast({
        title: "Ticket salvo com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    }
  };

  const handleApprove = async () => {
    setLoading((prev) => ({ ...prev, approve: true }));
    const sucesso = await aprovacaoTicket(ticket._id, true); // Aprovar o ticket
    setLoading((prev) => ({ ...prev, approve: false }));
    if (sucesso) closeModal();
  };

  const handleReject = async () => {
    setLoading((prev) => ({ ...prev, reject: true }));
    const sucesso = await aprovacaoTicket(ticket._id, false); // Recusar o ticket
    setLoading((prev) => ({ ...prev, reject: false }));
    if (sucesso) closeModal();
  };

  const handleDelete = async () => {
    // Confirmação antes de deletar
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este ticket?");
    if (!confirmDelete) return;

    setLoading((prev) => ({ ...prev, delete: true }));
    const sucesso = await deletarTicket(ticket._id);
    setLoading((prev) => ({ ...prev, delete: false }));
    if (sucesso) closeModal();
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await alterarStatusTicket(ticket._id, newStatus);
  };

  return (
    <Modal isOpen={!!ticket} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Título do ticket</FormLabel>
            <Input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Observação</FormLabel>
            <Textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Status</FormLabel>
            <ButtonGroup spacing={4}>
              <Button
                onClick={() => handleStatusChange("aguardando-inicio")}
                colorScheme={status === "aguardando-inicio" ? "yellow" : "gray"}
              >
                Aguardando Início
              </Button>
              <Button
                onClick={() => handleStatusChange("trabalhando")}
                colorScheme={status === "trabalhando" ? "green" : "gray"}
              >
                Trabalhando
              </Button>
              <Button
                onClick={() => handleStatusChange("revisao")}
                colorScheme={status === "revisao" ? "red" : "gray"}
              >
                Revisão
              </Button>
            </ButtonGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter display={"block"}>
          <div>     
            <Button
            onClick={handleApprove}
            colorScheme="green"
            isLoading={loading.approve}
            leftIcon={<FaCheck />}
            mr={2}
          >
            Aprovar Ticket
          </Button>
          <Button
            onClick={handleReject}
            colorScheme="red"
            isLoading={loading.reject}
            leftIcon={<FaTimes />}
            mr={2}
          >
            Recusar Ticket
          </Button>
          <Button
            onClick={handleDelete}
            colorScheme="red"
            variant="outline"
            isLoading={loading.delete}
            leftIcon={<FaTrash />}
          >
            Deletar Ticket
          </Button>
          </div>

          <Button onClick={closeModal} colorScheme="gray" mr={3} mt={3}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            colorScheme="blue"
            isLoading={loading.save}
            mr={2}
            mt={3}
          >
            Salvar
          </Button>
     
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTicketModal;
