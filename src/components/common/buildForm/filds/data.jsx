import { Input, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { withMask } from "use-mask-input";

export const DateField = ({ inputStyle, ...props }) => {
  const [value, setValue] = useState("");

  const onblur = async () => {
    if (value !== "" && value !== props?.data?.[props.accessorKey]) {
      const [day, month, year] = value.split("/");
      const newDate = new Date(year, month - 1, day);

      await props.onBlurFn({ body: { [props.accessorKey]: newDate } });
      props.data && (props.data[props.accessorKey] = newDate);
      return;
    }
  };

  return (
    <Box>
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Input
        fontSize="md"
        mt="-3.5"
        w="sm"
        variant="flushed"
        disabled={props.disabled ?? !props.data}
        value={value}
        onBlur={onblur}
        onChange={(e) => setValue(e.target.value)}
        ref={withMask("99/99/9999")}
      />
    </Box>
  );
};
