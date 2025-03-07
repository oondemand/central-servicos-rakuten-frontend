import {
  Box,
  Input,
  Button,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Flex,
  ListItem,
  ListIcon,
  List,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { useRef, useState } from "react";
import { AttachmentIcon } from "@chakra-ui/icons";

const FilesList = ({ files, ...props }) => {
  return (
    <List {...props}>
      {files.map((file, i) => {
        return (
          <ListItem key={`${file.name}-${i}`}>
            <ListIcon as={AttachmentIcon} color="gray.500" />
            {file.name} - {(file.size / 1024).toFixed(2)} KB
          </ListItem>
        );
      })}
    </List>
  );
};

export function DropzoneDialog({ accept, onHandleSendFile }) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        size="sm"
        variant="subtle"
        color="brand.500"
        fontWeight="semibold"
        _hover={{ backgroundColor: "brand.50" }}
      >
        Importar planilha
      </Button>

      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setFiles([]);
          }}
          leastDestructiveRef={cancelRef}
          isCentered
          size="6xl"
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader
                display="flex"
                gap="2"
                alignItems="center"
                fontSize="lg"
                fontWeight="bold"
              >
                Importar arquivo
              </AlertDialogHeader>
              <AlertDialogBody minH="80" pb="8">
                <Flex
                  height="60"
                  alignItems="center"
                  justifyContent="center"
                  border="2px dashed"
                  borderColor="gray.300"
                  rounded="md"
                  {...getRootProps({ className: "dropzone" })}
                >
                  <Input {...getInputProps()} />
                  <Text>Arrate um arquivo ou clique para selecionar.</Text>
                </Flex>

                <FilesList files={files} mt="8" />
              </AlertDialogBody>
              <AlertDialogFooter>
                <Flex gap="2">
                  <Button onClick={onClose}>Cancelar</Button>
                  <Button
                    onClick={async () => {
                      await onHandleSendFile({ files });
                      // setFiles([]);
                      onClose();
                    }}
                  >
                    Enviar
                  </Button>
                </Flex>
              </AlertDialogFooter>
              <AlertDialogCloseButton />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
}
