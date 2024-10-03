import React, { useState, useEffect } from "react";
import { useNFSe } from "../contexts/NfseContext";
import CartaoNfse from "./nfse/CartaoNfse";
import EditNfseModal from "./nfse/EditNfseModal";
import { useDisclosure, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CaixaEntrada = () => {
  const { listaNfses, carregarNfse } = useNFSe();
  const [selectedNfse, setSelectedNfse] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    carregarNfse();
  }, [carregarNfse]);

  const handleEditNfse = (nfse) => {
    setSelectedNfse(nfse);
    onOpen();
  };

  const handleCadastrarNfse = () => {
    setSelectedNfse(null); // Reseta para modo de criação
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedNfse(null);
    onClose();
  };

  return (
    <div className="caixa-entrada p-4">
      <Flex justify="space-between" align="center" mb={4}>
      <h2 className="text-lg font-semibold">Caixa de entrada</h2>
        <IconButton
          aria-label="Cadastrar NFSe"
          icon={<AddIcon />}
          colorScheme="blue"
          onClick={handleCadastrarNfse}
        />
      </Flex>

      <div className="space-y-4">
        {listaNfses.map((nfse) => (
          <CartaoNfse key={nfse._id} nfse={nfse} onClick={() => handleEditNfse(nfse)} />
        ))}
      </div>

      <EditNfseModal
        nfse={selectedNfse}
        isOpen={isOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CaixaEntrada;
