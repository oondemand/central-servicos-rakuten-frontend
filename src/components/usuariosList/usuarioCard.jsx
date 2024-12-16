import { Box, Flex, Button, Text } from "@chakra-ui/react";

export const UsuarioCard = ({ usuario, onEdit, onDelete, onInvite }) => {
  return (
    <Flex mt="6" shadow="sm" p="4" justifyContent="space-between" align="end">
      <Box>
        <Text>
          <strong>Nome:</strong> {usuario.nome}
        </Text>
        <Text>
          <strong>Email:</strong> {usuario.email}
        </Text>
        <Text>
          <strong>Status:</strong> {usuario.status}
        </Text>
        <Text>
          <strong>Tipo:</strong> {usuario.tipo}
        </Text>
      </Box>
      <Flex gap="2">
        <Button size="sm" colorScheme="yellow" isDisabled={true}>
          Editar Senha
        </Button>

        <Button size="sm" colorScheme="blue" onClick={() => onInvite(usuario)}>
          Convidar
        </Button>

        <Button size="sm" colorScheme="yellow" onClick={() => onEdit(usuario)}>
          Editar
        </Button>

        <Button
          size="sm"
          colorScheme="red"
          onClick={() => onDelete(usuario._id)}
        >
          Excluir
        </Button>
      </Flex>
    </Flex>
  );
};
