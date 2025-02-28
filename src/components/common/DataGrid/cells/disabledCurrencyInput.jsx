import { NumericFormat } from "react-number-format";
import { useEffect, useState } from "react";

export const DisabledCurrencyInputCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState("");

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
        cursor: "not-allowed",
        width: "100%",
      }}
      disabled={true}
      value={value}
    />
  );
};
