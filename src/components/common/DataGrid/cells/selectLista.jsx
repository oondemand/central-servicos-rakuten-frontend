import { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { ListaService } from "../../../../services/lista";

export const SelectLista = ({ getValue, row, column, table, cod, ...rest }) => {
  const { data: lista } = useQuery({
    queryFn: async () => ListaService.obterListaPorCodigo({ cod }),
    queryKey: [`list-${cod}`],
    staleTime: 1000 * 60 * 10,
  });

  const options = lista?.valores?.map((e) => ({
    label: e?.chave ? e.chave : e?.valor,
    value: e?.valor ? e.valor : e?.chave,
  }));

  const initialValue = getValue();
  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (
      value &&
      value?.value !==
        options.find(
          (item) => item?.label == initialValue || item?.value == initialValue
        ).value
    ) {
      try {
        await table.options.meta?.updateData({
          prestadorId: row.original._id,
          data: { [column.columnDef.accessorKey]: value.value },
        });
      } catch (error) {
        console.log(error);
        const value = options?.find(
          (e) => e?.chave === initialValue || e?.valor === initialValue
        );

        setValue(value);
      }
    }
  };

  useEffect(() => {
    const value = options?.find((item) => {
      return item?.label == initialValue || item?.value == initialValue;
    });

    setValue(value);
  }, [initialValue, lista]);
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
