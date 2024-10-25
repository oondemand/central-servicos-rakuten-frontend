import { Box, Button, Input } from "@chakra-ui/react";
import React, { useRef } from "react";

import { useTicket } from "../../contexts/TicketContext";

import { useFormikContext } from "formik";

export const ArquivosImport = ({ ticketId }) => {
  const inputFileRef = useRef(null);

  const { uploadArquivoDoTicket } = useTicket();
  const { values, setFieldValue } = useFormikContext();

  const handleImportNewFile = async (e) => {
    const response = await uploadArquivoDoTicket(ticketId, [...e.target.files]);
    if (response.status === 201) {
      setFieldValue("arquivos", [
        ...response.data.arquivos,
        ...values.arquivos,
      ]);
    }
  };

  return (
    <Box>
      <Button
        onClick={() => inputFileRef.current.click()}
        colorScheme="teal"
        variant="outline"
      >
        Importar Arquivo
      </Button>
      <Input
        type="file"
        ref={inputFileRef}
        onChange={handleImportNewFile}
        style={{ display: "none" }}
        multiple={true}
        accept=".jpeg, .jpg, .png, .pdf, .xml, .txt"
      />
    </Box>
  );
};
