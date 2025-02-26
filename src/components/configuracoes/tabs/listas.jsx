import {
  TabPanel,
  Heading,
  Input,
  Text,
  Button,
  Flex,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Formik } from "formik";

import { DeleteIcon } from "@chakra-ui/icons";

export const ListasTabs = () => {
  const [queryState, setQueryState] = useState({
    isLoading: false,
    error: false,
    data: null,
  });

  const toast = useToast();

  const getListas = async () => {
    setQueryState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await api.get("listas");
      setQueryState((prev) => ({
        isLoading: false,
        data: response.data,
        error: null,
      }));
    } catch (error) {
      return setQueryState((prev) => ({
        isLoading: false,
        error,
        data: null,
      }));
    }
  };

  useEffect(() => {
    getListas();
  }, []);

  const onFormSubmit = async ({ values, id }) => {
    try {
      await api.post(`listas/${id}`, values);
      getListas();
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao criar item!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onUpdateItem = async ({ itemId, key, value, id }) => {
    try {
      await api.put(`listas/${id}`, {
        itemId,
        [key]: value,
      });
      toast({
        title: "Item atualizado!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao atualizar item!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onDelete = async ({ itemId, id }) => {
    try {
      await api.delete(`listas/${id}/${itemId}`);
      getListas();
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao deletar item!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <TabPanel>
      <Heading as="h3" color="gray.950" fontSize="xl" mb={4}>
        Listas
      </Heading>

      {queryState?.data &&
        queryState?.data?.map((lista) => (
          <Box mt="6">
            <Text fontSize="md" fontWeight="semibold">
              {lista?.codigo.charAt(0).toUpperCase() + lista?.codigo.slice(1)}
            </Text>
            <Box maxH="300px" overflowY="auto" sx={{ scrollbarWidth: "thin" }}>
              {lista?.valores &&
                lista.valores.map((item) => {
                  return (
                    <Flex gap="8" mt="2" alignItems="flex-end">
                      <Input
                        w="sm"
                        size="sm"
                        name="chave"
                        placeholder="chave"
                        variant="flushed"
                        color="gray.600"
                        defaultValue={item?.chave}
                        onBlur={async (ev) => {
                          if (
                            ev.target.value !== "" &&
                            ev.target.defaultValue !== ev.target.value
                          ) {
                            await onUpdateItem({
                              itemId: item._id,
                              id: lista._id,
                              key: ev.target.name,
                              value: ev.target.value,
                            });
                          }
                        }}
                      />
                      <Input
                        w="sm"
                        size="sm"
                        name="valor"
                        color="gray.600"
                        placeholder="valor"
                        variant="flushed"
                        defaultValue={item?.valor}
                        onBlur={async (ev) => {
                          if (
                            ev.target.value !== "" &&
                            ev.target.defaultValue !== ev.target.value
                          ) {
                            await onUpdateItem({
                              itemId: item._id,
                              id: lista._id,
                              key: ev.target.name,
                              value: ev.target.value,
                            });
                          }
                        }}
                      />
                      <Button
                        onClick={async () => {
                          await onDelete({ id: lista._id, itemId: item._id });
                        }}
                        variant="ghost"
                        size="xs"
                      >
                        <DeleteIcon />
                      </Button>
                    </Flex>
                  );
                })}
            </Box>
            <Formik
              initialValues={{
                chave: "",
                valor: "",
              }}
              onSubmit={(values, { resetForm }) => {
                onFormSubmit({ id: lista._id, values });
                resetForm();
              }}
            >
              {(props) => (
                <form onReset={props.handleReset} onSubmit={props.handleSubmit}>
                  <Flex gap="8" mt="2" alignItems="flex-end">
                    <Input
                      w="sm"
                      size="sm"
                      placeholder="chave"
                      variant="flushed"
                      name="chave"
                      color="gray.600"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.chave}
                    />
                    <Input
                      w="sm"
                      size="sm"
                      placeholder="valor"
                      variant="flushed"
                      name="valor"
                      color="gray.600"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.valor}
                    />
                    <Button size="xs" type="submit">
                      Adicionar
                    </Button>
                  </Flex>
                </form>
              )}
            </Formik>
          </Box>
        ))}
    </TabPanel>
  );
};
