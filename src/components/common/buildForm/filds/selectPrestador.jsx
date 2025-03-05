import { Box, Text } from "@chakra-ui/react";
import SelectAsync from "react-select/async";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarPrestadores } from "../../../../services/prestadorService";
import api from "../../../../services/api";

export const SelectPrestadorField = ({ ...props }) => {
  const [value, setValue] = useState("");

  // const { data, refetch } = useQuery({
  //   queryKey: ["prestadores", { searchTerm }],
  //   staleTime: 1000 * 60 * 10, // 10 minutos
  //   queryFn: listarPrestadores,
  //   enabled: false,
  // });

  const loadOptions = async (props) => {
    const { data } = await api.get(`/prestadores?searchTerm=${props}`);

    const options = data?.prestadores?.map((prestador) => ({
      label: `${prestador?.nome} - ${prestador?.sid} - ${prestador?.documento}`,
      value: prestador?._id,
    }));

    return options;
  };

  const onblur = async () => {
    if (value !== "" && value !== props?.data?.[props.accessorKey]) {
      await props.onBlurFn({ body: { [props.accessorKey]: value.value } });
      props.data && (props.data[props.accessorKey] = value.value);
      return;
    }
  };

  return (
    <Box>
      <Text fontSize="sm">Prestador</Text>
      <SelectAsync
        cacheOptions
        isClearable
        loadOptions={loadOptions}
        defaultOptions
        variant="subtle"
        onBlur={onblur}
        value={value}
        onChange={setValue}
        styles={{
          container: (base) => ({
            ...base,
            outline: "none",
            padding: 0,
            margin: 0,
            height: "24px",
            fontSize: "15px",
          }),

          control: (base) => ({
            display: "flex",
            border: "none",
            outline: "none !important",
            padding: 0,
            height: "36px",
            borderRadius: "0px",
            borderBottom: "1px solid",
            borderBottomColor: "#E2E8F0",
            width: "380px",
          }),

          input: (base) => ({
            ...base,
            display: "flex",
            // border: "none",
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
    </Box>
  );
};
