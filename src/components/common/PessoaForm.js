
import React from "react";
import InputMask from 'react-input-mask';
import { Field, ErrorMessage } from 'formik';

const PessoaForm = ({ tipo, setTipo, documento, setDocumento, nome, setNome }) => {
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo
        </label>
        <Field
          as="select"
          name="tipo"
          className=" select-pj mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-black text-white"
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="pf">Pessoa Física</option>
          <option value="pj">Pessoa Jurídica</option>
        </Field>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Documento (CPF/CNPJ)
        </label>
        <Field
          name="documento"
          as={InputMask}
          mask={tipo === 'pf' ? '999.999.999-99' : '99.999.999/9999-99'}
          placeholder={tipo === 'pf' ? 'CPF' : 'CNPJ'}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-black text-white"
          onChange={(e) => setDocumento(e.target.value)}
        />
        <ErrorMessage name="documento" component="div" />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nome/Razão Social
        </label>
        <Field
          type="text"
          name="nome"
          placeholder={tipo === 'pf' ? 'Nome Completo' : 'Razão Social'}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-black text-white"
          onChange={(e) => setNome(e.target.value)}
        />
        <ErrorMessage name="nome" component="div" />
      </div>
    </div>
  );
};

export default PessoaForm;
