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

  const getPlaceholder = () => {
    if (label) {
      return `Digite ${label.toLowerCase()}`;
    } else {
      // Alternativa: usar o nome do campo com formatação
      return ``;
    }
  };

  return (
    <FormControl isInvalid={isInvalid} mb={4} >
      {label && <FormLabel  htmlFor={name}>{label}</FormLabel> }
      {type === "select" ? (
        <CustomSelect label={label} name={name} options={options} {...props} />
      ) : type === "textarea" ? (
        <Field as={Textarea} id={name} name={name} {...props} bgColor={"#fff"}/>
      ) : mask ? (
        <Field name={name} bgColor={"#fff"}>
          {({ field }) => (
            <InputMask mask={mask} {...field} {...props}>
              {(inputProps) => (
                <Input 
                  {...inputProps}
                  ref={inputRef}
                  id={name}
                  type={type}
                  placeholder={getPlaceholder()}
                />
              )}
            </InputMask>
          )}
        </Field>
      ) : (
        <Field
        bgColor={"#fff"}
       
          as={Input}
          id={name}
          name={name}
          type={type}
          placeholder={getPlaceholder()}
          {...props}
        />
      )}
      <FormErrorMessage>{getIn(errors, name) || ""}</FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
