import {
  Box,
  Text,
  useToast,
  Flex,
  Spinner,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { ServicosForm } from "./servicosForm";

import { useMutation } from "@tanstack/react-query";
import api from "../../services/api";
import { queryClient } from "../../App";

export const ServicosDialogForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();

  const [data, setData] = useState(null);

  const { mutateAsync: updateServicoMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await api.patch(`servicos/${data._id}`, body),
    onSuccess(data) {
      setData((prev) => data.data.servico);
      queryClient.refetchQueries(["listar-servicos"]);
      toast({
        title: "Servico atualizado com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao atualizar o serviço",
        status: "error",
      });
    },
  });

  const { mutateAsync: createServicoMutation } = useMutation({
    mutationFn: async ({ body }) => await api.post(`servicos`, body),
    onSuccess(data) {
      setData((prev) => data.data.servico);
      queryClient.refetchQueries(["listar-servicos"]);
      toast({
        title: "Serviço criado com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao criar um serviço",
        status: "error",
      });
    },
  });

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        size="sm"
        variant="subtle"
        color="brand.500"
        fontWeight="semibold"
      >
        Criar serviço
      </Button>

      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          leastDestructiveRef={cancelRef}
          isCentered
          size="6xl"
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Detalhes do serviço
              </AlertDialogHeader>
              <AlertDialogBody pb="8">
                <ServicosForm
                  data={data}
                  onBlurFn={
                    data ? updateServicoMutation : createServicoMutation
                  }
                />
              </AlertDialogBody>
              <AlertDialogCloseButton />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};
