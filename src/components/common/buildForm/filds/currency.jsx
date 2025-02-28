import { Input, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { parseBRLCurrencyToNumber } from "../../../../utils/formatacoes";

export const CurrencyInput = ({ inputStyle, ...props }) => {
  const [value, setValue] = useState(props?.initialValue ?? "");

  const onblur = async () => {
    if (value !== "" && value !== props?.data?.[props.accessorKey]) {
      await props.onBlurFn({
        body: { [props.accessorKey]: parseBRLCurrencyToNumber(value) },
      });
      props.data &&
        (props.data[props.accessorKey] = parseBRLCurrencyToNumber(value));
      return;
    }
  };

  return (
    <Box borderBottom="1px solid" borderBottomColor="gray.200">
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        allowNegative
        prefix="R$ "
        placeholder="R$ 0,00"
        disabled={props.disabled ?? !props.data}
        value={value}
        onBlur={onblur}
        onChange={(e) => setValue(e.target.value)}
        style={{
          outline: "none",
          padding: "4px",
          width: "380px",
        }}
      />
    </Box>
  );
};
