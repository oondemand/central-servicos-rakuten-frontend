import { Input, Box, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";

export const TextareaField = ({ inputStyle, w, ...props }) => {
  const [value, setValue] = useState("");

  const onblur = async () => {
    if (value !== "" && value !== props?.data?.[props.accessorKey]) {
      await props.onBlurFn({ body: { [props.accessorKey]: value } });
      props.data && (props.data[props.accessorKey] = value);
      return;
    }
  };

  return (
    <Box>
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Textarea
        fontSize="sm"
        w="w"
        mb="1"
        variant="flushed"
        disabled={props.disabled ?? !props.data}
        value={value}
        onBlur={onblur}
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  );
};
