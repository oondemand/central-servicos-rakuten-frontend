import { Flex } from "@chakra-ui/react";

import { Formik, Form } from "formik";
import FormField from "../common/FormField";
import * as Yup from "yup";

import { PrestadorFilter } from "../common/PrestadorFilter";

export const UsuarioForm = ({
  valoresIniciais,
  formId,
  isEditMode,
  onSubmit,
}) => {
  const usuarioValidationSchema = () => {
    return Yup.object({
      nome: Yup.string().required("Nome é obrigatório"),
      email: Yup.string()
        .email("E-mail inválido")
        .required("E-mail é obrigatório"),
      status: Yup.string()
        .oneOf(["ativo", "inativo"], "Status inválido")
        .required("Status é obrigatório"),
      senha: isEditMode
        ? Yup.string().optional()
        : Yup.string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .required("Senha é obrigatória ao criar um novo usuário"),
    });
  };

  return (
    <Formik
      initialValues={valoresIniciais}
      validationSchema={usuarioValidationSchema()}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, values }) => {
        return (
          <Form onSubmit={handleSubmit} id={formId}>
            <Flex>
              <FormField
                w="52"
                label="Tipo"
                name="tipo"
                type="select"
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "central", label: "Central" },
                  { value: "prestador", label: "Prestador" },
                ]}
              />
              <FormField
                w="52"
                label="Status"
                name="status"
                type="select"
                options={[
                  { value: "ativo", label: "Ativo" },
                  { value: "inativo", label: "Inativo" },
                ]}
              />
            </Flex>

            {values.tipo === "prestador" && !isEditMode && <PrestadorFilter />}

            <FormField
              disabled={
                values.tipo === "prestador" && values.email && !isEditMode
              }
              label="Email"
              name="email"
              type="text"
            />
            <FormField
              disabled={values.tipo === "prestador" && !isEditMode}
              label="Nome"
              name="nome"
              type="text"
            />

            {!isEditMode && (
              <FormField label="Senha" name="senha" type="password" />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
