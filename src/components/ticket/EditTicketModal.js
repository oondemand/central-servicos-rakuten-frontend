import React, { useState } from "react";
import { useTicket } from "../../contexts/TicketContext";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

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
} from "@chakra-ui/react";
import { useBaseOmie } from "../../contexts/BaseOmieContext";

const EditTicketModal = ({ ticket, closeModal }) => {
  const { alterarStatusTicket, editarTicket, aprovarTicket, recusarTicket, adicionarTicket } = useTicket();
  const { listaBases, baseSelecionada } = useBaseOmie();

  const [titulo, setTitulo] = useState(ticket.titulo);
  const [observacao, setObservacao] = useState(ticket.observacao);
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState({
    save: false,
    approve: false,
    reject: false,
  });
console.log(baseSelecionada,"baseSelecionada")
  const handleSave = async () => {
    setLoading(prev => ({ ...prev, save: true }));
    const updatedTicket = prepareTicketData({ baseOmie: baseSelecionada, ...ticket, titulo, observacao, status });
    const sucesso = await editarTicket(ticket._id, updatedTicket);
    setLoading(prev => ({ ...prev, save: false }));
    if (sucesso) closeModal();
  };

  const handleApprove = async () => {
    setLoading(prev => ({ ...prev, approve: true }));
    const sucesso = await aprovarTicket(ticket._id);
    setLoading(prev => ({ ...prev, approve: false }));
    if (sucesso) closeModal();
  };

  const handleReject = async () => {
    setLoading(prev => ({ ...prev, reject: true }));
    const sucesso = await recusarTicket(ticket._id);
    setLoading(prev => ({ ...prev, reject: false }));
    if (sucesso) closeModal();
  };

  const prepareTicketData = (ticket) => {
    const { _id, createdAt, updatedAt, __v, ...cleanedTicket } = ticket;
    return {
      ...cleanedTicket,
    };
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await alterarStatusTicket(ticket._id, newStatus);
  };

  return (
    <Modal isOpen={!!ticket} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhe do Ticket</ModalHeader>
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
          <ButtonGroup spacing={4} mb={4}>
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
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeModal} colorScheme="gray" mr={3}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            colorScheme="blue"
            isLoading={loading.save}
          >
            Salvar
          </Button>
          <Button
            onClick={handleApprove}
            colorScheme="green"
            isLoading={loading.approve}
            leftIcon={<FaCheck />}
          >
            Aprovar Ticket
          </Button>
          <Button
            onClick={handleReject}
            colorScheme="red"
            isLoading={loading.reject}
            leftIcon={<FaTimes />}
          >
            Recusar Ticket
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTicketModal;
