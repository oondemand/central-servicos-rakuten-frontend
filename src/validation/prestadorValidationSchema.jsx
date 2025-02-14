// src/validation/prestadorValidationSchema.js
import * as Yup from "yup";

export const prestadorValidationSchema = Yup.object({
  nome: Yup.string().required("Nome do prestador é obrigatório"),
  tipo: Yup.string()
    .oneOf(["pf", "pj", "ext"], "Tipo inválido")
    .required("Tipo é obrigatório"),
  documento: Yup.string().required("Documento é obrigatório"),
  email: Yup.string().email("E-mail inválido").optional(),
  status: Yup.string()
    .oneOf(
      ["ativo", "em-analise", "pendente-de-revisao", "inativo", "arquivado", "aguardando-codigo-sci"],
      "Status inválido"
    )
    .required("Status é obrigatório"),
    
  comentariosRevisao: Yup.string(),
});
