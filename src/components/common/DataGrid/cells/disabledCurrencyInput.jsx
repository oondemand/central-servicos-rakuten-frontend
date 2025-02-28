import { NumericFormat } from "react-number-format";

export const DisabledCurrencyInputCell = ({ getValue, row, column, table }) => {
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
      value={getValue()}
    />
  );
};
