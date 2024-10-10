// src/validation/ticketValidationSchema.js
import * as Yup from "yup";

export const ticketValidationSchema = Yup.object({
  titulo: Yup.string().required("Título é obrigatório"),
  observacao: Yup.string().required("Observação é obrigatória"),
  prestador: Yup.object().nullable(), 
  servico: Yup.object().nullable(), 
});
