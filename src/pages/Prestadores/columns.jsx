import { InputCell } from "../../components/common/DataGrid/cells/inputCell";
import { CurrencyInputCell } from "../../components/common/DataGrid/cells/currencyInput";
// import { DateInput } from "../../components/common/DataGrid/cells/disabledDateInput";
import { DateInput } from "../../components/common/DataGrid/cells/dateInput";
import { TableActions } from "../../components/common/DataGrid/cells/tableActions";
import { SelectLista } from "../../components/common/DataGrid/cells/selectLista";
import { SelectAutoCompleteCell } from "../../components/common/DataGrid/cells/selectAutoComplete";
import { CpfCnpjCell } from "../../components/common/DataGrid/cells/cpfCnpj";

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
      // meta: { type: "number", pattern: "^\\d{5,}$" },
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: (props) => <SelectLista {...props} cod="manager" />,
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
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Pessoa física", value: "pf" },
            { label: "Pessoa jurídica", value: "pj" },
            { label: "Exterior", value: "ext" },
          ]}
        />
      ),
    },
    {
      accessorKey: "documento",
      header: "Documento",
      cell: (props) => <CpfCnpjCell {...props} />,
    },
    {
      accessorKey: "dadosBancarios.banco",
      header: "Banco",
      cell: (props) => <SelectLista {...props} cod="bancos" />,
    },
    {
      accessorKey: "dadosBancarios.agencia",
      header: "Agência",
      cell: InputCell,
      // meta: { type: "number" },
    },
    {
      accessorKey: "dadosBancarios.conta",
      header: "Conta Bancária",
      cell: InputCell,
    },
    {
      accessorKey: "dadosBancarios.tipoConta",
      header: "Tipo de Conta",
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Poupança", value: "poupanca" },
            { label: "Corrente", value: "corrente" },
          ]}
        />
      ),
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: InputCell,
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
      cell: InputCell,
    },
    {
      accessorKey: "endereco.pais",
      header: "País",
      cell: InputCell,
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
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Ativo", value: "ativo" },
            { label: "Em-analise", value: "em-analise" },
            { label: "Pendente de revisão", value: "pendente-de-revisao" },
            { label: "Inativo", value: "inativo" },
            { label: "Arquivado", value: "arquivado" },
            { label: "Aguardado codigo sci", value: "aguardando-codigo-sci" },
          ]}
        />
      ),
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
