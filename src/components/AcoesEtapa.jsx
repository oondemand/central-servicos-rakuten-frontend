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
          <Button onClick={handleImportarComissoes} bg="blue.400" color="white" width="100%" fontWeight={700} mb={3}>
            Importar Comissões
          </Button>
          <Button onClick={handleCadastrarTicket} bg="blue.400" color="white" width="100%" mb={3} fontWeight={700}>
            Novo Ticket
          </Button>
        </Box>
      )}
      {etapa.codigo === "integracao-unico" && (
        <Box mt={4}>
          <Button onClick={handleIntegracaoRPAs} bg="blue.400" color="white" width="100%" mb={3} fontWeight={700}>
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
