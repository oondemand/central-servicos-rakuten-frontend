// src/validation/servicoValidationSchema.js
import * as Yup from "yup";

export const servicoValidationSchema = Yup.object({
  mesCompetencia: Yup.number()
    .required("Mês de competência é obrigatório")
    .typeError("Mês de competência deve ser um número")
    .min(1, "Mês de competência deve ser entre 1 e 12")
    .max(12, "Mês de competência deve ser entre 1 e 12"),
  anoCompetencia: Yup.number()
    .typeError("Ano de competência deve ser um número")
    .required("Ano de competência é obrigatório")
    .min(24, "Ano de competência deve ser maior que 24"),
  valorPrincipal: Yup.number()
    .typeError("Valor principal deve ser um número")
    .positive("Valor principal deve ser positivo")
    .required("Valor principal é obrigatório"),
  valorBonus: Yup.number().typeError("Valor bônus deve ser um número"),
  valorAjusteComercial: Yup.number().typeError("Valor de ajuste comercial deve ser um número"),
  valorHospedagemAnuncio: Yup.number().typeError(
    "Valor de hospedagem de anúncio deve ser um número"
  ),
  valorTotal: Yup.number()
    .typeError("Valor total deve ser um número")
    .required("Valor total é obrigatório"),
  status: Yup.string()
    .oneOf(["ativo", "em-analise", "pendente-de-revisao", "arquivado"], "Status inválido")
    .required("Status é obrigatório"),
});
