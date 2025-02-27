import {
  TabPanel,
  Heading,
  Input,
  Text,
  Button,
  Flex,
  Box,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../../services/api";

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

      <Accordion defaultIndex={[]} allowToggle allowMultiple>
        {queryState?.data &&
          queryState?.data?.map((lista) => (
            <AccordionItem>
              {({ isExpanded, isDisabled }) => {
                return (
                  <>
                    <Flex>
                      <AccordionButton
                        display="flex"
                        justifyContent="space-between"
                        px="4"
                      >
                        <Flex gap="6">
                          <Text fontSize="md" fontWeight="semibold">
                            {lista?.codigo.charAt(0).toUpperCase() +
                              lista?.codigo.slice(1).replace(/[-_]/g, " ")}
                          </Text>
                          <Button
                            size="xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onFormSubmit({ id: lista._id, values: {} });
                            }}
                          >
                            Adicionar
                          </Button>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                    </Flex>
                    <AccordionPanel>
                      <Box
                        maxH="300px"
                        overflowY="auto"
                        sx={{ scrollbarWidth: "thin" }}
                      >
                        {lista?.valores &&
                          lista.valores.map((item, i) => {
                            return (
                              <Flex
                                key={item._id}
                                gap="8"
                                mt="2"
                                alignItems="flex-end"
                              >
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
                                    await onDelete({
                                      id: lista._id,
                                      itemId: item._id,
                                    });
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
                    </AccordionPanel>
                  </>
                );
              }}
            </AccordionItem>
          ))}
      </Accordion>
    </TabPanel>
  );
};
