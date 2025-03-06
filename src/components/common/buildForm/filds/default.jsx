import { Input, Box, Text } from "@chakra-ui/react";

export const DefaultComponent = ({ inputStyle, ...props }) => {
  return (
    <Box>
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Input {...props.field} fontSize="md" mt="-3.5" variant="flushed" />
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
