// src/validation/prestadorValidationSchema.js
import * as Yup from "yup";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { isValidPIS } from "./pisValidator"; // Importa a função personalizada

// Função para validar RG (pode variar conforme a necessidade)
const validateRG = (value) => {
  const regex = /^[0-9]{7,9}$/; // Exemplo: RG com 7 a 9 dígitos numéricos
  return regex.test(value);
};

const prestadorValidationSchema = Yup.object().shape({
  prestador: Yup.object().shape({
    _id: Yup.string().nullable(),
    sid: Yup.string()
      .required("SID é obrigatório")
      .length(7, "SID deve ter exatamente 7 caracteres"),
    status: Yup.string().required("Status é obrigatório"),
    tipo: Yup.string().required("Tipo é obrigatório"),
    documento: Yup.string()
      .required("Documento é obrigatório")
      .test("is-valid-doc", "Documento inválido", function (value) {
        const { tipo } = this.parent;
        if (tipo === "pf") {
          return cpf.isValid(value);
        } else if (tipo === "pj") {
          return cnpj.isValid(value);
        }
        return false;
      }),
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string()
      .email("Email inválido")
      .required("Email é obrigatório"),
    pessoaFisica: Yup.object().shape({
      dataNascimento: Yup.date()
        .when("tipo", {
          is: "pf",
          then: Yup.date()
            .required("Data de Nascimento é obrigatória")
            .max(new Date(), "Data de Nascimento não pode ser futura"),
          otherwise: Yup.date().nullable(),
        }),
      pis: Yup.string()
        .when("tipo", {
          is: "pf",
          then: Yup.string()
            .required("PIS é obrigatório")
            .test("is-valid-pis", "PIS inválido", (value) => isValidPIS(value)),
          otherwise: Yup.string().nullable(),
        }),
      rg: Yup.object().shape({
        numero: Yup.string()
          .when("tipo", {
            is: "pf",
            then: Yup.string()
              .required("RG é obrigatório")
              .test("is-valid-rg", "RG inválido", (value) => validateRG(value)),
            otherwise: Yup.string().nullable(),
          }),
        orgaoEmissor: Yup.string()
          .when("tipo", {
            is: "pf",
            then: Yup.string().required("Órgão Emissor é obrigatório"),
            otherwise: Yup.string().nullable(),
          }),
      }),
      nomeMae: Yup.string()
        .when("tipo", {
          is: "pf",
          then: Yup.string().required("Nome da Mãe é obrigatório"),
          otherwise: Yup.string().nullable(),
        }),
    }),
    endereco: Yup.object().shape({
      cep: Yup.string()
        .required("CEP é obrigatório")
        .matches(/^\d{5}-?\d{3}$/, "CEP inválido"),
      rua: Yup.string().required("Rua é obrigatória"),
      numero: Yup.string().required("Número é obrigatório"),
      complemento: Yup.string(),
      cidade: Yup.string().required("Cidade é obrigatória"),
      estado: Yup.string()
        .required("Estado é obrigatório")
        .length(2, "Estado deve ter exatamente 2 caracteres"),
    }),
    dadosBancarios: Yup.object().shape({
      tipoConta: Yup.string().required("Tipo de Conta é obrigatório"),
      banco: Yup.string().required("Banco é obrigatório"),
      agencia: Yup.string().required("Agência é obrigatória"),
      conta: Yup.string().required("Conta é obrigatória"),
    }),
    comentariosRevisao: Yup.string(),
  }),
});

export { prestadorValidationSchema };
