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
import { login as loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorUtils";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: Yup.string().required("Senha é obrigatória"),
});

const Login = () => {
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
              Que bom ter você por aqui! :)
            </Heading>
            <Text mb={4} color="brand.500" textAlign="center">
              Vamos juntos transformar sua <br />
              rotina com tecnologia.
            </Text>
          </Box>

          <Formik
            initialValues={{
              email: "",
              senha: "",
              general: "",
            }}
            validationSchema={LoginSchema}
            validateOnBlur={false}
            validateOnChange={false}
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
                  <VStack spacing={5} align="flex-start">
                    <FormControl
                      isInvalid={errors.email && touched.email}
                      position="relative"
                    >
                      <FormLabel
                        htmlFor="email"
                        color="brand.500"
                        fontWeight={400}
                      >
                        Seu E-mail
                      </FormLabel>

                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
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
                      <FormLabel
                        htmlFor="senha"
                        color="brand.500"
                        fontWeight={400}
                      >
                        Sua Senha
                      </FormLabel>
                      <Field
                        as={Input}
                        id="senha"
                        name="senha"
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
                        {errors.senha}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      width="full"
                      color={"white"}
                      background={'#0BC5EA'}
                    >
                      Login
                    </Button>

                    <Flex justifyContent="space-between" w="full">
                      <Link color="brand.500" href="#" textDecoration="underline">
                        Esqueci minha senha
                      </Link>
                      <Link color="brand.500" href="#"  textDecoration="underline">
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
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;
