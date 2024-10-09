// src/components/common/CrudList.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  Flex,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import CrudModal from './CrudModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from './FormField';

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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationSchema),
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

  const handleEdit = (item) => {
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

  return (
    <Box p={6} rounded="md" shadow="md">
      {/* Cabeçalho com título e botão de criação */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">{title}</Text>
        <Button colorScheme="blue" onClick={() => { formik.resetForm(); setIsEditMode(false); onOpen(); }}>
          Criar Novo
        </Button>
      </Flex>

      {/* Lista de itens */}
      <List spacing={3}>
        {items.map((item) => (
          <ListItem
            key={item._id}
            p={4}
            rounded="md"
            shadow="sm"
          >
            <Flex justify="space-between" align="center">
              <Box>
                {formFields.map(({ label, name }) => (
                  <Text key={name}>
                    <strong>{capitalizeFirstLetter(label)}:</strong> {getNestedValue(item, name)}
                  </Text>
                ))}
              </Box>
              <Flex>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  mr={2}
                  onClick={() => handleEdit(item)}
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
        onClose={() => { formik.resetForm(); setIsEditMode(false); onClose(); }}
        title={isEditMode ? `Editar ${title.slice(0, -1)}` : `Criar ${title.slice(0, -1)}`}
        onSubmit={formik.handleSubmit}
      >
        <Box>
          {formFields.map(({ label, name, type, options }) => (
            <FormField
              key={name}
              label={label}
              name={name}
              type={type}
              options={options}
              touched={formik.touched}
              errors={formik.errors}
            />
          ))}
        </Box>
      </CrudModal>

      {/* AlertDialog para confirmação de exclusão */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          onAlertClose();
          setItemToDelete(null);
        }}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Exclusão
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Tem certeza que deseja excluir "${itemToDelete?.nome || 'Este item'}"? Essa ação não pode ser desfeita.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => {
                onAlertClose();
                setItemToDelete(null);
              }}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

// Função auxiliar para capitalizar a primeira letra
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Função auxiliar para acessar valores aninhados usando notação de ponto (ex: "prestador.nome")
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export default CrudList;
