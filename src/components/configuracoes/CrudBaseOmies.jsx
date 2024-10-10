// src/components/configuracoes/CrudBaseOmies.js
import React, { useEffect, useState } from 'react';
import CrudList from './CrudList';
import { listarBaseOmies, adicionarBaseOmie, alterarBaseOmie, excluirBaseOmie } from '../../services/baseOmieService';
import { useToast } from '@chakra-ui/react';
import * as Yup from 'yup';

const CrudBaseOmies = () => {
  const [baseOmies, setBaseOmies] = useState([]);
  const toast = useToast();

  const fetchBaseOmies = async () => {
    try {
      const data = await listarBaseOmies();
      setBaseOmies(data);
    } catch (error) {
      toast({
        title: "Erro ao buscar Bases Omie.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBaseOmies();
  }, []);

  const handleAdd = async (values) => {
    try {
      await adicionarBaseOmie(values);
      toast({
        title: "Base Omie adicionada com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchBaseOmies();
    } catch (error) {
      toast({
        title: "Erro ao adicionar Base Omie.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (item) => {
    try {
      await alterarBaseOmie(item._id, item);
      toast({
        title: "Base Omie atualizada com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchBaseOmies();
    } catch (error) {
      toast({
        title: "Erro ao atualizar Base Omie.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await excluirBaseOmie(id);
      toast({
        title: "Base Omie excluída com sucesso!",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      fetchBaseOmies();
    } catch (error) {
      toast({
        title: "Erro ao excluir Base Omie.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formFields = [
    { label: "Nome", name: "nome", type: "text" },
    { label: "CNPJ", name: "cnpj", type: "text" },
    { label: "App Key Omie", name: "appKey", type: "text" },
    { label: "App Secret Omie", name: "appSecret", type: "text" },
    { 
      label: "Status", 
      name: "status", 
      type: "select",
      options: [
        { value: "ativo", label: "Ativo" },
        { value: "inativo", label: "Inativo" },
      ],
    },
  ];

  const validationSchema = {
    nome: Yup.string().required('Nome é obrigatório'),
    cnpj: Yup.string().required('CNPJ é obrigatório'),
    appKey: Yup.string().required('App Key é obrigatório'),
    appSecret: Yup.string().required('App Secret é obrigatório'),
    status: Yup.string().oneOf(['ativo', 'inativo'], 'Status inválido').required('Status é obrigatório'),
  };

  const initialValues = {
    nome: '',
    cnpj: '',
    appKey: '',
    appSecret: '',
    status: 'ativo',
    _id: '',
  };

  return (
    <CrudList
      title="Bases Omie"
      items={baseOmies}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formFields={formFields}
      validationSchema={validationSchema}
      initialValues={initialValues}
    />
  );
};

export default CrudBaseOmies;
