import React from "react";
import { FormControl, FormLabel, Flex, Button } from "@chakra-ui/react";

const TicketStatusButtons = ({ formik }) => {
  const handleStatusChange = async (newStatus) => {
    formik.setFieldValue("status", newStatus);
  };

  return (
    <FormControl mb={3} flex="0 0 25%" ml={4}>
      <FormLabel>Status</FormLabel>
      <Flex flexDirection={"column"} gap={2}>
        <Button
          onClick={() => handleStatusChange("aguardando-inicio")}
          colorScheme={formik.values.status === "aguardando-inicio" ? "yellow" : "gray"}
          mb={2}
        >
          Aguardando Início
        </Button>
        <Button
          onClick={() => handleStatusChange("trabalhando")}
          colorScheme={formik.values.status === "trabalhando" ? "green" : "gray"}
          mb={2}
        >
          Trabalhando
        </Button>
        <Button
          onClick={() => handleStatusChange("revisao")}
          colorScheme={formik.values.status === "revisao" ? "red" : "gray"}
        >
          Revisão
        </Button>
      </Flex>
    </FormControl>
  );
};

export default TicketStatusButtons;