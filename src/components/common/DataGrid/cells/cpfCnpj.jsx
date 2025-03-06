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
          data: {
            [column.columnDef.accessorKey]: value.replace(/[./-]/g, ""),
          },
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
    pf: "999.999.999-99",
    pj: "99.999.999/9999-99",
    ext: null,
  };

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
      ref={withMask(rowMaskMap[row.original.tipo])}
    />
  );
};
