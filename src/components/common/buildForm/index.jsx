import { Box, Flex } from "@chakra-ui/react";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

export const BuildForm = ({
  flexStyles,
  containerStyles,
  visibleState,
  fields,
  onBlurFn,
  onlyReading,
  fieldsWidth,
  ...props
}) => {
  return (
    <Flex gap="4" wrap="wrap" w="full" {...flexStyles}>
      {fields.map((e, i) => {
        const { render, ...rest } = e;

        return (
          <Box
            display={
              visibleState
                ? visibleState[e.accessorKey] === false && "none"
                : true
            }
            {...containerStyles}
            key={e.accessorKey}
          >
            {e.render({
              onBlurFn,
              w: fieldsWidth,
              getInitialValue: () => getNestedValue(props?.data, e.accessorKey),
              initialValue: getNestedValue(props?.data, e.accessorKey),
              ...rest,
              ...props,
            })}
          </Box>
        );
      })}
    </Flex>
  );
};
