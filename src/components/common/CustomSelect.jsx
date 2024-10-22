// src/components/common/CustomSelect.js
import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useField, useFormikContext } from "formik";

const CustomSelect = ({ name, options, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const isInvalid = meta.touched && meta.error;

  const handleSelect = (value) => {
    setFieldValue(name, value);
  };

  const selectedLabel =
    options.find((option) => option.value === field.value)?.label ||
    `Selecione`;

  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          bg="brand.50"
          color="brand.500"
          borderColor="brand.300"
          _hover={{ bg: "brand.100" }}
          {...props}
        >
          {selectedLabel}
        </MenuButton>
        <MenuList bg="brand.200">
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
              bg={field.value === option.value ? "brand.300" : "brand.50"}
              _hover={{ bg: "brand.200" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {isInvalid && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
  );
};

export default CustomSelect;
