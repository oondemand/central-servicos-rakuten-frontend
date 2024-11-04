// src/components/configuracoes/CrudModal.js
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import FormField from "../common/FormField";
import * as Yup from "yup";

const CrudModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  initialValues,
  validationSchema,
  formFields,
  isEditMode,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                {formFields
                  .filter(({ name }) => name !== "senha" || !isEditMode) 
                  .map(({ label, name, type, options }) => (
                    <FormField
                      key={name}
                      label={label}
                      name={name}
                      type={type}
                      options={options}
                    />
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Salvar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CrudModal;
