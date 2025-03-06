import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { withMask } from "use-mask-input";
import { parse } from "date-fns";

export const DateInput = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = new Date(getValue()).toLocaleDateString();
  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (value !== initialValue) {
      const newDate = parse(value, "dd/MM/yyyy", new Date());

      try {
        await table.options.meta?.updateData({
          prestadorId: row.original._id,
          data: {
            [column.columnDef.accessorKey]: newDate,
          },
        });
      } catch (error) {
        console.log(error);
        setValue(initialValue);
      }
    }
  };

  useEffect(() => {
    setValue(initialValue ? initialValue : "");
  }, [initialValue]);

  return (
    <Input
      variant="subtle"
      display="flex"
      fontSize="md"
      size="2xs"
      bg="white"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      placeholder=""
      ref={withMask("99/99/9999")}
    />
  );
};
