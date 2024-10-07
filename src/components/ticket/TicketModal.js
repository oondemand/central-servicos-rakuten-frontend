// src/components/TicketModal/TicketModal.js

import React, { useState, useEffect } from "react";
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
  Select,
  useToast,
  Flex,
  Box,
  ButtonGroup,
  useColorMode,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useEtapa } from "../../contexts/EtapaContext";
import PrestadorForm from "../PrestadorForm";
import ServicoForm from "../ServicoForm";


const validationSchema = Yup.object({
  titulo: Yup.string().required("Título é obrigatório"),
  observacao: Yup.string().required("Observação é obrigatória"),
  prestador: Yup.object({
    nome: Yup.string().required("Nome do prestador é obrigatório"),
    tipo: Yup.string()
      .oneOf(["pj", "pf"], "Tipo inválido")
      .required("Tipo é obrigatório"),
    documento: Yup.string()
      .required("Documento é obrigatório"),
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    status: Yup.string()
      .oneOf(
        ["ativo", "em-analise", "pendente-de-revisao", "inativo", "arquivado"],
        "Status inválido"
      )
      .required("Status é obrigatório"),
  }),

  servico: Yup.object({
    descricao: Yup.string().required("Descrição do serviço é obrigatória"),
    valor: Yup.number()
      .typeError("Valor deve ser um número")
      .positive("Valor deve ser positivo")
      .required("Valor é obrigatório"),
    data: Yup.date().required("Data é obrigatória"),
    status: Yup.string()
      .oneOf(["ativo", "arquivado"], "Status inválido")
      .required("Status é obrigatório"),
  }),
});

