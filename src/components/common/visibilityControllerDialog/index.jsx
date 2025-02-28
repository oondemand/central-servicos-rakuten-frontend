import { SettingsIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Switch,
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

import { useRef } from "react";

export const VisibilityControlDialog = ({
  title,
  fields,
  visibilityState,
  setVisibilityState,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button colorScheme="gray" variant="ghost" onClick={onOpen}>
        <SettingsIcon />
      </Button>

      {isOpen && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {title}
              </AlertDialogHeader>

              <AlertDialogBody>
                {fields.map((item) => (
                  <Flex key={item.accessorKey} gap="2" mt="1">
                    <Switch
                      size="sm"
                      defaultChecked
                      onChange={(e) => {
                        console.log(e.target.checked);
                        setVisibilityState((prev) => ({
                          ...prev,
                          [item.accessorKey]: e.target.checked,
                        }));
                      }}
                      isChecked={visibilityState[item.accessorKey]}
                    />
                    <Text size="sm" fontWeight="semibold">
                      {item.label}
                    </Text>
                  </Flex>
                ))}
              </AlertDialogBody>
              <AlertDialogCloseButton />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};
