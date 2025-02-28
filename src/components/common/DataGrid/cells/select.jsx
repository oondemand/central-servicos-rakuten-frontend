import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";

export const SelectCell = ({ getValue, row, column, table, ...rest }) => {
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
  return (
    <Select
      onBlur={onBlur}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="sm"
      border="none"
    >
      {column.columnDef.meta.filterOptions?.map((item, i) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </Select>
  );
};
