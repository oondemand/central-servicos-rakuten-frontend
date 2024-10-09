// src/components/common/FormField.js
import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, ErrorMessage } from "formik";

const FormField = ({
  label,
  name,
  type = "text",
  options = [],
  touched,
  errors,
  mask, // Adicionado para InputMask
  ...props
}) => {
  // Agora, 'touched' e 'errors' são valores individuais
  const isInvalid = touched && errors;

  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {type === "select" ? (
        <Field as={Select} id={name} name={name} placeholder={`Selecione ${label.toLowerCase()}`} {...props}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      ) : type === "textarea" ? (
        <Field
          as={Textarea}
          id={name}
          name={name}
          {...props}
        />
      ) : mask ? (
        // Utilizar InputMask se a prop 'mask' for fornecida
        <Field name={name}>
          {({ field }) => (
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={`Digite ${label.toLowerCase()}`}
              as={props.as} // Permitir a substituição do componente
              mask={mask}
              {...props}
            />
          )}
        </Field>
      ) : (
        <Field
          as={Input}
          id={name}
          name={name}
          type={type}
          placeholder={`Digite ${label.toLowerCase()}`}
          {...props}
        />
      )}
      <FormErrorMessage>
        <ErrorMessage name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
