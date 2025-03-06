import { Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";

export const CurrencyInput = ({ ...props }) => {
  console.log("Disabled", props.disabled, props?.initialValue);

  useEffect(() => {}, [props?.initialValue]);
  return (
    <Box>
      <Box borderBottom="1px solid" borderBottomColor="gray.200">
        <Text fontSize="sm" color="gray.700">
          {props.label}
        </Text>
        <NumericFormat
          disabled={props?.disabled}
          // defaultValue={props?.initialValue}
          value={props?.initialValue}
          name={props.field.name}
          onBlur={props.field.onBlur}
          onChange={props.field.onChange}
          getInputRef={props.field.ref}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative
          prefix="R$ "
          placeholder="R$ 0,00"
          style={{
            outline: "none",
            padding: "4px",
          }}
        />
      </Box>
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
