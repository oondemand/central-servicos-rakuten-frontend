import { DebouncedInput } from "../debouncedInput";
import { Select } from "@chakra-ui/react";

export function Filter({ fieldMeta, onChange, value }) {
  if (fieldMeta.filterVariant && fieldMeta.filterVariant) {
    return (
      <Select
        size="xs"
        focusRingColor="brand.500"
        value={value}
        onChange={(e) => {
          onChange({ [fieldMeta.filterKey]: e.target.value });
        }}
      >
        {fieldMeta.filterOptions?.map((item, i) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
        <option value="">Todos</option>
      </Select>
    );
  }

  return (
    <DebouncedInput
      debounce={700}
      size="xs"
      color="gray.700"
      value={value}
      onChange={(value) => onChange({ [fieldMeta.filterKey]: value })}
    />
  );
}
