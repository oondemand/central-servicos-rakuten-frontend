import { Box, Text } from "@chakra-ui/react";
import SelectAsync from "react-select/async";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarPrestadores } from "../../../../services/prestadorService";
import api from "../../../../services/api";
import { Controller } from "react-hook-form";

export const SelectPrestadorCell = ({
  getValue,
  row,
  column,
  table,
  options,
  ...props
}) => {
  // const { data, refetch } = useQuery({
  //   queryKey: ["prestadores", { searchTerm }],
  //   staleTime: 1000 * 60 * 10, // 10 minutos
  //   queryFn: listarPrestadores,
  //   enabled: false,
  // });

  const initialValue = getValue();
  const [value, setValue] = useState("");

  const loadOptions = async (props) => {
    console.log("PROPS", props);

    const { data } = await api.get(`/prestadores?searchTerm=${props}`);

    console.log(data);

    const options = data?.prestadores?.map((prestador) => ({
      label: `${prestador?.nome} - ${prestador?.sid} - ${prestador?.documento}`,
      value: prestador?._id,
    }));

    return options;
  };

  const onBlur = async () => {
    console.log("Value", value);

    // if (value && value !== options.find((e) => e?.value === initialValue)) {
    //   console.log(
    //     { data: { [column.columnDef.key]: value.value } },
    //     options,
    //     initialValue
    //   );
    //   try {
    //     await table.options.meta?.updateData({
    //       prestadorId: row.original._id,
    //       data: { [column.columnDef.accessorKey]: value.value },
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     setValue(initialValue);
    //   }
    // }
  };

  useEffect(() => {
    // setValue({
    //   label: `${initialValue?.nome} - ${initialValue?.sid} - ${initialValue?.documento}`,
    //   value: initialValue?._id,
    // });
  }, [initialValue]);

  return (
    <SelectAsync
      // defaultInputValue={value}
      onBlur={onBlur}
      // value={value ?? ""}
      onChange={setValue}
      onInputChange={(e) => {
        console.log(e);
      }}
      cacheOptions
      isClearable
      loadOptions={loadOptions}
      defaultOptions
      variant="subtle"
      styles={{
        container: (base) => ({
          ...base,
          outline: "none",
          padding: 0,
          margin: 0,
          height: "30px",
          fontSize: "15px",
          // zIndex: 500,
        }),

        control: (base) => ({
          display: "flex",
          border: "none",
          outline: "none !important",
          padding: 0,
          height: "30px",
          borderRadius: "0px",
          border: "none",
          // zIndex: 500,
        }),

        input: (base) => ({
          ...base,
          display: "flex",
          outline: "none",
          height: "30px",
          padding: 0,
          margin: 0,
          zIndex: 500,
        }),

        menu: (base) => ({
          ...base,
          scrollbarWidth: "thin",
          border: "none",
          outline: "none",
          // zIndex: 1000,
        }),
        menuList: (base) => ({
          ...base,
          scrollbarWidth: "thin",
          backgroundColor: "white",
          // zIndex: 1000,
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
