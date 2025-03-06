import { InputCell } from "../../components/common/DataGrid/cells/inputCell";
import { CurrencyInputCell } from "../../components/common/DataGrid/cells/currencyInput";
// import { DateInput } from "../../components/common/DataGrid/cells/disabledDateInput";
import { DateInput } from "../../components/common/DataGrid/cells/dateInput";
import { TableActions } from "../../components/common/DataGrid/cells/tableActions";
import { SelectLista } from "../../components/common/DataGrid/cells/selectLista";
// import { CEPInputCell } from "../../components/common/DataGrid/cells/cepInput";

export const createPrestadoresColumns = () => {
  const columns = [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: TableActions,
    },
    {
      accessorKey: "sciUnico",
      header: "SCI Único",
      cell: InputCell,
      meta: { type: "number", pattern: "^\\d{5,}$" },
    },
    {
      accessorKey: "usuario",
      header: "Usuário Associado",
      cell: (props) => <SelectLista {...props} cod="usuarios" />,
    },
    {
      accessorKey: "nome",
      header: "Nome Completo",
      cell: InputCell,
    },
    {
      accessorKey: "sid",
      header: "SID",
      cell: InputCell,
      meta: { pattern: "^\\d{7}$" },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (props) => <SelectLista {...props} cod="tipo-prestador" />,
    },
    {
      accessorKey: "documento",
      header: "Documento",
      cell: InputCell,
      meta: {
        dynamicPattern: (row) => {
          if (row.tipo === "ext") return ".*";
          return row.tipo === "pf" ? "^\\d{11}$" : "^\\d{14}$";
        },
      },
    },
    {
      accessorKey: "dadosBancarios.banco",
      header: "Banco",
      cell: InputCell,
    },
    {
      accessorKey: "dadosBancarios.agencia",
      header: "Agência",
      cell: InputCell,
      meta: { type: "number" },
    },
    {
      accessorKey: "dadosBancarios.conta",
      header: "Conta Bancária",
      cell: InputCell,
    },
    {
      accessorKey: "dadosBancarios.tipoConta",
      header: "Tipo de Conta",
      cell: (props) => <SelectLista {...props} cod="tipo-conta-bancaria" />,
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: InputCell,
      meta: { type: "email" },
    },
    {
      accessorKey: "endereco.cep",
      header: "CEP",
      cell: InputCell,
    },
    {
      accessorKey: "endereco.rua",
      header: "Logradouro",
      cell: InputCell,
    },
    {
      accessorKey: "endereco.numero",
      header: "Número",
      cell: InputCell,
    },
    {
      accessorKey: "endereco.complemento",
      header: "Complemento",
      cell: InputCell,
    },
    {
      accessorKey: "endereco.cidade",
      header: "Cidade",
      cell: InputCell,
    },
    {
      accessorKey: "endereco.estado",
      header: "Estado",
      cell: (props) => <SelectLista {...props} cod="estados-brasil" />,
    },
    {
      accessorKey: "endereco.pais",
      header: "País",
      cell: (props) => <SelectLista {...props} cod="paises" />,
    },
    {
      accessorKey: "pessoaFisica.dataNascimento",
      header: "Data de Nascimento",
      cell: DateInput,
    },
    {
      accessorKey: "pessoaFisica.pis",
      header: "PIS",
      cell: InputCell,
    },
    {
      accessorKey: "pessoaFisica.nomeMae",
      header: "Nome da Mãe",
      cell: InputCell,
    },
    {
      accessorKey: "pessoaJuridica.razaoSocial",
      header: "Razão Social",
      cell: InputCell,
    },
    {
      accessorKey: "pessoaJuridica.nomeFantasia",
      header: "Nome Fantasia",
      cell: InputCell,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => <SelectLista {...props} cod="status-prestador" />,
    },
    {
      accessorKey: "dataExportacao",
      header: "Data de Exportação",
      cell: DateInput,
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: DateInput,
    },
    {
      accessorKey: "updatedAt",
      header: "Atualizado em",
      cell: DateInput,
    },
  ];

  return columns;
};
