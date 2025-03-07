import { Select, Box, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

export const SelectField = ({ options, ...props }) => {
  return (
    <Box>
      <Box>
        <Text fontSize="sm">{props.label}</Text>
        <Controller
          name={props.field.name}
          control={props.methods.control}
          render={({ field }) => (
            <Select
              onBlur={field.onBlur}
              value={field.value}
              onChange={field.onChange}
              border="none"
              rounded="none"
              borderBottom="1px solid"
              borderBottomColor="gray.200"
              fontSize="sm"
              mt="-2"
              outline="none"
              focusBorderColor="transparent"
              ringColor="transparent"
              placeholder="Selecione uma opção"
              paddingLeft="0"
              marginLeft="0"
            >
              {options?.map((item, i) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          )}
        />
      </Box>
      <Text pt="-2.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
