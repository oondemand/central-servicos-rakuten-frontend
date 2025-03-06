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
import { servicosFields } from "./fields";
import { Build } from "../../components/common/buildForm/build";
import api from "../../services/api";
import { VisibilityControlDialog } from "../../components/common/visibilityControllerDialog";
import { useVisibleInputForm } from "../../contexts/useVisibleInputForms";

export const ServicosDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();

  const [data, setData] = useState(null);
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "SERVICOS",
  });

  const { mutateAsync: updateServicoMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await api.patch(`servicos/${data._id}`, body),
    onSuccess(data) {
      setData((prev) => data.data.servico);
      // toast({
      //   title: "Servico atualizado com sucesso",
      //   status: "success",
      // });
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

  const onSubmit = async (values) => {
    const competencia = values?.competencia.split("/");
    const mes = Number(competencia?.[0]) || null;
    const ano = Number(competencia?.[1]) || null;

    const body = {
      ...values,
      prestador: values.prestador.value,
      campanha: values?.campanha?.value,
      tipoDocumentoFiscal: values?.tipoDocumentoFiscal?.value,
      competencia: {
        mes,
        ano,
      },
    };

    if (!data) {
      return await createServicoMutation({ body });
    }

    return await updateServicoMutation({ id: data._id, body });
  };

  const fields = servicosFields();

  function onCloseModal() {
    queryClient.refetchQueries(["listar-servicos"]);
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
      >
        Criar serviço
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
                Criar serviço
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
