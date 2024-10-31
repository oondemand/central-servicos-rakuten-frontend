import { useFormikContext } from "formik";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";

import React, { useState } from "react";

import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { useTicket } from "../../contexts/TicketContext";

export const FilesViewComponent = () => {
  const { removerArquivoDoTicket } = useTicket();
  const { values, setFieldValue } = useFormikContext();

  const [deleteFileConfirmationDialog, setDeleteFileConfirmationDialog] =
    useState({
      isOpen: false,
      fileId: "",
    });

  const handleRemoveFileFromTicket = async () => {
    const response = await removerArquivoDoTicket(
      deleteFileConfirmationDialog.fileId
    );
    setDeleteFileConfirmationDialog({ fileId: "", isOpen: false });
    if (response.status === 200) {
      const fileWithoutDeleted = values.arquivos.filter(
        (file) => file._id !== deleteFileConfirmationDialog.fileId
      );
      setFieldValue("arquivos", fileWithoutDeleted);
    }
  };

  if (values.length === 0) return;

  return (
    <Box my={2}>
      {values.arquivos.length > 0 && (
        <Text fontSize="md" fontWeight="normal" mt={5} mb={5}>
          Arquivos
        </Text>
      )}

      {values.arquivos.map((e, i) => {
        return (
          <Flex key={e._id} justify="space-between" align="center">
            <Text>{e.nomeOriginal}</Text>
            <Flex gap={2} align="center">
              <a
                href={`${import.meta.env.VITE_API_URL}/${e.path}`}
                download={e.nomeOriginal}
              >
                <IconButton size="xs" colorScheme="green">
                  <DownloadIcon />
                </IconButton>
              </a>

              <IconButton
                size="xs"
                colorScheme="red"
                onClick={() => {
                  setDeleteFileConfirmationDialog((prev) => ({
                    isOpen: true,
                    fileId: e._id,
                  }));
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Flex>
          </Flex>
        );
      })}

      <AlertDialog
        isOpen={deleteFileConfirmationDialog.isOpen}
        onClose={() =>
          setDeleteFileConfirmationDialog({ fileId: "", isOpen: false })
        }
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Remoção de Arquivo
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza de que deseja remover o arquivo? Esta ação não pode
              ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() =>
                  setDeleteFileConfirmationDialog({ fileId: "", isOpen: false })
                }
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleRemoveFileFromTicket}
                ml={3}
              >
                Remover
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
