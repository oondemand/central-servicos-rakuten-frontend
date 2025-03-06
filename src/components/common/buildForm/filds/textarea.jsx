import { Box, Text, Textarea } from "@chakra-ui/react";

export const TextareaField = ({ ...props }) => {
  return (
    <Box>
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Textarea fontSize="sm" mb="1" variant="flushed" {...props.field} />
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
