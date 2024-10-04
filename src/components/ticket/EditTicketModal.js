import React, { useState } from "react";
import { useTicket } from "../../contexts/TicketContext";
import { useToast } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import * as Yup from "yup";
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
  const { alterarStatusTicket, editarTicket, adicionarTicket } = useTicket();
  const { baseSelecionada } = useBaseOmie();
  const toast = useToast();

  const [titulo, setTitulo] = useState(ticket?.titulo || "");
  const [observacao, setObservacao] = useState(ticket?.observacao || "");
  const [status, setStatus] = useState(ticket?.status || "aguardando-inicio");
  const [loading, setLoading] = useState(false);

  const prepareTicketData = () => ({
    baseOmie: baseSelecionada._id,
    ...ticket,
    titulo,
    observacao,
    status,
    etapa: 0,
  });

  const handleSave = async () => {
    setLoading(true);
    const updatedTicket = prepareTicketData();
    
    const ticketSchema = Yup.object().shape({
      titulo: Yup.string().required("Título é obrigatório"),
      observacao: Yup.string().required("Observação é obrigatória"),
    });

    try {
      await ticketSchema.validate(updatedTicket);
      const sucesso = ticket._id
        ? await editarTicket(ticket._id, updatedTicket)
        : await adicionarTicket(updatedTicket);
      if (sucesso) {
        toast({
          title: "Sucesso",
          description: "Ticket salvo com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        closeModal();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.errors ? error.errors[0] : error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Observação</FormLabel>
            <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={3} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeModal} colorScheme="gray" mr={3}>Cancelar</Button>
          <Button onClick={handleSave} colorScheme="blue" isLoading={loading}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTicketModal;

