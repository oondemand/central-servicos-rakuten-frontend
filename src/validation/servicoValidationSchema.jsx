// src/validation/servicoValidationSchema.js
import * as Yup from "yup";

export const servicoValidationSchema = Yup.object({
  descricao: Yup.string().required("Descrição do serviço é obrigatória"),
  valor: Yup.number()
    .typeError("Valor deve ser um número")
    .positive("Valor deve ser positivo")
    .required("Valor é obrigatório"),
  data: Yup.date().required("Data é obrigatória"),
  status: Yup.string()
    .oneOf(["ativo", "em-analise", "pendente-de-revisao", "arquivado"], "Status inválido")
    .required("Status é obrigatório"),
  comentariosRevisao: Yup.string(),
});
