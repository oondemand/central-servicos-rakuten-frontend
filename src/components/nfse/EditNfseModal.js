import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Acordeao from "../common/Acordeao";
import { useNFSe } from "../../contexts/NfseContext";
import PessoaForm from "../common/PessoaForm";
import { useEmpresa } from "../../contexts/EmpresaContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import { FaSpinner } from "react-icons/fa";

const EditNfseModal = ({ nfse, closeModal }) => {
  console.log("nfse", nfse);
  const { listaEmpresas, empresaSelecionada } = useEmpresa();
  const { adicionarNfse, editarNfse } = useNFSe();
  const [loading, setLoading] = useState({
    save: false,
    approve: false,
    reject: false,
  });
  const [tipo, setTipo] = useState();

  const validationSchema = Yup.object().shape({
    numero: Yup.string().required("Número é obrigatório"),
    dataEmissao: Yup.date().required("Data de Emissão é obrigatória"),
    competencia: Yup.string().required("Competência é obrigatória"),
    optanteSimplesNacional: Yup.number()
      .required("Optante pelo Simples Nacional é obrigatório")
      .nullable(),
    discriminacao: Yup.string()
      .max(500, "Máximo de 500 caracteres")
      .required("Discriminação é obrigatória"),
    valorServicos: Yup.number()
      .required("Valor dos Serviços é obrigatório")
      .min(0, "O valor deve ser maior que zero"),
    issRetido: Yup.string().required("ISS Retido é obrigatório"),
    aliquota: Yup.number()
      .required("Alíquota é obrigatória")
      .min(0, "A alíquota deve ser maior que zero"),
    valorIss: Yup.number()
      .required("Valor ISS é obrigatório")
      .min(0, "O valor deve ser maior que zero"),
  });

  const handleSubmit = async (values) => {
    setLoading((prev) => ({ ...prev, save: true }));

    const nfseData = {
      infoNfse: {
        numero: values.numero,
        dataEmissao: values.dataEmissao,
        prestador: {
          tipo: values.tipoPrestador,
          documento: values.documentoPrestador.replace(/[./-]/g, ""),
          nome: values.nomePrestador,
        },
        tomador: {
          tipo: values.tipoTomador,
          documento: values.documentoTomador.replace(/[./-]/g, ""),
          nome: values.nomeTomador,
        },
        declaracaoPrestacaoServico: {
          competencia: values.competencia,
          servico: {
            valores: {
              aliquota: values.aliquota,
              valorIss: values.valorIss,
              valorServicos: values.valorServicos,
            },
            issRetido: values.issRetido,
            discriminacao: values.discriminacao,
          },
          optanteSimplesNacional: values.optanteSimplesNacional,
        },
      },
    };

    let sucesso;
    if (nfse && nfse._id) {
      sucesso = await editarNfse(nfse._id, nfseData);
      setLoading((prev) => ({ ...prev, save: false }));
    } else {
      sucesso = await adicionarNfse(nfseData);
      setLoading((prev) => ({ ...prev, save: false }));
    }

    if (sucesso) {
      closeModal();
    }
  };

  const initialValues = {
    numero: nfse?.infoNfse.numero || "",
    dataEmissao: nfse?.infoNfse.dataEmissao ? new Date(nfse.infoNfse.dataEmissao).toISOString().split("T")[0]: "",
    competencia: nfse?.infoNfse.declaracaoPrestacaoServico.competencia || "",
    optanteSimplesNacional:
      nfse?.infoNfse.declaracaoPrestacaoServico.optanteSimplesNacional,
    discriminacao:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.discriminacao || "",
    valorServicos:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.valores.valorServicos,
    issRetido: nfse?.infoNfse.declaracaoPrestacaoServico.servico.issRetido,
    aliquota:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.valores.aliquota,
    valorIss:
      nfse?.infoNfse.declaracaoPrestacaoServico.servico.valores.valorIss,
    tipoPrestador: nfse?.infoNfse.prestador.tipo || "pf",
    documentoPrestador: nfse?.infoNfse.prestador.documento || "",
    nomePrestador: nfse?.infoNfse.prestador.nome || "",
    tipoTomador: nfse?.infoNfse.tomador.tipo || "pf",
    documentoTomador: nfse?.infoNfse.tomador.documento || "",
    nomeTomador: nfse?.infoNfse.tomador.nome || "",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl flex flex-col"
        style={{ height: "95%" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-semibold">
            Editar NFSe
          </h2>
          <button
            className="text-gray-600 dark:text-gray-300"
            onClick={closeModal}
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1 form-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <Acordeao titulo="Tomador" aberto={true}>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label>Selecione a Empresa</label>
                      <Field
                        as="select"
                        name="documentoTomador"
                        className="mt-1 w-full"
                        disabled={!!empresaSelecionada}
                        onChange={(e) => {
                          const cnpjSelecionado = e.target.value;
                          const empresa = listaEmpresas.find(
                            (emp) => emp.cnpj === cnpjSelecionado
                          );
                          if (empresa) {
                            setFieldValue("documentoTomador", empresa.cnpj);
                            setFieldValue("nomeTomador", empresa.nome);
                          } else {
                            setFieldValue("documentoTomador", "");
                            setFieldValue("nomeTomador", "");
                          }
                        }}
                      >
                        <option value="">Selecione uma empresa</option>
                        {listaEmpresas.map((empresa) => (
                          <option key={empresa.cnpj} value={empresa.cnpj}>
                            {empresa.nome}
                          </option>
                        ))}
                      </Field>
                    </div>

                    <div className="flex-1">
                      <label>CNPJ do Tomador</label>
                      <Field
                        name="documentoTomador"
                        as={InputMask}
                        mask="99.999.999/9999-99"
                        className="mt-1 w-full"
                        disabled={!!empresaSelecionada}
                      />
                      <ErrorMessage name="documentoTomador" component="div" />
                    </div>
                  </div>
                </Acordeao>

                <Acordeao titulo="Prestador" aberto={true}>
                  {/* <PessoaForm
                    tipo={initialValues.tipoPrestador}
                    setTipo={(value) => setFieldValue('tipoPrestador', value)}
                    documento={initialValues.documentoPrestador}
                    setDocumento={(value) => setFieldValue('documentoPrestador', value)}
                    nome={initialValues.nomePrestador}
                    setNome={(value) => setFieldValue('nomePrestador', value)}
                  /> */}
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
                        name="documentoPrestador"
                        as={InputMask}
                        mask={
                          tipo === "pf"
                            ? "999.999.999-99"
                            : "99.999.999/9999-99"
                        }
                        placeholder={tipo === "pf" ? "CPF" : "CNPJ"}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-black text-white"
                      />
                      <ErrorMessage name="documento" component="div" />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nome/Razão Social
                      </label>
                      <Field
                        type="text"
                        name="nomePrestador"
                        placeholder={
                          tipo === "pf" ? "Nome Completo" : "Razão Social"
                        }
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-black text-white"
                      />
                      <ErrorMessage name="nome" component="div" />
                    </div>
                  </div>
                </Acordeao>

                <Acordeao titulo="Informações da NFSe" aberto={true}>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label>Número</label>
                      <Field
                        type="number"
                        name="numero"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="numero" component="div" />
                    </div>

                    <div className="flex-1">
                      <label>Data de Emissão</label>
                      <Field
                        type="date"
                        name="dataEmissao"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="dataEmissao" component="div" />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label>Competência</label>
                      <Field
                        name="competencia"
                        as={InputMask}
                        mask="99/9999"
                        placeholder="MM/YYYY"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="competencia" component="div" />
                    </div>

                    <div className="flex-1">
                      <label>Optante pelo Simples Nacional</label>
                      <Field
                        as="select"
                        name="optanteSimplesNacional"
                        className="mt-1 w-full"
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                      </Field>
                      <ErrorMessage
                        name="optanteSimplesNacional"
                        component="div"
                      />
                    </div>
                  </div>
                </Acordeao>

                <Acordeao titulo="Serviço" aberto={true}>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <label>Discriminação</label>
                      <Field
                        as="textarea"
                        name="discriminacao"
                        maxLength={500}
                        rows="3"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="discriminacao" component="div" />
                    </div>
                  </div>
                </Acordeao>

                <Acordeao titulo="Valores" aberto={true}>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label>Valor dos Serviços</label>
                      <Field
                        type="number"
                        name="valorServicos"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="valorServicos" component="div" />
                    </div>

                    <div>
                      <label>ISS Retido</label>
                      <Field
                        as="select"
                        name="issRetido"
                        className="mt-1 w-full"
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                      </Field>
                      <ErrorMessage name="issRetido" component="div" />
                    </div>

                    <div>
                      <label>Alíquota</label>
                      <Field
                        type="number"
                        name="aliquota"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="aliquota" component="div" />
                    </div>

                    <div>
                      <label>Valor ISS</label>
                      <Field
                        type="number"
                        name="valorIss"
                        className="mt-1 w-full"
                      />
                      <ErrorMessage name="valorIss" component="div" />
                    </div>
                  </div>
                </Acordeao>

                <div className="p-4 border-t border-gray-700 bg-white dark:bg-gray-900 flex justify-end">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                      disabled={loading.save}
                    >
                      {loading.save ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        "Salvar"
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditNfseModal;
