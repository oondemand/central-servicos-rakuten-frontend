// src/components/common/FormField.js
import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, useFormikContext, getIn } from "formik";
import InputMask from "react-input-mask";
import CustomSelect from "./CustomSelect";

const FormField = ({ label, name, type = "text", options = [], mask, ...props }) => {
  const { touched, errors } = useFormikContext();

  const { maxLength, ...restProps } = props;

  const isInvalid = getIn(touched, name) && getIn(errors, name);

  const getPlaceholder = () => {
    if (label) {
      return `Digite ${label.toLowerCase()}`;
    }
    return "";
  };

  const renderField = () => {
    if (type === "select") {
      return (
        <CustomSelect
          label={label}
          name={name}
          options={options}
          {...restProps}
        />
      );
    }

    if (type === "textarea") {
      return (
        <Field as={Textarea} id={name} name={name} {...restProps} bgColor="#fff" />
      );
    }

    if (mask) {
      return (
        <Field name={name}>
          {({ field }) => (
            <InputMask mask={mask} {...field} {...restProps}>
              {(inputProps) => (
                <Input
                  {...inputProps}
                  id={name}
                  type={type}
                  placeholder={getPlaceholder()}
                  bgColor="#fff"
                />
              )}
            </InputMask>
          )}
        </Field>
      );
    }

    return (
      <Field
        as={Input}
        id={name}
        name={name}
        type={type}
        placeholder={getPlaceholder()}
        bgColor="#fff"
        {...restProps}
      />
    );
  };

  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {renderField()}
      {isInvalid && <FormErrorMessage>{getIn(errors, name)}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormField;
