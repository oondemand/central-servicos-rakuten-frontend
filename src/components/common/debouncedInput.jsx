import { Input, InputLeftElement, InputGroup } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SearchIcon } from "@chakra-ui/icons";

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  size = "md",
  iconVisible = true,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value?.trim());
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <InputGroup maxW="md" size={size}>
      {iconVisible && (
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
      )}
      <Input
        maxW="md"
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        borderColor="gray.200"
      />
    </InputGroup>
  );
}
