import {
  useToast,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

import { useMemo, useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { prestadoresFields } from "./fields";
import { Build } from "../../components/common/buildForm/build";
import api from "../../services/api";
import { VisibilityControlDialog } from "../../components/common/visibilityControllerDialog";
import { useVisibleInputForm } from "../../contexts/useVisibleInputForms";

export const PrestadoresDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();

  const [data, setData] = useState(null);
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "PRESTADORES",
  });

  const { mutateAsync: updatePrestadorMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await api.patch(`prestadores/${data._id}`, body),
    onSuccess(data) {
      setData((prev) => data.data.prestador);
      // toast({
      //   title: "Prestador atualizado com sucesso",
      //   status: "success",
      // });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao atualizar o prestador",
        status: "error",
      });
    },
  });

  const { mutateAsync: createPrestadorMutation } = useMutation({
    mutationFn: async ({ body }) => await api.post(`prestadores`, body),
    onSuccess(data) {
      setData((prev) => data.data.prestador);

      toast({
        title: "Prestador criado com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao criar um prestador",
        status: "error",
      });
    },
  });

  const onSubmit = async (values) => {
    const body = {
      ...values,

      dadosBancarios: {
        tipoConta: values?.dadosBancarios?.tipoConta?.value,
        banco: values?.dadosBancarios?.banco?.value,
        ...values.dadosBancarios,
      },
    };

    console.log("BODY", body);

    if (!data) {
      return await createPrestadorMutation({ body });
    }

    return await updatePrestadorMutation({ id: data._id, body });
  };

  const fields = useMemo(() => prestadoresFields(), []);

  function onCloseModal() {
    queryClient.refetchQueries(["listar-prestadores"]);
    setData();
    onClose();
  }

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
        _hover={{ backgroundColor: "brand.50" }}
      >
        Criar prestador
      </Button>

      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          onClose={onCloseModal}
          leastDestructiveRef={cancelRef}
          isCentered
          size="6xl"
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader
                display="flex"
                gap="2"
                alignItems="center"
                fontSize="lg"
                fontWeight="bold"
              >
                Criar prestador
                <VisibilityControlDialog
                  fields={fields}
                  setVisibilityState={setInputsVisibility}
                  visibilityState={inputsVisibility}
                  title="Ocultar coluna"
                />
              </AlertDialogHeader>
              <AlertDialogBody pb="8">
                <Build
                  visibleState={inputsVisibility}
                  fields={fields}
                  gridColumns={4}
                  gap={6}
                  data={data}
                  onSubmit={onSubmit}
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
