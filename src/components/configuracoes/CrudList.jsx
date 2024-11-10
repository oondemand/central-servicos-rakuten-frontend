// src/components/configuracoes/CrudList.js
import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Flex,
  Text,
  useDisclosure,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import CrudModal from "./CrudModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormField from "@/components/common/FormField";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const CrudList = ({
  title,
  items,
  onAdd,
  onEdit,
  onDelete,
  formFields,
  validationSchema,
  initialValues,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentValues, setCurrentValues] = useState(initialValues);

  const openCreateModal = () => {
    setIsEditMode(false);
    const newValues = { ...initialValues };
    delete newValues._id;
    setCurrentValues(newValues);
    onOpen();
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setCurrentValues({ ...item, senha: "" });
    onOpen();
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        await onEdit(values);
      } else {
        await onAdd(values);
      }
      resetForm();
      setIsEditMode(false);
      onClose();
    },
  });

  const handleDelete = async () => {
    if (itemToDelete) {
      await onDelete(itemToDelete._id);
      onAlertClose();
      setItemToDelete(null);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    onAlertOpen();
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (isEditMode) {
      await onEdit(values);
    } else {
      await onAdd(values);
    }
    onClose();
  };

  const getValidationSchema = useCallback(() => {
    return Yup.object({
      nome: Yup.string().required("Nome é obrigatório"),
      email: Yup.string()
        .email("E-mail inválido")
        .required("E-mail é obrigatório"),
      status: Yup.string()
        .oneOf(["ativo", "inativo"], "Status inválido")
        .required("Status é obrigatório"),
      senha: isEditMode
        ? Yup.string() // naao é obrigatório no modo de edição!!!
        : Yup.string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .required("Senha é obrigatória ao criar um novo usuário"),
    });
  }, [isEditMode]);

  return (
    <Box p={6} rounded="md" shadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
        <Button colorScheme="brand" onClick={openCreateModal}>
          Criar Novo
        </Button>
      </Flex>

      {/* Lista de itens */}
      <List spacing={3}>
        {items.map((item) => (
          <ListItem key={item._id} p={4} rounded="md" shadow="sm">
            <Flex justify="space-between" align="center">
              <Box>
                {formFields
                  .filter(({ name }) => name !== "senha")
                  .map(({ label, name }) => (
                    <Text key={name}>
                      <strong>{label}:</strong> {item[name]}
                    </Text>
                  ))}
              </Box>

              <Flex>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  mr={2}
                  onClick={() => openEditModal(item)}
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  colorScheme="yellow"
                  mr={2}
                  isDisabled={true}
                >
                  Editar Senha
                </Button>

                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => confirmDelete(item)}
                >
                  Excluir
                </Button>
              </Flex>
            </Flex>
          </ListItem>
        ))}
      </List>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered
      >
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
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Modal para criação/edição */}
      <CrudModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          isEditMode
            ? `Editar ${title.slice(0, -1)}`
            : `Criar ${title.slice(0, -1)}`
        }
        onSubmit={handleSubmit}
        initialValues={currentValues}
        validationSchema={getValidationSchema()}
        formFields={formFields}
        isEditMode={isEditMode}
      />
    </Box>
  );
};

export default CrudList;
