import React from "react";
import {
  Flex,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

export const TableActions = ({ table, row }) => {
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const cancelRef = React.useRef();

  const handleDeleteActions = async () => {
    await table.options.meta?.deleteData({
      id: row.original._id,
    });

    onAlertClose();
  };

  return (
    <>
      <Flex gap="2">
        <Button
          size="2xs"
          fontSize="sm"
          onClick={onAlertOpen}
          variant="outline"
          px="1"
          py="0.5"
        >
          Excluir
        </Button>
        <Button
          size="2xs"
          fontSize="sm"
          onClick={() => {}}
          variant="outline"
          px="1"
          py="0.5"
        >
          Alterar
        </Button>
      </Flex>

      {isAlertOpen && (
        <AlertDialog
          isOpen={isAlertOpen}
          onClose={onAlertClose}
          leastDestructiveRef={cancelRef}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirmar Exclusão
              </AlertDialogHeader>
              <AlertDialogBody>
                Tem certeza que deseja excluir esse item? Essa ação não pode ser
                desfeita.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleDeleteActions} ml={3}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};
