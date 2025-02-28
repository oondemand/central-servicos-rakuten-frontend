import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { withMask } from "use-mask-input";

export const CpfCnpjCell = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

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
    setValue(initialValue);
  }, [initialValue]);

  const rowMaskMap = {
    PF: "999.999.999-99",
    PJ: "99.999.999/999-99",
    EXT: "",
  };

  return (
    <Input
      truncate
      variant="subtle"
      display="flex"
      fontSize="md"
      size="2xs"
      bg="white"
      focusRingColor="brand.500"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      placeholder=""
      ref={withMask(rowMaskMap[row.original.tipo])}
    />
  );
};
