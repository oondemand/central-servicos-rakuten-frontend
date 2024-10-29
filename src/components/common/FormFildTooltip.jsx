import React from 'react';
import { useField } from 'formik';
import { Tooltip, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

const FormFieldTooltip = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <FormControl isInvalid={hasError} mb={4}>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Tooltip 
        label={meta.error} 
        isOpen={hasError} 
        hasArrow 
        bg="red.500" 
        color="white"
        placement="top" 
      >
        <Input {...field} {...props} borderColor={hasError ? "red.500" : "gray.200"} />
      </Tooltip>
    </FormControl>
  );
};

export default FormFieldTooltip;
