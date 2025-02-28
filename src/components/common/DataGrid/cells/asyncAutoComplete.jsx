import { useEffect, useState } from "react";
import { SelectAutocomplete } from "../../../components/selectAutocomplete";

export const CidadeSelectAutoCompleteCell = ({
  getValue,
  row,
  column,
  table,
  options,
  ...rest
}) => {
  const estado = row.original.endereco.estado;

  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = async () => {
    if (value !== initialValue) {
      try {
        console.log("VALUE", { [column.columnDef.accessorKey]: value.value });

        await table.options.meta?.updateData({
          prestadorId: row.original._id,
          data: { [column.columnDef.accessorKey]: value.value },
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
    <SelectAutocomplete
      onBlur={onBlur}
      value={value}
      setValue={setValue}
      options={options}
    />
  );
};
