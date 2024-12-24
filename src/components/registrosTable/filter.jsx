import { Select } from "@chakra-ui/react";
import { DebouncedInput } from "../registrosTable/debouncedInput";

export function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterOptions } = column.columnDef.meta ?? {};

  return filterVariant === "select" ? (
    <Select
      size="sm"
      rounded="md"
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue ? columnFilterValue.toString() : ""}
    >
      {filterOptions?.map((e, i) => (
        <option key={`${e.value}-${i}`} value={e.value}>
          {e.label}
        </option>
      ))}
      <option value="">Todos</option>
    </Select>
  ) : (
    <DebouncedInput
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={columnFilterValue ?? ""}
    />
  );
}
