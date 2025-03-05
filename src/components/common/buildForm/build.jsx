import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, GridItem, Heading, Input } from "@chakra-ui/react";
import { z } from "zod";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

function buildNestedSchema(fields) {
  const schemaStructure = fields.reduce((acc, field) => {
    const parts = field.accessorKey?.split(".");
    let currentLevel = acc;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        currentLevel[part] = field.validation;
      } else {
        currentLevel[part] = currentLevel[part] || {};
        currentLevel = currentLevel[part];
      }
    }

    return acc;
  }, {});

  // Converter a estrutura para esquema Zod recursivamente
  const createRecursiveSchema = (structure) => {
    const entries = Object.entries(structure).map(([key, value]) => {
      if (value instanceof z.ZodType) {
        return [key, value];
      } else {
        return [key, createRecursiveSchema(value)];
      }
    });

    return z.object(Object.fromEntries(entries));
  };

  return createRecursiveSchema(schemaStructure);
}

export const Build = ({
  visibleState,
  fields,
  onSubmit,
  data,
  gridColumns = 4,
  ...props
}) => {
  const schema = buildNestedSchema(fields);

  const methods = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      ...data,
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = methods;

  console.log(errors);

  return (
    <FormProvider {...methods}>
      <form onBlur={handleSubmit(onSubmit)}>
        <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap="4">
          {fields.map((field) => {
            if (visibleState && !visibleState[field.accessorKey]) return null;
            const { render, ...rest } = field;

            return (
              <GridItem
                key={field.accessorKey}
                colSpan={field?.colSpan ? field.colSpan : 1}
              >
                {field.render({
                  getInitialValue: () =>
                    getNestedValue(props?.data, field.accessorKey),
                  initialValue: getNestedValue(props?.data, field.accessorKey),
                  field: register(field.accessorKey),
                  error: getNestedValue(errors, field.accessorKey)?.message,
                  ...rest,
                  ...props,
                  ...methods,
                })}
              </GridItem>
            );
          })}
        </Grid>
      </form>
    </FormProvider>
  );
};
