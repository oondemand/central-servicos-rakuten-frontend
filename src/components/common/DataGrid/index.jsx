import {
  Box,
  Table,
  Tr,
  Tbody,
  Th,
  Thead,
  Button,
  Text,
  Flex,
  Td,
  Select,
  // createListCollection,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Filter } from "./datagridFilter";
import { memo, useMemo } from "react";
import { DebouncedInput } from "../debouncedInput";

const pageSizeOptions = [
  { label: "05", value: 5 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "20", value: 20 },
  { label: "25", value: 25 },
];

const sortingIconsMap = {
  asc: "⬆️",
  desc: "⬇️",
  false: "🔃",
};

export const DataGrid = ({
  data,
  filters,
  columns,
  onFilterChange,
  sorting,
  pagination,
  paginationOptions,
  onSortingChange,
  columnVisibility,
  setColumnVisibility,
  columnSizing,
  columnSizingInfo,
  setColumnSizingInfo,
  setColumnSizing,
  onUpdateData,
  onDeleteData,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnSizing,
      columnSizingInfo,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange,
    defaultColumn: {
      minSize: 40,
      maxSize: 800,
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    ...paginationOptions,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnSizingInfoChange: setColumnSizingInfo,
    onColumnSizingChange: setColumnSizing,
    meta: {
      updateData: async (...props) => await onUpdateData(...props),
      deleteData: async (...props) => await onDeleteData(...props),
    },
  });

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <>
      <Box>
        <Box
          overflowX="auto"
          position="relative"
          sx={{ scrollbarWidth: "thin" }}
          pb="2"
        >
          <Table
            size="xs"
            overflowY="scroll"
            colorScheme="gray"
            sx={{ ...columnSizeVars }}
            width={`${table.getTotalSize()}px`}
          >
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const fieldMeta = header.column.columnDef.meta;

                    return (
                      <Th
                        border="1px solid"
                        borderColor="gray.200"
                        px="1"
                        key={header.id}
                        w={`calc(var(--header-${header?.id}-size) * 1px)`}
                        colSpan={header.colSpan}
                        position="relative"
                      >
                        <Flex flexDir="column" p="0.5" gap="0.5">
                          <Flex
                            onClick={
                              () => {}
                              // header.column.getToggleSortingHandler()
                            }
                          >
                            <Flex alignItems="center" gap="2" cursor="pointer">
                              <Text noOfLines={1} fontSize="sm">
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </Text>
                              {/* <Box rounded="full" p="0.5" color="brand.500">
                              {header.column.getCanSort() &&
                                (sortingIconsMap[header.column.getIsSorted()] ??
                                  null)}
                            </Box> */}
                            </Flex>
                          </Flex>

                          {header.column.getCanFilter() &&
                            fieldMeta?.filterKey !== undefined && (
                              <Filter
                                value={filters[fieldMeta?.filterKey] ?? ""}
                                fieldMeta={fieldMeta}
                                onChange={onFilterChange}
                              />
                            )}
                        </Flex>
                        <Box
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          position="absolute"
                          top="0"
                          right="0"
                          w="8px"
                          h="full"
                          bg={
                            header.column.getIsResizing()
                              ? "brand.300"
                              : "brand.200"
                          }
                          cursor="col-resize"
                          userSelect="none"
                          rounded="xs"
                          _hover={{ opacity: 1 }}
                          opacity={header.column.getIsResizing() ? 1 : 0}
                        />
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <MemoizedTableBody
              data={table.options.data}
              columns={table.getVisibleLeafColumns()}
              rows={table.getRowModel().rows}
            />
          </Table>
        </Box>
        <Flex mt="4" alignItems="flex-end" gap="6">
          <Flex flexDir="column" gap="2">
            <Flex alignItems="center" gap="1">
              <Text>Page</Text>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </Flex>
            <Flex gap="2">
              <Button
                size="xs"
                variant="subtle"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </Flex>
          </Flex>

          <Flex gap="4" align="flex-end">
            <Box>
              <Text mb="1">Mostrar</Text>
              <Select
                w="100px"
                size="sm"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  console.log(e.target.value);
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {pageSizeOptions.map((item) => (
                  <option item={item} value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Box>

            <Flex flexDir="column" gap="1">
              <Text>Ir para a página:</Text>
              <DebouncedInput
                debounce={1500}
                iconVisible={false}
                size="sm"
                value={
                  (table.getState().pagination.pageIndex + 1).toString() ?? ""
                }
                onChange={(value) => {
                  const page = Number(value) - 1;
                  table.setPageIndex(page);
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

const TableBody = ({ rows, columns, data }) => {
  return (
    <Tbody>
      {rows.map((row) => (
        <Tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Td
              px="1"
              fontSize="md"
              w={`calc(var(--col-${cell.column.id}-size) * 1px)`}
              key={cell.id}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  );
};

const MemoizedTableBody = memo(TableBody, (prev, next) => {
  if (prev.columns.length !== next.columns.length) {
    return false;
  }

  if (prev.rows.length !== next.rows.length) {
    return false;
  }

  if (prev.data !== next.data) {
    return false;
  }

  return true;
});
