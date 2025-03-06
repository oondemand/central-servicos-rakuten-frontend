import { DefaultComponent } from "../../components/common/buildForm/filds/default";
import { DateField } from "../../components/common/buildForm/filds/data";

import { CurrencyInput } from "../../components/common/buildForm/filds/currency";
import { z } from "zod";
import { parseBRLCurrencyToNumber } from "../../utils/formatacoes";
import { preprocessEmptyToUndefined } from "../../utils/zodHelpers";

import { parse, isValid } from "date-fns";
import { SelectPrestadorField } from "../../components/common/buildForm/filds/selectPrestador";
import { CompetenciaField } from "../../components/common/buildForm/filds/competencia";
import { SelectLista } from "../../components/common/buildForm/filds/selectLista";

const currencyValidation = preprocessEmptyToUndefined(
  z.coerce
    .string()
    .transform((value) => {
      return parseBRLCurrencyToNumber(value);
    })
    .optional()
);

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

export const servicosFields = () => {
  const fields = [
    {
      accessorKey: "prestador",
      label: "Prestador",
      render: SelectPrestadorField,
      validation: z.object(
        { label: z.string(), value: z.string() },
        { message: "Prestador é obrigatório" }
      ),
      colSpan: 2,
    },
    {
      accessorKey: "campanha",
      label: "Campanha",
      render: SelectLista,
      cod: "campanha",
      validation: z.object({ label: z.string(), value: z.string() }).optional(),
      colSpan: 2,
    },
    {
      accessorKey: "competencia",
      label: "Competência",
      render: CompetenciaField,
      validation: z.string().min(7, { message: "Data inválida" }),
      colSpan: 1,
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      label: "Documento Fiscal",
      cod: "tipo-documento-fiscal",
      render: SelectLista,
      validation: z.object({ label: z.string(), value: z.string() }).optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dataProvisaoContabil",
      label: "Data Provisão Contábil",
      render: DateField,
      validation: dateValidation,
      colSpan: 1,
    },
    {
      accessorKey: "dataRegistro",
      label: "Data Registro",
      render: DateField,
      validation: dateValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.grossValue",
      label: "Gross Value",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.bonus",
      label: "Bonus",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.ajusteComercial",
      label: "Ajuste Comercial",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.paidPlacement",
      label: "Paid Placement",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.revisionMonthProvision",
      label: "Revisão - Mês Provisão",
      render: DefaultComponent,
      validation: preprocessEmptyToUndefined(
        z.coerce.number().min(1).max(12).optional()
      ),
      colSpan: 1,
    },
    {
      accessorKey: "valores.revisionGrossValue",
      label: "Revisão - Gross Value",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.revisionProvisionBonus",
      label: "Revisão - Bonus",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.revisionComissaoPlataforma",
      label: "Revisão - Comissão Plataforma",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.revisionPaidPlacement",
      label: "Revisão - Paid Placement",
      render: CurrencyInput,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valores.totalServico",
      label: "Total Serviço",
      render: CurrencyInput,
      disabled: true,
    },
    {
      accessorKey: "valores.totalRevisao",
      label: "Total Revisão",
      render: CurrencyInput,
      disabled: true,
    },
    {
      accessorKey: "valor",
      label: "Valor total",
      render: CurrencyInput,
      disabled: true,
    },
  ];

  return fields;
};
