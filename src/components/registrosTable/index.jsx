import {
  Box,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  ButtonGroup,
  Button,
  Text,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Filter } from "../common/filter";
import { DebouncedInput } from "../common/debouncedInput";
import { obterTodosRegistros } from "../../services/controleAlteracao";
import { DadosAtualizadosCard } from "./dadosAtualizadosCard";

const cellWithServicesTooltip = ({ ...props }) => {
  return (
    <Box>
      <Text noOfLines={1}>{props?.getValue()}</Text>
    </Box>
  );
};

const columns = [
  {
    accessorKey: "dataHora",
    header: "Data",
    cell: cellWithServicesTooltip,
    enableColumnFilter: false,
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: cellWithServicesTooltip,
    enableColumnFilter: false,
  },
  {
    accessorKey: "tipoRegistroAlterado",
    header: "Tipo de registro",
    cell: cellWithServicesTooltip,
    enableSorting: false,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { value: "usuario", label: "Usuario" },
        { value: "ticket", label: "Ticket" },
      ],
    },
  },
  {
    accessorKey: "idRegistroAlterado",
    header: "Id",
    cell: cellWithServicesTooltip,
    enableColumnFilter: false,
  },
  {
    accessorKey: "origem",
    header: "Origem",
    cell: cellWithServicesTooltip,
    enableColumnFilter: false,
  },
  {
    accessorKey: "acao",
    header: "Ação",
    cell: cellWithServicesTooltip,
    enableSorting: false,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { value: "adicionar", label: "Adicionar" },
        { value: "alterar", label: "Alterar" },
        { value: "aprovar", label: "Aprovar" },
        { value: "excluir", label: "Excluir" },
        { value: "reprovar", label: "Reprovar" },
        { value: "status", label: "Status" },
      ],
    },
  },
];

// dadosAtualizados

export const RegistrosTable = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // const [selectedRow, setSelectedRow] = useState();
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Box>
        <Flex gap="4" alignItems="center" mb="4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Procurar por todas as colunas.."
          />

          <Button
            onClick={() => {
              setColumnFilters([]);
              setGlobalFilter("");
            }}
          >
            Limpar filtros
          </Button>
        </Flex>

        <Table variant="striped" colorScheme="gray">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    <Flex justifyItems="center" alignItems="center" gap="4">
                      <Box
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.columnDef.header}
                        {
                          {
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted()]
                        }
                      </Box>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tooltip
                hasArrow
                placement="top"
                bg="white"
                borderRadius="sm"
                maxW="700px" // Largura máxima do tooltip
                minW="700px" // Largura mínima garantida
                label={
                  <DadosAtualizadosCard
                    content={row.original?.dadosAtualizados}
                  />
                }
                openDelay={500}
              >
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td fontSize="md" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              </Tooltip>
            ))}
          </Tbody>
        </Table>

        <Box pt="4">
          <Text mb={2}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Text>
          <ButtonGroup size="md">
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
};
