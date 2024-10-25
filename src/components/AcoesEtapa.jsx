import React, { useRef } from "react";
import {
  Box,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import ImportacaoComissoes from "./form/ImportacaoComissoes";
import IntegracaoRPAs from "./form/IntegracaoRPAs";

const AcoesEtapa = ({ etapa, setIsAddModalOpen }) => {
  const {
    isOpen: isOpenImportarComissoes,
    onOpen: onOpenImportarComissoes,
    onClose: onCloseImportarComissoes,
  } = useDisclosure();
  
  const {
    isOpen: isOpenIntegracaoRPAs,
    onOpen: onOpenIntegracaoRPAs,
    onClose: onCloseIntegracaoRPAs,
  } = useDisclosure();
  
  const handleCadastrarTicket = () => {
    setIsAddModalOpen(true);
  };

  const handleImportarComissoes = () => {
    onOpenImportarComissoes();
  };

  const handleIntegracaoRPAs = async () => {
    onOpenIntegracaoRPAs();
  };

  return (
    <>
      {etapa.codigo === "requisicao" && (
        <Box mt={4}>
          <Button onClick={handleCadastrarTicket} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Novo Ticket
          </Button>
          <Button onClick={handleImportarComissoes} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Importar Comissões
          </Button>
        </Box>
      )}
      {etapa.codigo === "integracao-unico" && (
        <Box mt={4}>
          <Button onClick={handleIntegracaoRPAs} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Integração RPAs
          </Button>
        </Box>
      )}

      <Modal
        isOpen={isOpenImportarComissoes}
        onClose={onCloseImportarComissoes}
        size="6xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent color="brand.800" bg="brand.50" height="90vh" rounded="md" shadow="lg">

          <ModalHeader>Importar Comissões</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <ImportacaoComissoes />
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseImportarComissoes}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenIntegracaoRPAs}
        onClose={onCloseIntegracaoRPAs}
        size="6xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent color="brand.800" bg="brand.50" height="90vh" rounded="md" shadow="lg">
          <ModalHeader>Integração RPAs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <IntegracaoRPAs />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseIntegracaoRPAs}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AcoesEtapa;
