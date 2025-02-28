import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import { parseBRLCurrencyToNumber } from "../../../../utils/formatacoes";

export const CurrencyInputCell = ({
  getValue,
  row,
  column,
  table,
  ...props
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (parseBRLCurrencyToNumber(value) !== initialValue) {
      try {
        await table.options.meta?.updateData({
          prestadorId: row.original._id,
          data: {
            [column.columnDef.accessorKey]: parseBRLCurrencyToNumber(value),
          },
        });
      } catch (error) {
        console.log(error);
        setValue(initialValue);
      }
    }
  };

  useEffect(() => {
    setValue(initialValue ? initialValue : "");
  }, [initialValue]);

  return (
    <NumericFormat
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative
      prefix="R$ "
      placeholder="R$ 0,00"
      style={{
        outline: "none",
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};
