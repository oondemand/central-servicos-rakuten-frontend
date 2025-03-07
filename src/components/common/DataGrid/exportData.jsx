import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@chakra-ui/react";

export const ExportDataButton = ({ columns, data }) => {
  const handleExport = () => {
    // Processar os dados conforme as colunas
    const rows = data.map((row) => {
      const newRow = {};
      columns.forEach((column) => {
        if (["acoes", "action"].includes(column?.accessorKey)) return;
        // Obtém o valor usando o accessorKey (suporta nested objects com notação de ponto)
        const accessor = column.accessorKey?.split(".") || [];
        const value = accessor.reduce((acc, key) => acc?.[key], row);
        newRow[column.header] = value;
      });
      return newRow;
    });

    // Criar a planilha
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

    // Gerar arquivo
    XLSX.writeFile(workbook, "dados.xlsx", {
      type: "buffer",
    });
  };

  return (
    <Button
      size="sm"
      variant="subtle"
      color="brand.500"
      fontWeight="semibold"
      onClick={handleExport}
      _hover={{ backgroundColor: "brand.50" }}
    >
      Exportar (Excel)
    </Button>
  );
};
