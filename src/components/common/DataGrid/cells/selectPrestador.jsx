import { Box, Text } from "@chakra-ui/react";
import SelectAsync from "react-select/async";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarPrestadores } from "../../../../services/prestadorService";
import api from "../../../../services/api";
import { Controller } from "react-hook-form";
import { useRef } from "react";

export const SelectPrestadorCell = ({
  getValue,
  row,
  column,
  table,
  options,
  ...props
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState("");

  // const loadOptions = async (props) => {
  //   console.log("PROPS", props);

  //   const { data } = await api.get(`/prestadores?searchTerm=${props}`);

  //   console.log(data);

  //   const options = data?.prestadores?.map((prestador) => ({
  //     label: `${prestador?.nome} - ${prestador?.sid} - ${prestador?.documento}`,
  //     value: prestador?._id,
  //   }));

  //   return options;
  // };

  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const loadOptions = async (inputValue) => {
    // Cancela o timeout e a requisição anteriores
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    // Cria um novo AbortController para a próxima requisição
    abortControllerRef.current = new AbortController();

    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          const { data } = await api.get(
            `/prestadores?searchTerm=${inputValue}`,
            {
              signal: abortControllerRef.current.signal,
            }
          );

          const options = data?.prestadores?.map((prestador) => ({
            label: `${prestador.nome} - ${prestador.sid} - ${prestador.documento}`,
            value: prestador._id,
          }));

          resolve(options || []);
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Erro ao buscar prestadores:", error);
          }

          resolve([]);
        }
      }, 1000); // Tempo de debounce ajustável aqui
    });
  };

  const onBlur = async () => {
    if (value.value && value.value !== initialValue._id) {
      try {
        await table.options.meta?.updateData({
          prestadorId: row.original._id,
          data: { [column.columnDef.accessorKey]: value.value },
        });
      } catch (error) {
        console.log(error);
        setValue({
          label: `${initialValue?.nome} - ${initialValue?.sid} - ${initialValue?.documento}`,
          value: initialValue?._id,
        });
      }
    }
  };

  useEffect(() => {
    setValue({
      label: `${initialValue?.nome} - ${initialValue?.sid} - ${initialValue?.documento}`,
      value: initialValue?._id,
    });
  }, [initialValue]);

  return (
    <SelectAsync
      // defaultInputValue={value}
      onBlur={onBlur}
      value={value ?? ""}
      onChange={setValue}
      cacheOptions
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
          // zIndex: 500,
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
          zIndex: 1000,
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
