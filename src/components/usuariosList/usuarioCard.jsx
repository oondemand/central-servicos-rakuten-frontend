import { Box, Flex, Button, Text } from "@chakra-ui/react";

export const UsuarioCard = ({
  usuario,
  onEdit,
  onDelete,
  onInvite,
  onEditPassword,
}) => {
  return (
    <Flex mt="6" shadow="sm" p="4" justifyContent="space-between" align="end">
      <Box>
        <Text color="gray.950">
          <strong>Nome:</strong> {usuario.nome}
        </Text>
        <Text color="gray.950">
          <strong>Email:</strong> {usuario.email}
        </Text>
        <Text color="gray.950">
          <strong>Status:</strong> {usuario.status}
        </Text>
        <Text color="gray.950">
          <strong>Tipo:</strong> {usuario.tipo}
        </Text>
      </Box>
      <Flex gap="2">
        <Button
          size="sm"
          colorScheme="yellow"
          onClick={() => onEditPassword(usuario.email)}
        >
          Atualizar senha
        </Button>

        <Button
          size="sm"
          isDisabled={usuario.tipo !== "prestador"}
          colorScheme="blue"
          onClick={() => onInvite(usuario)}
        >
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
