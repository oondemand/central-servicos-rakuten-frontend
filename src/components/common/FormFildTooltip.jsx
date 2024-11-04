import React, { useState } from "react";
import { useField } from "formik";
import {
  Tooltip,
  Input
} from "@chakra-ui/react";

const FormFieldTooltip = ({ name, placeholder, type = "text", ...props }) => {
  const [field, meta] = useField(name);
  const [showTooltip, setShowTooltip] = useState(false); 
  const isError = meta.touched && meta.error;

  return (
    <Tooltip
      label={isError ? meta.error : ""}
      hasArrow
      isOpen={isError && showTooltip} 
      bg="red.500"
      color="white"
      placement="top"
    >
      <Input
        {...field}
        {...props}
        placeholder={placeholder}
        type={type}
        borderColor={isError ? "red.500" : "gray.300"} 
        _hover={{ borderColor: isError ? "red.600" : "gray.400" }} 
        onMouseEnter={() => setShowTooltip(true)} 
        onMouseLeave={() => setShowTooltip(false)} 
      />
    </Tooltip>
  );
};

export default FormFieldTooltip;
