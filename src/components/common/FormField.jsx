// src/components/common/FormField.js
import React, { useRef } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, useFormikContext, getIn } from "formik";
import InputMask from "react-input-mask";

const FormField = ({ label, name, type = "text", options = [], mask, ...props }) => {
  const { touched, errors } = useFormikContext();

  const isInvalid = getIn(touched, name) && getIn(errors, name);

  const inputRef = useRef(null);

  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {type === "select" ? (
        <Field
          as={Select}
          id={name}
          name={name}
          placeholder={`Selecione ${label.toLowerCase()}`}
          {...props}
          color="brand.500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      ) : type === "textarea" ? (
        <Field as={Textarea} id={name} name={name} {...props} color="brand.500" />
      ) : mask ? (
        <Field name={name}>
          {({ field }) => (
            <InputMask mask={mask} {...field} {...props}>
              {(inputProps) => (
                <Input
                  {...inputProps}
                  ref={inputRef}
                  id={name}
                  type={type}
                  color="brand.500"
                  placeholder={`Digite ${label.toLowerCase()}`}
                />
              )}
            </InputMask>
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
          color="brand.500"
        />
      )}
      <FormErrorMessage>{getIn(errors, name) || ""}</FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
