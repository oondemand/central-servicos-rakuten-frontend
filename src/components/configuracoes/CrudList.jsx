// src/components/configuracoes/CrudList.js
import React, { useState, useRef } from "react";
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
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controle do Modal de criação/edição
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure(); // Controle do AlertDialog de exclusão
  const cancelRef = useRef(); // Referência para o botão de cancelar no AlertDialog
  const [itemToDelete, setItemToDelete] = useState(null); // Item selecionado para exclusão
  const [isEditMode, setIsEditMode] = useState(false); // Estado para determinar o modo do formulário
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
      console.log(values);
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

  const handleEdit = (item) => {
    console.log(item);
    formik.setValues(item);
    setIsEditMode(true);
    onOpen();
  };

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
        validationSchema={validationSchema}
        formFields={formFields}
      />
    </Box>
  );
};

// Função auxiliar para capitalizar a primeira letra
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Função auxiliar para acessar valores aninhados usando notação de ponto (ex: "prestador.nome")
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default CrudList;
