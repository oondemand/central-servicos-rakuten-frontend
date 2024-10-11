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
import CustomSelect from "./CustomSelect";

const FormField = ({ label, name, type = "text", options = [], mask, ...props }) => {
  const { touched, errors } = useFormikContext();

  const isInvalid = getIn(touched, name) && getIn(errors, name);

  const inputRef = useRef(null);

  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {type === "select" ? (
        <CustomSelect label={label} name={name} options={options} {...props} />
      ) : type === "textarea" ? (
        <Field as={Textarea} id={name} name={name} {...props} />
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
        />
      )}
      <FormErrorMessage>{getIn(errors, name) || ""}</FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
