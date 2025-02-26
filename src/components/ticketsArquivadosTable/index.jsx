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
  IconButton,
  Tooltip,
  Grid,
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
import { PlusSquareIcon } from "@chakra-ui/icons";
import { ServicosCard } from "./servicosCard";

const cellWithServicesTooltip = ({ ...props }) => {
  return (
    <Box>
      <Text noOfLines={1}>{props?.getValue()}</Text>
    </Box>
  );
};

const columns = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: cellWithServicesTooltip,
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "titulo",
    header: "Descrição",
    enableColumnFilter: false,
    cell: cellWithServicesTooltip,
  },
  {
    accessorKey: "prestador.nome",
    header: "Prestador",
    enableColumnFilter: false,
    cell: cellWithServicesTooltip,
  },
  {
    accessorKey: "prestador.sid",
    header: "SID",
    enableColumnFilter: false,
    cell: cellWithServicesTooltip,
  },
  {
    accessorKey: "prestador.documento",
    header: "Documento",
    enableColumnFilter: false,
    cell: cellWithServicesTooltip,
  },
  {
    accessorKey: "action",
    header: "Ações",
    cell: (props) => {
      return (
        <Button
          display="flex"
          gap="2"
          size="sm"
          variant="solid"
          colorScheme="blue"
          onClick={() =>
            props?.table?.options?.meta?.onRestoreTicket({
              id: props.row.original?._id,
            })
          }
        >
          <PlusSquareIcon fontWeight="bold" fontSize="md" /> Restaurar
        </Button>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];

export const TicketsArquivadoTable = ({ data, onRestoreTicket }) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
    meta: {
      onRestoreTicket,
    },
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
                label={<ServicosCard servicos={row.original?.servicos} />}
                openDelay={500}
              >
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td py="2" fontSize="md" key={cell.id}>
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
