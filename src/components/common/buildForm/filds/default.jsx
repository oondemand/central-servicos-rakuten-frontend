import { Input, Box, Text } from "@chakra-ui/react";
import { useState } from "react";

export const DefaultComponent = ({ inputStyle, ...props }) => {
  // const [value, setValue] = useState("");

  // const onblur = async () => {
  //   if (value !== "" && value !== props?.data?.[props.accessorKey]) {
  //     await props.onBlurFn({ body: { [props.accessorKey]: value } });
  //     props.data && (props.data[props.accessorKey] = value);
  //     return;
  //   }
  // };

  return (
    <Box>
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Input
        {...props.field}
        fontSize="sm"
        mt="-3.5"
        // w="sm"
        variant="flushed"
        // disabled={props.disabled ?? !props.data}
        // value={value}
        // onBlur={onblur}
        // onChange={(e) => setValue(e.target.value)}
      />
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
