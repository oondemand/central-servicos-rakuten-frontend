import { useEffect, useState } from "react";
import Select from "react-select";

export const SelectAutoCompleteCell = ({
  getValue,
  row,
  column,
  table,
  options,
  ...rest
}) => {
  const initialValue = getValue();

  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (value && value !== options.find((e) => e?.value === initialValue)) {
      console.log(
        { data: { [column.columnDef.key]: value.value } },
        options,
        initialValue
      );
      try {
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
    const value = options?.find((e) => e?.value === initialValue);
    setValue(value);
  }, [initialValue]);
  return (
    <Select
      defaultInputValue={value}
      variant="subtle"
      options={options}
      onBlur={onBlur}
      value={value ?? ""}
      onChange={setValue}
      styles={{
        container: (base) => ({
          ...base,
          border: "none",
          outline: "none",
          padding: 0,
          margin: 0,
          height: "24px",
          fontSize: "15px",
        }),

        control: (base) => ({
          display: "flex",
          border: "none",
          outline: "none",
          padding: 0,
          margin: 0,
          height: "24px",
        }),

        input: (base) => ({
          ...base,
          display: "flex",
          border: "none",
          outline: "none",
          height: "24px",
          padding: 0,
          margin: 0,
        }),

        menu: (base) => ({
          ...base,
          scrollbarWidth: "thin",
          border: "none",
          outline: "none",
        }),
        menuList: (base) => ({
          ...base,
          scrollbarWidth: "thin",
          backgroundColor: "white",
        }),
        placeholder: (base) => ({
          ...base,
          truncate: true,
          display: "none",
        }),
        indicatorSeparator: (base) => ({
          display: "none",
        }),
      }}
    />
  );
};
