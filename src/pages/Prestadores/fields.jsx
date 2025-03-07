import { DefaultComponent } from "../../components/common/buildForm/filds/default";
import { DateField } from "../../components/common/buildForm/filds/data";
import { z } from "zod";
import { parseBRLCurrencyToNumber } from "../../utils/formatacoes";
import { preprocessEmptyToUndefined } from "../../utils/zodHelpers";
import { parse, isValid } from "date-fns";
import { SelectLista } from "../../components/common/buildForm/filds/selectLista";
import { SelectField } from "../../components/common/buildForm/filds/select";
import { CepField } from "../../components/common/buildForm/filds/cep";
import { CpfCnpjField } from "../../components/common/buildForm/filds/cpfCnpj";

// const documentValidation = z.string().superRefine((val, ctx) => {
//   const tipo = ctx.parent?.tipo;

//   console.log("TIPO", tipo, ctx.path);

//   if (tipo === "pf" && !/^\d{11}$/.test(val)) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "CPF inválido (11 dígitos)",
//     });
//   }

//   if (tipo === "pj" && !/^\d{14}$/.test(val)) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "CNPJ inválido (14 dígitos)",
//     });
//   }

//   return true;
// });

const dateValidation = z
  .string()
  .transform((value) => {
    if (!value) return undefined;
    return parse(value, "dd/MM/yyyy", new Date());
  })
  .refine((value) => (value ? isValid(value) : true), {
    message: "Data inválida ",
  })
  .optional();

export const prestadoresFields = () => {
  const fields = [
    {
      accessorKey: "nome",
      label: "Nome Completo",
      render: DefaultComponent,
      validation: z
        .string()
        .min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
      colSpan: 2,
    },
    {
      accessorKey: "sid",
      label: "SID",
      render: DefaultComponent,
      validation: z
        .string()
        .regex(/^\d{7}$/, "O SID deve ter exatamente 7 dígitos."),
      colSpan: 1,
    },
    {
      accessorKey: "sciUnico",
      label: "SCI Único",
      render: DefaultComponent,
      validation: preprocessEmptyToUndefined(
        z
          .string()
          .regex(/^\d{5,}$/)
          .optional()
      ),
      colSpan: 1,
    },
    {
      accessorKey: "email",
      label: "E-mail",
      render: DefaultComponent,
      validation: z.string().email().optional().or(z.literal("")),
      colSpan: 2,
    },
    {
      accessorKey: "tipo",
      label: "Tipo de Prestador",
      render: SelectField,
      validation: z.string({ message: "Tipo é um campo obrigatório" }),
      colSpan: 1,
      options: [
        { value: "pf", label: "Pessoa física" },
        { value: "pj", label: "Pessoa jurídica" },
        { value: "ext", label: "Exterior" },
      ],
    },
    {
      accessorKey: "documento",
      label: "Documento",
      render: CpfCnpjField,
      validation: z
        .string({ message: "Documento é um campo obrigatório" })
        .nonempty({ message: "Documento é um campo obrigatório" })
        .transform((value) => value.replace(/\D/g, "")),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaFisica.dataNascimento",
      label: "Data Nascimento",
      render: DateField,
      validation: dateValidation,
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
    // {
    //   accessorKey: "pessoaJuridica.razaoSocial",
    //   label: "Razão Social",
    //   render: DefaultComponent,
    //   validation: z.string().optional(),
    //   colSpan: 2,
    //   show: (values) => values.tipo === "pj",
    // },
    {
      accessorKey: "pessoaJuridica.nomeFantasia",
      label: "Nome Fantasia",
      render: DefaultComponent,
      validation: z.string().optional(),
      colSpan: 2,
      show: (values) => values.tipo === "pj",
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
      accessorKey: "endereco.cep",
      label: "CEP",
      render: CepField,
      validation: preprocessEmptyToUndefined(
        z
          .string()
          .transform((value) => value.replace(/\D/g, ""))
          .refine((cleanedValue) => cleanedValue.length === 8, {
            message: "CEP deve conter exatamente 8 dígitos.",
          })
          .optional()
      ),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.estado",
      label: "Estado",
      render: DefaultComponent,
      // cod: "estados-brasil",
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.pais",
      label: "País",
      render: DefaultComponent,
      // cod: "paises",
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.banco",
      label: "Banco",
      render: SelectLista,
      cod: "bancos",
      validation: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .optional(),
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
      render: SelectField,
      validation: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .optional(),
      colSpan: 1,
      options: [
        { value: "corrente", label: "Conta Corrente" },
        { value: "poupanca", label: "Conta poupança" },
      ],
    },
  ];

  return fields;
};
