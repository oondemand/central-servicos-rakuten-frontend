// src/components/configuracoes/CrudUsuarios.js
import React, { useEffect, useState } from "react";
import CrudList from "./CrudList";
import {
  listarUsuarios,
  adicionarUsuario,
  alterarUsuario,
  excluirUsuario,
} from "../../services/usuariosService";
import { useToast } from "@chakra-ui/react";
import * as Yup from "yup";

const CrudUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const toast = useToast();

  const fetchUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      toast({
        title: "Erro ao buscar Usuários.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleAdd = async (values) => {
    try {
      await adicionarUsuario(values);
      toast({
        title: "Usuário adicionado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchUsuarios();
    } catch (error) {
      toast({
        title: "Erro ao adicionar Usuário.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (item) => {
    try {
      const { senha, ...rest } = item;

      await alterarUsuario(item._id, rest);

      toast({
        title: "Usuário atualizado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchUsuarios(); 
    } catch (error) {
      toast({
        title: "Erro ao atualizar Usuário.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await excluirUsuario(id);
      toast({
        title: "Usuário excluído com sucesso!",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      fetchUsuarios();
    } catch (error) {
      toast({
        title: "Erro ao excluir Usuário.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formFields = [
    { label: "Nome", name: "nome", type: "text" },
    { label: "Email", name: "email", type: "email" },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        { value: "ativo", label: "Ativo" },
        { value: "inativo", label: "Inativo" },
      ],
    },
    { label: "Senha", name: "senha", type: "password" },
  ];

  const validationSchema = {
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    status: Yup.string()
      .oneOf(["ativo", "inativo"], "Status inválido")
      .required("Status é obrigatório"),
    senha: Yup.string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .required("Senha é obrigatória ao criar um novo usuário"),
  };

  const initialValues = {
    nome: "",
    email: "",
    senha: "", // Campo senha sera opcional ao editar!!!
    status: "ativo",
    _id: "",
  };

  return (
    <CrudList
      title="Usuários"
      items={usuarios}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formFields={formFields}
      validationSchema={validationSchema}
      initialValues={initialValues}
    />
  );
};

export default CrudUsuarios;
