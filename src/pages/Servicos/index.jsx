import { Box, Text, useToast, Flex, Spinner, Button } from "@chakra-ui/react";
import { DataGrid } from "../../components/common/DataGrid";

import { useFilters } from "../../contexts/useFilters";
import { useColumnVisibility } from "../../contexts/useColumnVisibility";
import { useColumnSizing } from "../../contexts/useColumnSizing";
import { sortByToState, stateToSortBy } from "../../utils/sorting";

import { listarServicos } from "../../services/servicoService";

import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import api from "../../services/api";

import { InputCell } from "../../components/common/DataGrid/cells/inputCell";
import { CurrencyInputCell } from "../../components/common/DataGrid/cells/currencyInput";
import { DisabledCurrencyInputCell } from "../../components/common/DataGrid/cells/disabledCurrencyInput";
import { CompetenciaInput } from "../../components/common/DataGrid/cells/competencia";
import { DateInput } from "../../components/common/DataGrid/cells/dateInput";
import { SelectAutoCompleteCell } from "../../components/common/DataGrid/cells/selectAutoComplete";

import { queryClient } from "../../App";
import { TableActions } from "../../components/common/DataGrid/cells/tableActions";
import { DefaultComponent } from "../../components/common/buildForm/filds/default";
import { BuildForm } from "../../components/common/buildForm/index";
import { VisibilityControlDialog } from "../../components/common/visibilityControllerDialog";
import { DebouncedInput } from "../../components/common/debouncedInput";

