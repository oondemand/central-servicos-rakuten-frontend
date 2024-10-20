// src/validation/ticketValidationSchema.js
import * as Yup from "yup";

export const ticketValidationSchema = Yup.object({
  titulo: Yup.string().required("Título é obrigatório"),
  observacao: Yup.string(),
  prestador: Yup.object().nullable(), 
  servicos: Yup.array().nullable(), 
});
