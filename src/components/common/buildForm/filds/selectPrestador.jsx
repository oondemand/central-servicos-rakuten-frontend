import { Box, Text } from "@chakra-ui/react";
import SelectAsync from "react-select/async";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarPrestadores } from "../../../../services/prestadorService";
import api from "../../../../services/api";
import { Controller } from "react-hook-form";

export const SelectPrestadorField = ({ ...props }) => {
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

  return (
    <Box>
      <Box>
        <Text fontSize="sm">Prestador</Text>
        <Controller
          name={props.field.name}
          control={props.methods.control}
          render={({ field }) => (
            <SelectAsync
              value={field.value}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
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
                }),

                input: (base) => ({
                  ...base,
                  display: "flex",
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
          )}
        />
      </Box>
      <Text pt="3" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
