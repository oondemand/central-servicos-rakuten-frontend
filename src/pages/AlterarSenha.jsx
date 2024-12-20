import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  VStack,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { login as loginService, criarNovaSenha } from "../services/authService";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorUtils";

const LoginSchema = Yup.object().shape({
  novaSenha: Yup.string()
    .min(6, "A senha precisa ter no mínimo 6 caracteres")
    .required("Nova senha é obrigatório"),
  confirmacao: Yup.string()
    .oneOf([Yup.ref("novaSenha")], "As senhas precisam ser iguais")
    .required("Confirmação é obrigatória"),
});

const AlterarSenha = () => {
  const { login } = useAuth();

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("code");
    if (token) {
      localStorage.setItem("code", token);
      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (values) => {
    try {
      const { token, usuario } = await criarNovaSenha(values);

      if (usuario.tipo === "central" || usuario.tipo === "admin") {
        login(token, usuario);
        localStorage.removeItem("code");
        return navigate("/auth/home");
      }

      toast.error("Usuário não tem permissões para acessar a CST!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error) || "Erro ao fazer login";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg="brand.50"
    >
      <Box
        width={{ base: "90%", md: "800px" }}
        height={{ base: "595px" }}
        display="flex"
        boxShadow="lg"
        borderRadius="md"
        overflow="hidden"
      >
        <Box
          flex="1"
          p={10}
          bg="brand.500"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Flex gap="4" align="center" justify="flex-center">
            <Text as="div" fontSize="md" color="white">
              Central de Serviços
            </Text>

            <img src="/logo_rakuten.png" alt="RAKUTEN" />
          </Flex>
        </Box>

        <Flex
          direction={"column"}
          flex="1"
          p={10}
          bg="white"
          justifyContent={"center"}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading mb={2} color="brand.500" size="md" textAlign="center">
              Bem vindo(a) :)
            </Heading>
            <Text mb={4} color="brand.500" textAlign="center">
              Crie sua nova senha para acessar a Central de Serviços Rakuten.
            </Text>
          </Box>

          <Formik
            initialValues={{
              novaSenha: "",
              confirmacao: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting }) => {
              return (
                <Form>
                  <VStack spacing={8} align="flex-start">
                    <FormControl
                      isInvalid={errors.novaSenha && touched.novaSenha}
                      position="relative"
                    >
                      <FormLabel
                        htmlFor="novaSenha"
                        color="brand.500"
                        fontWeight={400}
                      >
                        Nova senha
                      </FormLabel>

                      <Field
                        as={Input}
                        id="novaSenha"
                        name="novaSenha"
                        type="novaSenha"
                      />

                      <FormErrorMessage
                        position="absolute"
                        top="100%"
                        left="0"
                        mt="4px"
                        color="red.500"
                        fontSize="xs"
                      >
                        {errors.novaSenha}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.confirmacao && touched.confirmacao}
                      position="relative"
                    >
                      <FormLabel
                        htmlFor="confirmacao"
                        color="brand.500"
                        fontWeight={400}
                      >
                        Confirme sua nova senha
                      </FormLabel>
                      <Field
                        as={Input}
                        id="confirmacao"
                        name="confirmacao"
                        type="password"
                      />
                      <FormErrorMessage
                        position="absolute"
                        top="100%"
                        left="0"
                        mt="4px"
                        color="red.500"
                        fontSize="xs"
                      >
                        {errors.confirmacao}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      width="full"
                      color={"white"}
                      background={"#0BC5EA"}
                    >
                      Confirmar
                    </Button>
                  </VStack>
                </Form>
              );
            }}
          </Formik>

          <ToastContainer />
        </Flex>
      </Box>
    </Flex>
  );
};

export default AlterarSenha;
