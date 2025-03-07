import { Box, useToast, Flex, Spinner, Button } from "@chakra-ui/react";

import { DataGrid } from "../../components/common/DataGrid";

import { useFilters } from "../../contexts/useFilters";
import { useColumnVisibility } from "../../contexts/useColumnVisibility";
import { useColumnSizing } from "../../contexts/useColumnSizing";
import { sortByToState, stateToSortBy } from "../../utils/sorting";

import { listarPrestadores } from "../../services/prestadorService";

import { importarPrestadores } from "../../services/acoesEtapaService";

import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";

import { queryClient } from "../../App";
import { VisibilityControlDialog } from "../../components/common/visibilityControllerDialog";
import { DebouncedInput } from "../../components/common/debouncedInput";

import { PrestadoresDialog } from "./dialog";
import { createPrestadoresColumns } from "./columns";
import { useMemo } from "react";
import api from "../../services/api";
import { ExportDataButton } from "../../components/common/DataGrid/exportData";
import { DropzoneDialog } from "../../components/common/DropzoneDialog";

export default function Prestadores() {
  const toast = useToast();

  const { filters, resetFilters, setFilters } = useFilters({
    key: "PRESTADORES",
  });

  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    key: "PRESTADORES",
  });

  const {
    columnSizing,
    columnSizingInfo,
    setColumnSizing,
    setColumnSizingInfo,
  } = useColumnSizing({
    key: "PRESTADORES",
  });

  const sortingState = sortByToState(filters.sortBy);

  const paginationState = {
    pageIndex: filters.pageIndex ?? 0,
    pageSize: filters.pageSize ?? 10,
  };

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-prestadores", { filters }],
    queryFn: async () => await listarPrestadores({ filters }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: updatePrestadorMutation } = useMutation({
    mutationFn: async ({ id, data }) =>
      await api.patch(`prestadores/${id}`, data),
    onSuccess() {
      queryClient.refetchQueries(["listar-prestadores", { filters }]);
      toast({
        title: "Prestador atualizado com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao atualizar o prestador",
        status: "error",
      });
    },
  });

  const { mutateAsync: deletePrestadorMutation } = useMutation({
    mutationFn: async ({ id }) => await api.delete(`prestadores/${id}`),
    onSuccess() {
      queryClient.refetchQueries(["listar-prestadores", { filters }]);
      toast({
        title: "Prestador excluído com sucesso",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao excluir prestador",
        status: "error",
      });
    },
  });

  const { mutateAsync: importPrestadoresMutation } = useMutation({
    mutationFn: async ({ files }) => await importarPrestadores({ files }),
    onSuccess() {
      queryClient.refetchQueries(["listar-prestadores", { filters }]);
      toast({
        title: "Arquivo enviado",
        description: "Aguardando processamento.",
        status: "info",
      });
    },
    onError: (error) => {
      toast({
        title: "Ouve um erro ao enviar arquivo!",
        status: "error",
      });
    },
  });

  const columns = createPrestadoresColumns();

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
          <PrestadoresDialog />

          <DropzoneDialog
            onHandleSendFile={async ({ files }) =>
              await importPrestadoresMutation({ files })
            }
          />

          <ExportDataButton columns={columns} data={data?.prestadores} />

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

      <Box p="0.5" />

      <DataGrid
        filters={filters}
        sorting={sortingState}
        columns={columns}
        pagination={paginationState}
        data={data?.prestadores || []}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnSizing={columnSizing}
        columnSizingInfo={columnSizingInfo}
        setColumnSizing={setColumnSizing}
        setColumnSizingInfo={setColumnSizingInfo}
        onUpdateData={async (values) => {
          await updatePrestadorMutation({
            id: values.prestadorId,
            data: values.data,
          });
        }}
        onDeleteData={async (values) => {
          await deletePrestadorMutation({
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
