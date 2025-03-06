import { DefaultComponent } from "../../components/common/buildForm/filds/default";
import { DateField } from "../../components/common/buildForm/filds/data";
import { z } from "zod";
import { parseBRLCurrencyToNumber } from "../../utils/formatacoes";
import { preprocessEmptyToUndefined } from "../../utils/zodHelpers";
import { parse, isValid } from "date-fns";
import { SelectLista } from "../../components/common/buildForm/filds/selectLista";

const documentValidation = z.string().superRefine((val, ctx) => {
  const tipo = ctx.parent?.tipo;

  if (tipo === "pf" && !/^\d{11}$/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CPF inválido (11 dígitos)",
    });
  }

  if (tipo === "pj" && !/^\d{14}$/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CNPJ inválido (14 dígitos)",
    });
  }

  return true;
});

export const prestadoresFields = () => {
  const fields = [
    {
      accessorKey: "nome",
      label: "Nome Completo",
      render: DefaultComponent,
      validation: z.string().min(3),
      colSpan: 2,
    },
    {
      accessorKey: "tipo",
      label: "Tipo de Prestador",
      render: SelectLista,
      cod: "tipo-prestador",
      validation: z.string().min(1, "Selecione um tipo"),
      colSpan: 1,
    },
    {
      accessorKey: "documento",
      label: "Documento",
      render: DefaultComponent,
      validation: documentValidation,
      colSpan: 1,
      meta: {
        mask: (value, formValues) => {
          if (formValues.tipo === "pf") return "999.999.999-99";
          if (formValues.tipo === "pj") return "99.999.999/9999-99";
          return "";
        },
      },
    },
    {
      accessorKey: "sid",
      label: "SID",
      render: DefaultComponent,
      validation: z.string().regex(/^\d{7}$/, "Deve ter 7 dígitos"),
      colSpan: 1,
    },
    {
      accessorKey: "sciUnico",
      label: "SCI Único",
      render: DefaultComponent,
      validation: z
        .string()
        .regex(/^\d{5,}$/)
        .optional(),
      colSpan: 1,
    },
    {
      accessorKey: "email",
      label: "E-mail",
      render: DefaultComponent,
      validation: z.string().email().optional().or(z.literal("")),
      colSpan: 2,
    },
    // Dados Bancários
    {
      accessorKey: "dadosBancarios.banco",
      label: "Banco",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.agencia",
      label: "Agência",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.conta",
      label: "Conta",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.tipoConta",
      label: "Tipo de Conta",
      render: SelectLista,
      cod: "tipo-conta-bancaria",
      validation: z.string().optional(),
      colSpan: 1,
    },
    // Endereço
    {
      accessorKey: "endereco.cep",
      label: "CEP",
      render: DefaultComponent,
      validation: z
        .string()
        .regex(/^\d{8}$/)
        .optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.rua",
      label: "Logradouro",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 2,
    },
    {
      accessorKey: "endereco.numero",
      label: "Número",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.complemento",
      label: "Complemento",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.cidade",
      label: "Cidade",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.estado",
      label: "Estado",
      render: SelectLista,
      cod: "estados-brasil",
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.pais",
      label: "País",
      render: SelectLista,
      cod: "paises",
      validation: z.string().optional(),
      colSpan: 1,
    },
    // Pessoa Física
    {
      accessorKey: "pessoaFisica.dataNascimento",
      label: "Data Nascimento",
      render: DateField,
      validation: z.date().optional(),
      colSpan: 1,
      show: (values) => values.tipo === "pf",
    },
    {
      accessorKey: "pessoaFisica.pis",
      label: "PIS",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 1,
      show: (values) => values.tipo === "pf",
    },
    // Pessoa Jurídica
    {
      accessorKey: "pessoaJuridica.razaoSocial",
      label: "Razão Social",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 2,
      show: (values) => values.tipo === "pj",
    },
    {
      accessorKey: "pessoaJuridica.nomeFantasia",
      label: "Nome Fantasia",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 2,
      show: (values) => values.tipo === "pj",
    },
  ];

  return fields;
};