const TicketModal = ({ isOpen, closeModal, ticket = null }) => {
  const isEditMode = Boolean(ticket);
  const {
    salvarTicket,
    alterarStatusTicket,
    aprovacaoTicket,
    deletarTicket,
    listaTickets,
    SalvarPrestador,
    SalvarServico
  } = useTicket();
  const { baseSelecionada } = useBaseOmie();
  const toast = useToast();
  const { listaEtapas } = useEtapa();

  // Estado para o status do ticket
  const [status, setStatus] = useState(isEditMode ? ticket.status : "aguardando-inicio");

  // Configuração do Formik
  const formik = useFormik({
    initialValues: {
      titulo: isEditMode ? ticket.titulo : "",
      observacao: isEditMode ? ticket.observacao : "",
      prestador: {
        nome: isEditMode ? ticket.prestador.nome : "",
        tipo: isEditMode ? ticket.prestador.tipo : "",
        documento: isEditMode ? ticket.prestador.documento : "",
        email: isEditMode ? ticket.prestador.email : "",
        status: isEditMode ? ticket.prestador.status : "ativo",
      },

      servico: {
        descricao: isEditMode ? ticket.servico.descricao : "",
        valor: isEditMode ? ticket.servico.valor : "",
        data: isEditMode ? ticket.servico.data : "",
        status: isEditMode ? ticket.servico.status : "ativo",
      },
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      if (isEditMode) {
        const updatedTicket = {
          ...ticket,
          titulo: values.titulo,
          observacao: values.observacao,
          status, // Atualiza o status do ticket
          prestador: values.prestador,
   
          servico: values.servico,
        };
        const sucesso = await salvarTicket(updatedTicket);
        setSubmitting(false);
        if (sucesso) {
          toast({
            title: "Ticket atualizado com sucesso!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          closeModal();
        }
      } else {
        const newTicket = {
          baseOmie: baseSelecionada._id,
          etapa: listaEtapas[0].codigo,
          titulo: values.titulo,
          observacao: values.observacao,
          status: "aguardando-inicio",
          // servico: values.servico,
          // prestador: values.prestador,

        };
      //  const sucesso = await salvarTicket(newTicket);
        const sucesso2 = await SalvarServico(values.servico);
        
      //  const sucesso1 = await SalvarPrestador(values.prestador);

        //console.log(sucesso2,sucesso1)

        setSubmitting(false);
        if (sucesso2) closeModal();
      }
    },
  });

  const handleApprove = async () => {
    if (!isEditMode) return;
    toast.closeAll();
    const sucesso = await aprovacaoTicket(ticket._id, true); // Aprovar o ticket
    if (sucesso) {
      toast({
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
    toast.closeAll();
    const sucesso = await aprovacaoTicket(ticket._id, false); // Recusar o ticket
    if (sucesso) {
      toast({
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
    const confirmDelete = window.confirm(
      "Tem certeza que deseja arquivar este ticket?"
    );
    if (!confirmDelete) return;

    const ticketUpdate = { _id: ticket._id, status: "arquivado" };
    const sucesso = await salvarTicket(ticketUpdate);

    if (sucesso) {
      toast({
        title: "Ticket arquivado com sucesso!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isEditMode) return;
    setStatus(newStatus); // Atualiza o status localmente
    await alterarStatusTicket(ticket._id, newStatus);
  };

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (isOpen && colorMode !== "dark") {
      toggleColorMode();
    }
  }, [isOpen, colorMode, toggleColorMode]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? "Editar Ticket" : "Adicionar Novo Ticket"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit} style={{ height: '720px', overflowY: 'scroll', overflowX: 'hidden' }}>
            <Flex justifyContent="space-between" width="100%">
              <Flex flex={isEditMode ? "0 0 70%" : "100%"} flexDirection="column">
                {/* Campos Título e Observação */}
                <FormControl
                  mb={4}
                  isInvalid={formik.errors.titulo && formik.touched.titulo}
                >
                  <FormLabel>Título do Ticket</FormLabel>
                  <Input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formik.values.titulo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Título do Ticket"
                  />
                  {formik.touched.titulo && formik.errors.titulo ? (
                    <Box color="red.500" mt={1}>
                      {formik.errors.titulo}
                    </Box>
                  ) : null}
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={formik.errors.observacao && formik.touched.observacao}
                >
                  <FormLabel>Observação</FormLabel>
                  <Textarea
                    id="observacao"
                    name="observacao"
                    value={formik.values.observacao}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    placeholder="Observação do Ticket"
                  />
                  {formik.touched.observacao && formik.errors.observacao ? (
                    <Box color="red.500" mt={1}>
                      {formik.errors.observacao}
                    </Box>
                  ) : null}
                </FormControl>

                {/* Accordions para Prestador e Serviço */}
                <PrestadorForm formik={formik} />
                <ServicoForm formik={formik} />
              </Flex>

              {/* Se for modo de edição, exibir os botões de status à direita */}
              {isEditMode && (
                <FormControl mb={3} flex="0 0 25%">
                  <FormLabel>Status</FormLabel>
                  <Flex flexDirection={"column"} gap={2}>
                    <Button
                      onClick={() => handleStatusChange("aguardando-inicio")}
                      colorScheme={status === "aguardando-inicio" ? "yellow" : "gray"}
                      mb={2}
                    >
                      Aguardando Início
                    </Button>
                    <Button
                      onClick={() => handleStatusChange("trabalhando")}
                      colorScheme={status === "trabalhando" ? "green" : "gray"}
                      mb={2}
                    >
                      Trabalhando
                    </Button>
                    <Button
                      onClick={() => handleStatusChange("revisao")}
                      colorScheme={status === "revisao" ? "red" : "gray"}
                    >
                      Revisão
                    </Button>
                  </Flex>
                </FormControl>
              )}
            </Flex>

            {/* Botões de Aprovação/Rejeição/Arquivamento */}
            <ModalFooter display={"flex"} justifyContent={"space-between"} pt={20}>
              {isEditMode && (
                <ButtonGroup spacing={4}>
                  <Button
                    onClick={handleApprove}
                    colorScheme="green"
                    leftIcon={<FaCheck />}
                  >
                    Aprovar Ticket
                  </Button>
                  <Button
                    onClick={handleReject}
                    colorScheme="red"
                    leftIcon={<FaTimes />}
                  >
                    Recusar Ticket
                  </Button>
                  <Button
                    onClick={handleArquivar}
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FaTrash />}
                  >
                    Arquivar Ticket
                  </Button>
                </ButtonGroup>
              )}
              <ButtonGroup>
                <Button onClick={closeModal} colorScheme="gray">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={formik.isSubmitting}
                >
                  {isEditMode ? "Salvar Alterações" : "Salvar"}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TicketModal;
