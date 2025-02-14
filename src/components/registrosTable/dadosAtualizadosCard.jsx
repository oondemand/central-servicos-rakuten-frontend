import { Box, Text, Heading, Grid } from "@chakra-ui/react";

export const DadosAtualizadosCard = ({ content }) => {
  return (
    <Box width="700px" p="4" color="gray.700">
      <Heading
        size="sm"
        w="full"
        pb="3"
        mb="2"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        Dados alterados
      </Heading>

      <Box>
        <Text asChild noOfLines={20}>
          <code>{content}</code>
        </Text>
      </Box>
    </Box>
  );
};
