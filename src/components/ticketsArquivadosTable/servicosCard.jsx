import { Box, Text, Heading, Grid } from "@chakra-ui/react";

// Função de formatação de moeda (adicionar fora do componente)
const formatCurrency = (value) => {
  if (typeof value !== "number") return "-"; // Caso o valor seja inválido
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const ServicosCard = ({ servicos }) => {
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
        Serviços
      </Heading>

      {/* Cabeçalho */}
      <Grid
        templateColumns="repeat(6, 1fr)"
        gap={2}
        pb="1"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Text noOfLines={1} minWidth="100px">
          Competência
        </Text>
        <Text noOfLines={1} minWidth="90px">
          Principal
        </Text>
        <Text noOfLines={1} minWidth="50px">
          Bônus
        </Text>
        <Text noOfLines={1} minWidth="120px">
          Ajuste Comercial
        </Text>
        <Text noOfLines={1} minWidth="120px">
          Paid Placement
        </Text>
        <Text noOfLines={1} minWidth="120px">
          Total
        </Text>
      </Grid>

      {/* Linhas de dados */}
      {servicos.map((item, index) => (
        <Grid
          key={index}
          templateColumns="repeat(6, 1fr)"
          gap={2}
          borderBottom={index < servicos.length - 1 ? "1px solid" : "none"}
          borderColor="gray.100"
        >
          {/* Competência (sem formatação monetária) */}
          <Text noOfLines={1} minWidth="100px">
            {item?.competencia}
          </Text>

          {/* Demais valores com formatação */}
          <Text noOfLines={1} minWidth="90px">
            {formatCurrency(item?.valorPrincipal)}
          </Text>
          <Text noOfLines={1} minWidth="50px">
            {formatCurrency(item?.valorBonus)}
          </Text>
          <Text noOfLines={1} minWidth="120px">
            {formatCurrency(item?.valorAjusteComercial)}
          </Text>
          <Text noOfLines={1} minWidth="120px">
            {formatCurrency(item?.valorHospedagemAnuncio)}
          </Text>
          <Text noOfLines={1} minWidth="120px" fontWeight="600">
            {formatCurrency(item?.valorTotal)}
          </Text>
        </Grid>
      ))}
    </Box>
  );
};
