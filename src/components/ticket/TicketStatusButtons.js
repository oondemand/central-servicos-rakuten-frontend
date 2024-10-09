// src/components/ticket/TicketStatusButtons.js
import React from "react";
import { FormControl, FormLabel, Button, ButtonGroup } from "@chakra-ui/react";

const TicketStatusButtons = ({ formik }) => {
  const handleStatusChange = async (newStatus) => {
    formik.setFieldValue("status", newStatus);
  };

  return (
    <FormControl mb={3} flex="0 0 25%" ml={4}>
      <FormLabel>Status</FormLabel>
      <ButtonGroup spacing={4} direction="column">
        <Button
          onClick={() => handleStatusChange("aguardando-inicio")}
          colorScheme={formik.values.status === "aguardando-inicio" ? "yellow" : "gray"}
        >
          Aguardando Início
        </Button>
        <Button
          onClick={() => handleStatusChange("trabalhando")}
          colorScheme={formik.values.status === "trabalhando" ? "green" : "gray"}
        >
          Trabalhando
        </Button>
        <Button
          onClick={() => handleStatusChange("revisao")}
          colorScheme={formik.values.status === "revisao" ? "red" : "gray"}
        >
          Revisão
        </Button>
      </ButtonGroup>
    </FormControl>
  );
};

export default TicketStatusButtons;
