import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";

export const InputCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue || "");

  const onBlur = async () => {
    if (value !== initialValue) {
      try {
        await table.options.meta?.updateData({
          prestadorId: row.original._id,
          data: { [column.columnDef.accessorKey]: value },
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
      color="brand.700"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};
