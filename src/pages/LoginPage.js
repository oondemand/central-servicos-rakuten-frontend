// src/pages/Login.jsx
import React from "react";
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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { login as loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorUtils"; // Importa a função auxiliar

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: Yup.string().required("Senha é obrigatória"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={6} textAlign="center">
        Login
      </Heading>
      <Formik
        initialValues={{
          email: "",
          senha: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          try {
            const response = await loginService(values);
            const { token, usuario } = response.data;
            console.log("usuario", usuario);
            console.log("token", token);

            login(token, usuario);
            navigate("/home");
          } catch (error) {
            const errorMessage = getErrorMessage(error) || "Erro ao fazer login";
            actions.setFieldError("general", errorMessage);
          }
          actions.setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={4} align="flex-start">
              <FormControl isInvalid={errors.email && touched.email}>
                <FormLabel htmlFor="email">E-mail</FormLabel>
                <Field as={Input} id="email" name="email" type="email" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.senha && touched.senha}>
                <FormLabel htmlFor="senha">Senha</FormLabel>
                <Field as={Input} id="senha" name="senha" type="password" />
                <FormErrorMessage>{errors.senha}</FormErrorMessage>
              </FormControl>

              {errors.general && <Box color="red.500">{errors.general}</Box>}

              <Button type="submit" colorScheme="teal" width="full" isLoading={isSubmitting}>
                Entrar
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
