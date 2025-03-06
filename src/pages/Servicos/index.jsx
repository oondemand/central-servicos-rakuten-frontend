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
import { VisibilityControlDialog } from "../../components/common/visibilityControllerDialog";
import { DebouncedInput } from "../../components/common/debouncedInput";

import { ServicosDialog } from "./dialog";
import { SelectPrestadorCell } from "../../components/common/DataGrid/cells/selectPrestador";

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
      enableSorting: false,
      cell: (props) => (
        <Text noOfLines={1}>{`${props.getValue()?.nome ?? ""} - ${
          props.getValue()?.sid ?? ""
        } - ${props.getValue()?.documento ?? ""}`}</Text>
      ),
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
      cell: InputCell,
    },
    {
      accessorKey: "campanha",
      header: "Campanha",
      enableSorting: false,
      cell: InputCell,
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

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-servicos", { filters }],
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
      <Flex justifyContent="space-between">
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
          <ServicosDialog />

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
      />
    </Box>
  );
}
