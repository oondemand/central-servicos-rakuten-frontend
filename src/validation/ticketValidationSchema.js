import * as Yup from "yup";

export const ticketValidationSchema = Yup.object({
  titulo: Yup.string().required("Título é obrigatório"),
  observacao: Yup.string().required("Observação é obrigatória"),
  // prestador: Yup.object({
  //   nome: Yup.string().required("Nome do prestador é obrigatório"),
  //   tipo: Yup.string()
  //     .oneOf(["pj", "pf"], "Tipo inválido")
  //     .required("Tipo é obrigatório"),
  //   documento: Yup.string().required("Documento é obrigatório"),
  //   email: Yup.string()
  //     .email("E-mail inválido")
  //     .required("E-mail é obrigatório"),
  //   status: Yup.string()
  //     .oneOf(
  //       ["ativo", "em-analise", "pendente-de-revisao", "inativo", "arquivado"],
  //       "Status inválido"
  //     )
  //     .required("Status é obrigatório"),
  // }),

  // servico: Yup.object({
  //   descricao: Yup.string().required("Descrição do serviço é obrigatória"),
  //   valor: Yup.number()
  //     .typeError("Valor deve ser um número")
  //     .positive("Valor deve ser positivo")
  //     .required("Valor é obrigatório"),
  //   data: Yup.date().required("Data é obrigatória"),
  //   status: Yup.string()
  //     .oneOf(["ativo", "arquivado"], "Status inválido")
  //     .required("Status é obrigatório"),
  // }),
});