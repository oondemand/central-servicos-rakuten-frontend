import React, { useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
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
import { login as loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorUtils";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: Yup.string().required("Senha é obrigatória"),
});

const Login = () => {
  // console.log("Login");

  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg="brand.50"
    >
      <Box
        width={{ base: "90%", md: "800px" }}
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
          <Text as="div" fontSize="md" textAlign="center">
            Central de Serviços
          </Text>
          <Heading color="white" size="lg" mb={6} textAlign="center">
            Rakuten
          </Heading>
        </Box>

        <Box flex="1" p={10} bg="white">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading mb={6} color="brand.500" size="md" textAlign="center">
              Que bom ter você por aqui! :)
            </Heading>
            <Text mb={4} color="gray.600" textAlign="center">
              Vamos juntos transformar sua rotina com tecnologia.
            </Text>
          </Box>

          <Formik
            initialValues={{
              email: "",
              senha: "",
              general: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={async (values, actions) => {
              try {
                const response = await loginService(values);
                const { token, usuario } = response.data;

                login(token, usuario);
                navigate("/auth/home");
              } catch (error) {
                const errorMessage =
                  getErrorMessage(error) || "Erro ao fazer login";
                actions.setFieldError("general", errorMessage);
              }
              actions.setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => {
              useEffect(() => {
                if (errors.general) {
                  toast.error(errors.general, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              }, [errors.general]); 

              return (
                <Form>
                  <VStack spacing={6} align="flex-start">
                    <FormControl
                      isInvalid={errors.email && touched.email}
                      position="relative"
                    >
                      <FormLabel htmlFor="email" color="gray.700">
                        Seu E-mail
                      </FormLabel>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        bg="brand.100"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px brand.500",
                        }}
                      />
                      <FormErrorMessage
                        position="absolute"
                        top="100%"
                        left="0"
                        mt="4px"
                        color="red.500"
                        fontSize="xs"
                      >
                        {errors.email}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.senha && touched.senha}
                      position="relative"
                    >
                      <FormLabel htmlFor="senha" color="gray.700">
                        Sua Senha
                      </FormLabel>
                      <Field
                        as={Input}
                        id="senha"
                        name="senha"
                        type="password"
                        bg="brand.100"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px brand.500",
                        }}
                      />
                      <FormErrorMessage
                        position="absolute"
                        top="100%"
                        left="0"
                        mt="4px"
                        color="red.500"
                        fontSize="xs"
                      >
                        {errors.senha}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="brand"
                      isLoading={isSubmitting}
                      width="full"
                    >
                      Login
                    </Button>

                    <Flex justifyContent="space-between" w="full">
                      <Link color="brand.500" href="#">
                        Esqueci minha senha
                      </Link>
                      <Link color="brand.500" href="#">
                        Cadastrar
                      </Link>
                    </Flex>
                  </VStack>
                </Form>
              );
            }}
          </Formik>

          {/* O ToastContainer deve estar aqui, fora do Form */}
          <ToastContainer />
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
