import {
  Box,
  Heading,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

import {
  listarUsuarios,
  excluirUsuario,
  enviarConvite,
} from "../../services/usuariosService";
import { UsuarioForm } from "./form";
import { UsuarioCard } from "./usuarioCard";

import {
  adicionarUsuario,
  alterarUsuario,
} from "../../services/usuariosService";

export const UsuariosList = () => {
  const defaultValues = {
    tipo: "central",
    nome: "",
    email: "",
    senha: "",
    status: "ativo",
  };

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const [usuarios, setUsuarios] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [valoresIniciais, setValoreIniciais] = useState(defaultValues);

  const fetchUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      toast({
        title: "Erro ao buscar Usuários.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await excluirUsuario(itemToDelete);
      toast({
        title: "Usuário excluído com sucesso!",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      fetchUsuarios();
    } catch (error) {
      toast({
        title: "Erro ao excluir Usuário.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    onAlertClose();
  };

  const onSubmitAdd = async (values) => {
    try {
      await adicionarUsuario(values);
      toast({
        title: "Usuário adicionado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchUsuarios();
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao adicionar usuário.",
        description: "Não foi possível adicionar usuário",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmitEdit = async (item) => {
    try {
      const { senha, ...rest } = item;

      await alterarUsuario(item._id, rest);

      toast({
        title: "Usuário atualizado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchUsuarios();
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao atualizar Usuário.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (usuario) => {
    const values = Object.assign(valoresIniciais, usuario);
    setValoreIniciais(values);
    setIsEditMode(true);
    onOpen();
  };

  const handleInvite = async (usuario) => {
    console.log(usuario._id);

    try {
      await enviarConvite(usuario._id);

      toast({
        title: "Contive enviado",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Ouve um erro ao enviar convite",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <>
      <Flex justifyContent="space-between">
        <Heading as="h3" color="gray.950" fontSize="xl" mb={4}>
          Configurações Gerais
        </Heading>
        <Button
          colorScheme="brand"
          onClick={() => {
            setValoreIniciais(defaultValues);
            setIsEditMode(false);
            onOpen();
          }}
        >
          Criar usuário
        </Button>
      </Flex>

      <Box p="6" shadow="sm">
        <Text fontSize="2xl" color="gray.950" fontWeight="bold">
          Usuários
        </Text>
        {usuarios &&
          usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario._id}
              usuario={usuario}
              onEdit={handleEdit}
              onDelete={(id) => {
                onAlertOpen();
                setItemToDelete(id);
              }}
              onInvite={handleInvite}
            />
          ))}
      </Box>

      <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Atualizar usuário" : "Criar usuário"}
          </ModalHeader>
          <ModalBody>
            <UsuarioForm
              valoresIniciais={valoresIniciais}
              onClose={onClose}
              formId="usuarios-form"
              isEditMode={isEditMode}
              onSubmit={isEditMode ? onSubmitEdit : onSubmitAdd}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              form="usuarios-form"
              colorScheme="blue"
              mr="3"
              type="submit"
            >
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} onClose={onAlertClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Exclusão
            </AlertDialogHeader>
            <AlertDialogBody>
              {`Tem certeza que deseja excluir "${
                itemToDelete?.nome || "Este item"
              }"? Essa ação não pode ser desfeita.`}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onAlertClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
