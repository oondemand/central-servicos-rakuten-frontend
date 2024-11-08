import {importarComissoes } from "../../services/acoesEtapaService"

import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Flex,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Box,
  IconButton,
} from "@chakra-ui/react";

import { DeleteIcon  } from "@chakra-ui/icons";



const ImportacaoComissoes = () => {
  const toast = useToast();
  const inputFileRef = useRef(null);

   // Esquema de validação com Yup
 const validationSchema = Yup.object({
  mes: Yup.string().length(2).required("Campo obrigatório"),
  ano: Yup.string().length(4).required("Campo obrigatório"),
});

  const importCommissions = async (values, { resetForm }) => {
    if (!inputFileRef.current.files[0]) {
      toast({
        title: "Nenhum arquivo selecionado",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    await importarComissoes({
      file: inputFileRef.current.files[0],
      mes: values.mes,
      ano: values.ano
    });

    toast({
      title: "O arquivo foi enviado e está sendo processado!",
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });

    inputFileRef.current.value = null;
    resetForm();
  };

  return (
    <Formik
      initialValues={{ mes: "", ano: "", file: "" }}
      validationSchema={validationSchema}
      onSubmit={importCommissions}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => {
        return (
        <Form>
          <div>
            <FormLabel>Selecione a Planilha de <i>Payment Control</i>:</FormLabel>
            <Flex my={2} gap={4}>
              <FormControl w="20" isInvalid={errors.mes}>
                <Field name="mes">
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="Mês"
                      w="20"
                    />
                  )}
                </Field>
              </FormControl>

              <FormControl w="20" isInvalid={errors.ano}>
                <Field name="ano">
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ano"
                      w="20"
                    />
                  )}
                </Field>
              </FormControl>
            </Flex>
          </div>


          { 
            values.file && (
            <Flex gap={4} alignItems="center"> 
            <Box py={1}><b>Arquivo: </b>{values.file.name}</Box>
            <IconButton
                size="xs"
                colorScheme="gray"
                onClick={() => { 
                  setFieldValue("file", "") 
                  inputFileRef.current.value = null;
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Flex>
            )
          }

          {!values.file && (<Box h={4}></Box>)}

          <Flex gap={2}>
            <Button
              disabled={!values.mes || !values.ano || values.file !== ""}
              onClick={() => inputFileRef.current.click()}
              colorScheme="brand"
            >
              Importar comissões
            </Button>

            <Button type="submit">Enviar</Button>
          </Flex>


          <Input
            type="file"
            ref={inputFileRef}
            onChange={(e) => setFieldValue("file", e.target.files[0])}
            style={{ display: "none" }}
            accept=".xlsx, .xls, .xlsm, .xltx, .xltm, .xlsb"
          />
         
        </Form>
      )}}
    </Formik>
  );
};

export default ImportacaoComissoes;
