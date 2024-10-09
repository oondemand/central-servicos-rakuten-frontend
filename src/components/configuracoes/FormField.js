// src/components/common/FormField.js
import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, ErrorMessage } from "formik";

const FormField = ({ label, name, type = "text", options = [], touched, errors }) => {
  const isInvalid = touched[name] && errors[name];
  
  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {type === "select" ? (
        <Field as={Select} id={name} name={name} placeholder={`Selecione ${label.toLowerCase()}`}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          as={Input}
          id={name}
          name={name}
          type={type}
          placeholder={`Digite ${label.toLowerCase()}`}
        />
      )}
      <FormErrorMessage>
        <ErrorMessage name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
