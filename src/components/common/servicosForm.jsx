import { BuildForm } from "../common/buildForm/index";
import { SelectPrestadorField } from "./buildForm/filds/selectPrestador";
import { DateField } from "./buildForm/filds/data";
import { CurrencyInput } from "./buildForm/filds/currency";
import { DefaultComponent } from "./buildForm/filds/default";

export const ServicosForm = ({ data, onBlurFn }) => {
  const fields = [
    {
      accessorKey: "prestador",
      label: "Prestador",
      render: SelectPrestadorField,
    },
    {
      accessorKey: "dataProvisaoContabil",
      label: "Data Provisão Contábil",
      render: DateField,
    },
    {
      accessorKey: "dataRegistro",
      label: "Data Registro",
      render: DateField,
    },
    {
      accessorKey: "competencia",
      label: "Competência - Mês",
      render: DefaultComponent,
    },
    {
      accessorKey: "valor",
      label: "Valor",
      render: CurrencyInput,
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      label: "Documento Fiscal",
      render: DefaultComponent,
    },
    {
      accessorKey: "campanha",
      label: "Campanha",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.grossValue",
      label: "Gross Value",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.bonus",
      label: "Bonus",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.ajusteComercial",
      label: "Ajuste Comercial",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.paidPlacement",
      label: "Paid Placement",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.revisionMonthProvision",
      label: "Revisão - Mês Provisão",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.revisionGrossValue",
      label: "Revisão - Gross Value",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.revisionProvisionBonus",
      label: "Revisão - Bonus",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.revisionComissaoPlataforma",
      label: "Revisão - Comissão Plataforma",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.revisionPaidPlacement",
      label: "Revisão - Paid Placement",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.totalServico",
      label: "Total Serviço",
      render: CurrencyInput,
    },
    {
      accessorKey: "valores.totalRevisao",
      label: "Total Revisão",
      render: CurrencyInput,
    },
  ];

  return <BuildForm fields={fields} data={data} onBlurFn={onBlurFn} />;
};