export function Servicos() {
  const toast = useToast();

  const { filters, resetFilters, setFilters } = useFilters({
    key: "SERVICOS",
  });

  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    key: "SERVICOS",
  });

  const {
    columnSizing,
    columnSizingInfo,
    setColumnSizing,
    setColumnSizingInfo,
  } = useColumnSizing({
    key: "SERVICOS",
  });

  const sortingState = sortByToState(filters.sortBy);

  const paginationState = {
    pageIndex: filters.pageIndex ?? 0,
    pageSize: filters.pageSize ?? 10,
  };

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
      enableSorting: true,
      cell: (props) => (
        <Text noOfLines={1}>{`${props.getValue()?.sid ?? ""} - ${
          props.getValue()?.documento ?? ""
        } - ${props.getValue()?.nome ?? ""}`}</Text>
      ),
    },
    {
      accessorKey: "dataProvisaoContabil",
      header: "Data Provisão Contábil",
      enableSorting: true,
      cell: DateInput,
    },
    {
      accessorKey: "dataRegistro",
      header: "Data Registro",
      enableSorting: true,
      cell: DateInput,
    },
    {
      accessorKey: "competencia",
      header: "Competência - Mês",
      enableSorting: true,
      cell: CompetenciaInput,
    },
    {
      accessorKey: "valor",
      header: "Valor",
      enableSorting: true,
      cell: DisabledCurrencyInputCell,
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      header: "Documento Fiscal",
      enableSorting: true,
      cell: (props) => <div>{props.getValue()}</div>,
    },
    {
      accessorKey: "campanha",
      header: "Campanha",
      enableSorting: true,
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[{ value: "campanha", label: "campanha" }]}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: (props) => <div>{props.getValue()}</div>,
    },

    {
      accessorKey: "valores.grossValue",
      header: "Gross Value",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.bonus",
      header: "Bonus",
      enableSorting: true,
      cell: CurrencyInputCell,
      enableColumnFilter: true,
      meta: { filterKey: "valores.bonus" },
    },
    {
      accessorKey: "valores.ajusteComercial",
      header: "Ajuste Comercial",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.paidPlacement",
      header: "Paid Placement",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionMonthProvision",
      header: "Revisão - Mês Provisão",
      enableSorting: true,
      cell: InputCell,
    },
    {
      accessorKey: "valores.revisionGrossValue",
      header: "Revisão - Gross Value",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionProvisionBonus",
      header: "Revisão - Bonus",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionComissaoPlataforma",
      header: "Revisão - Comissão Plataforma",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.revisionPaidPlacement",
      header: "Revisão - Paid Placement",
      enableSorting: true,
      cell: CurrencyInputCell,
    },
    {
      accessorKey: "valores.totalServico",
      header: "Total Serviço",
      enableSorting: true,
      cell: DisabledCurrencyInputCell,
    },
    {
      accessorKey: "valores.totalRevisao",
      header: "Total Revisão",
      enableSorting: true,
      cell: DisabledCurrencyInputCell,
    },
  ];

  const fields = [
    {
      accessorKey: "prestador",
      label: "Prestador",
      render: DefaultComponent,
    },
    {
      accessorKey: "dataProvisaoContabil",
      label: "Data Provisão Contábil",
      render: DefaultComponent,
    },
    {
      accessorKey: "dataRegistro",
      label: "Data Registro",
      render: DefaultComponent,
    },
    {
      accessorKey: "competencia",
      label: "Competência - Mês",
      render: DefaultComponent,
    },
    {
      accessorKey: "valor",
      label: "Valor",
      render: DefaultComponent,
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
      accessorKey: "status",
      label: "Status",
      render: DefaultComponent,
    },

    {
      accessorKey: "valores.grossValue",
      label: "Gross Value",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.bonus",
      label: "Bonus",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.ajusteComercial",
      label: "Ajuste Comercial",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.paidPlacement",
      label: "Paid Placement",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.revisionMonthProvision",
      label: "Revisão - Mês Provisão",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.revisionGrossValue",
      label: "Revisão - Gross Value",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.revisionProvisionBonus",
      label: "Revisão - Bonus",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.revisionComissaoPlataforma",
      label: "Revisão - Comissão Plataforma",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.revisionPaidPlacement",
      label: "Revisão - Paid Placement",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.totalServico",
      label: "Total Serviço",
      render: DefaultComponent,
    },
    {
      accessorKey: "valores.totalRevisao",
      label: "Total Revisão",
      render: DefaultComponent,
    },
  ];

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-prestadores", { filters }],
    queryFn: async () => await listarServicos({ filters }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: updateServicoMutation } = useMutation({
    mutationFn: async ({ id, data }) => await api.patch(`servicos/${id}`, data),
    onSuccess() {
      queryClient.refetchQueries(["listar-servicos", { filters }]);
      toast({
        title: "Serviço atualizado com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao atualizar o serviço",
        status: "error",
      });
    },
  });

  const { mutateAsync: deleteServicoMutation } = useMutation({
    mutationFn: async ({ id }) => await api.delete(`servicos/${id}`),
    onSuccess() {
      queryClient.refetchQueries(["listar-servicos", { filters }]);
      toast({
        title: "Serviço excluído com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao excluir serviço",
        status: "error",
      });
    },
  });

  return (
    <Box>
      {/* <Flex justifyContent="space-between">
        <Flex alignItems="center" gap="4">
          <DebouncedInput
            value={filters.searchTerm}
            debounce={700}
            onChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                searchTerm: value,
                pageIndex: 0,
              }));
            }}
            size="sm"
            color="gray.700"
          />
          <Button
            size="sm"
            variant="subtle"
            color="brand.500"
            fontWeight="semibold"
            onClick={resetFilters}
          >
            Limpar filtros
          </Button>
          {(isLoading || isFetching) && (
            <Box>
              <Spinner
                thickness="3px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
              />
            </Box>
          )}
        </Flex>
        <Flex alignItems="center">
          <Button
            onClick={() => {
              console.log("Clicou");
            }}
            size="sm"
            variant="subtle"
            color="brand.500"
            fontWeight="semibold"
          >
            Criar serviço
          </Button>

          <VisibilityControlDialog
            fields={columns.map((e) => ({
              label: e.header,
              accessorKey: e.accessorKey.replaceAll(".", "_"),
            }))}
            setVisibilityState={setColumnVisibility}
            visibilityState={columnVisibility}
            title="Ocultar coluna"
          />
        </Flex>
      </Flex>

      <DataGrid
        filters={filters}
        sorting={sortingState}
        columns={columns}
        pagination={paginationState}
        data={data?.servicos || []}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnSizing={columnSizing}
        columnSizingInfo={columnSizingInfo}
        setColumnSizing={setColumnSizing}
        setColumnSizingInfo={setColumnSizingInfo}
        onUpdateData={async (values) => {
          await updateServicoMutation({
            id: values.prestadorId,
            data: values.data,
          });
        }}
        onDeleteData={async (values) => {
          await deleteServicoMutation({
            id: values.id,
          });
        }}
        onFilterChange={(value) => {
          setFilters((prev) => ({ ...prev, ...value, pageIndex: 0 }));
        }}
        paginationOptions={{
          onPaginationChange: (pagination) => {
            setFilters(pagination);
          },
          rowCount: data?.pagination?.totalItems,
        }}
        onSortingChange={(updaterOrValue) => {
          return setFilters((prev) => ({
            ...prev,
            sortBy: stateToSortBy(updaterOrValue(sortingState)),
          }));
        }}
      /> */}

      {/* <BuildForm
        fields={fields}
        // visibleState={inputsVisibility}
        data={[]}
        onBlurFn={(values) => console.log(values)}
      /> */}
    </Box>
  );
}
