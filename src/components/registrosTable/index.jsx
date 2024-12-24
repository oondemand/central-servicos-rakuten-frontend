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
import { Filter } from "./filter";
import { DebouncedInput } from "./debouncedInput";
import { obterTodosRegistros } from "../../services/controleAlteracao";

const columns = [
  {
    accessorKey: "dataHora",
    header: "Data",
    cell: (props) => <div>{props?.getValue()}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: (props) => <div>{props?.getValue()}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "tipoRegistroAlterado",
    header: "Tipo de registro",
    cell: (props) => <div>{props?.getValue()}</div>,
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
    cell: (props) => <div>{props?.getValue()}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "acao",
    header: "Ação",
    cell: (props) => <div>{props?.getValue()}</div>,
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

export const RegistrosTable = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [selectedRow, setSelectedRow] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <Heading as="h3" color="gray.950" fontSize="xl" mb={4}>
          Registros gerais
        </Heading>
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
              <Tr
                onClick={() => {
                  console.log(row);
                  onOpen();
                  setSelectedRow(row.original);
                }}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td fontSize="md" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
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

        <Modal size="4xl" isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalhes do registro</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDir="column" gap="2">
                <Flex gap="2">
                  <Text fontWeight="600">Data:</Text>
                  <Text>{selectedRow?.dataHora}</Text>
                </Flex>
                <Flex gap="2">
                  <Text fontWeight="600">Usuario:</Text>
                  <Text>{selectedRow?.usuario}</Text>
                </Flex>
                <Flex gap="2">
                  <Text fontWeight="600">Tipo de registro:</Text>
                  <Text>{selectedRow?.tipoRegistroAlterado}</Text>
                </Flex>
                <Flex gap="2">
                  <Text fontWeight="600">Id registro alterado:</Text>
                  <Text>{selectedRow?.idRegistroAlterado}</Text>
                </Flex>
                <Flex gap="2">
                  <Text fontWeight="600">Ação:</Text>
                  <Text>{selectedRow?.acao}</Text>
                </Flex>
                <Flex gap="2">
                  <Text fontWeight="600">Origen:</Text>
                  <Text>{selectedRow?.origem}</Text>
                </Flex>

                <Box>
                  <Text fontWeight="600" fontSize="lg">
                    Dados Atualizados:
                  </Text>
                  <Box maxH="md" overflowY="scroll">
                    <Text color="gray.600" fontWeight="500">
                      {selectedRow?.dadosAtualizados}
                    </Text>
                  </Box>
                </Box>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
