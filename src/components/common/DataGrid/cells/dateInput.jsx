import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { withMask } from "use-mask-input";

export const DateInput = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = new Date(getValue()).toLocaleDateString();
  const [value, setValue] = useState(initialValue || "");

  const onBlur = async () => {
    if (value !== initialValue) {
      const [day, month, year] = value.split("/");
      const newDate = new Date(year, month - 1, day);

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
