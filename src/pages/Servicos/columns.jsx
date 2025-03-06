import { InputCell } from "../../components/common/DataGrid/cells/inputCell";
import { CurrencyInputCell } from "../../components/common/DataGrid/cells/currencyInput";
import { DisabledCurrencyInputCell } from "../../components/common/DataGrid/cells/disabledCurrencyInput";
import { CompetenciaInput } from "../../components/common/DataGrid/cells/competencia";
import { DateInput } from "../../components/common/DataGrid/cells/dateInput";

import { TableActions } from "../../components/common/DataGrid/cells/tableActions";

import { SelectPrestadorCell } from "../../components/common/DataGrid/cells/selectPrestador";
import { SelectLista } from "../../components/common/DataGrid/cells/selectLista";

export const createColumns = () => {
  const columns = [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: TableActions,
    },
    {
      accessorKey: "prestador",
      header: "Prestador",
      enableSorting: false,
      cell: SelectPrestadorCell,
    },
    {
      accessorKey: "dataProvisaoContabil",
      header: "Data Provisão Contábil",
      enableSorting: false,
      cell: DateInput,
    },
    {
      accessorKey: "dataRegistro",
      header: "Data Registro",
      enableSorting: false,
      cell: DateInput,
    },
    {
      accessorKey: "competencia",
      header: "Competência - Mês",
      enableSorting: false,
      cell: CompetenciaInput,
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      header: "Documento Fiscal",
      enableSorting: false,
      cell: (props) => <SelectLista {...props} cod={"tipo-documento-fiscal"} />,
    },
    {
      accessorKey: "campanha",
      header: "Campanha",
      enableSorting: false,
      cell: (props) => <SelectLista {...props} cod={"campanha"} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: InputCell,
    },

    {
      accessorKey: "valores.grossValue",
      header: "Gross Value",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.bonus",
      header: "Bonus",
      enableSorting: false,
      cell: CurrencyInputCell,
      // enableColumnFilter: true,
      // meta: { filterKey: "valores.bonus" },
    },
    {
      accessorKey: "valores.ajusteComercial",
      header: "Ajuste Comercial",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.paidPlacement",
      header: "Paid Placement",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionMonthProvision",
      header: "Revisão - Mês Provisão",
      enableSorting: false,
      cell: InputCell,
    },
    {
      accessorKey: "valores.revisionGrossValue",
      header: "Revisão - Gross Value",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionProvisionBonus",
      header: "Revisão - Bonus",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionComissaoPlataforma",
      header: "Revisão - Comissão Plataforma",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionPaidPlacement",
      header: "Revisão - Paid Placement",
      enableSorting: false,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.totalServico",
      header: "Total Serviço",
      enableSorting: false,
      cell: DisabledCurrencyInputCell,
    },
    {
      accessorKey: "valores.totalRevisao",
      header: "Total Revisão",
      enableSorting: false,
      cell: DisabledCurrencyInputCell,
    },
    {
      accessorKey: "valor",
      header: "Valor total",
      enableSorting: false,
      cell: DisabledCurrencyInputCell,
    },
  ];

  return columns;
};
