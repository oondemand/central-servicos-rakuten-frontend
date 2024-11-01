// src/components/form/PrestadorForm.js
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { isCPF, isCNPJ, isPIS } from "validation-br";
import axios from "axios";
import {
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import FormField from "@/components/common/FormField";
import CustomSelect from "../common/CustomSelect";
import { carregarPrestadorPorSid } from "../../services/prestadorService";

const PrestadorForm = ({ onDocumentoValido }) => {
  const { setFieldValue, values, errors, dirty, isSubmitting, setFieldError } =
    useFormikContext();

  const toast = useToast();

  const [sidValido, setSidValido] = useState(true);
  const [estados, setEstados] = useState([]);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [displayNome, setDisplayNome] = useState(values.prestador.nome);
  const [displaySid, setDisplaySid] = useState(values.prestador.sid);
  const [isTyping, setIsTyping] = useState(false);
  const [bancos, setBancos] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [cnpjValido, setCnpjValido] = useState(null);
  const [cpfValido, setCpfValido] = useState(null);
  const [pisValido, setPisValido] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasInteractedCNPJ, setHasInteractedCNPJ] = useState(false);

  const verificarDocumento = (documentoValue) => {
    const isCPFValido =
      values.prestador.tipo === "pf" &&
      documentoValue.length === 11 &&
      isCPF(documentoValue);
    const isCNPJValido =
      values.prestador.tipo === "pj" &&
      documentoValue.length === 14 &&
      isCNPJ(documentoValue);

    const validationDocumentSchema = isCPFValido || isCNPJValido;

    setCpfValido(isCPFValido);
    setCnpjValido(isCNPJValido);
    onDocumentoValido(validationDocumentSchema, values.prestador.tipo);

    if (validationDocumentSchema) {
      setFieldError("prestador.documento", "");
    }
  };

  const verificarPIS = (pisValue) => {
    const valido = isPIS(pisValue);
    setPisValido(valido);
    if (valido && !isSubmitting && hasInteracted) {
      toast({
        title: "PIS validado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else if (!valido) {
      toast({
        title: "PIS inválido.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const verificarCNPJ = (cnpjValue) => {
    const cnpjEhValido = isCNPJ(cnpjValue);
    setCnpjValido(cnpjEhValido);

    if (hasInteractedCNPJ && !isSubmitting) {
      toast({
        title: cnpjEhValido ? "CNPJ validado com sucesso!" : "CNPJ inválido.",
        status: cnpjEhValido ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const verificarCPF = (cpfValue) => {
    const cpfEhValido = isCPF(cpfValue);

    setCpfValido(cpfEhValido);

    if (hasInteracted && !isSubmitting) {
      toast({
        title: cpfEhValido ? "CPF validado com sucesso!" : "CPF inválido.",
        status: cpfEhValido ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChangeBanks = (selectedOption) => {
    setFieldValue(
      "prestador.dadosBancarios.banco",
      selectedOption ? selectedOption.label : ""
    );
  };

  const handleDocumentoChange = (e) => {
    const documentoValue = e.target.value.replace(/\D/g, "");
    setFieldValue("prestador.documento", documentoValue);
    if (documentoValue.length === 11 || documentoValue.length === 14) {
      verificarDocumento(documentoValue);
      setHasInteracted(true);
      setHasInteractedCNPJ(true);
    }
  };

  const handlePISChange = (e) => {
    const pisValue = e.target.value.replace(/\D/g, "");
    if (pisValue.length === 11) {
      verificarPIS(pisValue);
      setHasInteracted(true);
    }
  };

  useEffect(() => {
    const documentoNumerico = values.prestador.documento.replace(/\D/g, "");

    if (values.prestador.tipo === "pj" && documentoNumerico.length === 14) {
      verificarCNPJ(documentoNumerico);
    } else if (
      values.prestador.tipo === "pf" &&
      documentoNumerico.length === 11
    ) {
      verificarCPF(documentoNumerico);
    }
  }, [values.prestador.documento, values.prestador.tipo, setFieldValue]);

  useEffect(() => {
    const cepNumerico = values.prestador.endereco.cep.replace(/\D/g, "");

    const buscarCep = async (cep) => {
      try {
        setIsAutoUpdating(true); // Ativa o modo de atualização automática
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          throw new Error("CEP não encontrado");
        }

        setFieldValue("prestador.endereco.rua", data.logradouro);
        setFieldValue("prestador.endereco.bairro", data.bairro);
        setFieldValue("prestador.endereco.cidade", data.localidade);
        setFieldValue("prestador.endereco.estado", data.uf);
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsAutoUpdating(false); 
      }
    };

    if (cepNumerico.length === 8) {
      buscarCep(cepNumerico);
    }
  }, [values.prestador.endereco.cep, setFieldValue]);

  useEffect(() => {
    // Função para buscar prestador pelo SID
    const buscarPrestador = async (sid) => {
      try {
        const prestador = await carregarPrestadorPorSid(sid);
        if (prestador) {
          // Preenchendo os campos do formulário com os dados do prestador retornado
          setFieldValue("prestador._id", prestador._id);
          setFieldValue("prestador.nome", prestador.nome);
          setFieldValue("prestador.tipo", prestador.tipo);
          setFieldValue("prestador.documento", prestador.documento);
          setFieldValue("prestador.email", prestador.email);
          // Adicione aqui os outros campos que devem ser preenchidos automaticamente
        }
      } catch (error) {
        console.error("Erro ao buscar prestador por SID:", error);
        toast({
          title: "Verifique o SID informado",
          description:
            "Houve um problema ao localizar os dados do prestador para o SID informado. Verifique e tente novamente.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    // Executa a busca quando o SID for alterado e tiver um valor válido
    if (/^\d{7}$/.test(values.prestador.sid)) {
      buscarPrestador(values.prestador.sid);
    }
  }, [values.prestador.sid, setFieldValue, toast]);

  useEffect(() => {
    // estados da API BrasilAPI
    const fetchEstados = async () => {
      try {
        const response = await axios.get(
          "https://brasilapi.com.br/api/ibge/uf/v1"
        );
        const estadosData = response.data.map((estado) => ({
          value: estado.sigla,
          label: estado.nome,
        }));
        setEstados(estadosData);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    fetchEstados();
  }, []);

  useEffect(() => {
    setIsTyping(true);

    const handler = setTimeout(() => {
      setDisplayNome(values.prestador.nome);
      setDisplaySid(values.prestador.sid);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(handler);
  }, [values.prestador.nome, values.prestador.sid]);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const response = await axios.get(
          "https://brasilapi.com.br/api/banks/v1"
        );
        const bancosData = response.data.map((banco) => ({
          value: banco.code,
          label: banco.name,
        }));
        setBancos(bancosData);
      } catch (error) {
        console.error("Erro ao carregar bancos:", error);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBancos();
  }, []);

  useEffect(() => {
    const pisNumerico = values.prestador.pessoaFisica?.pis?.replace(/\D/g, "");
    if (pisNumerico && pisNumerico.length === 11) {
      verificarPIS(pisNumerico);
    }
  }, [values.prestador.pessoaFisica?.pis]);

  useEffect(() => {
    setCnpjValido(true);
    setCpfValido(true);
  }, [values.prestador.tipo, setFieldValue]);

  // Determina se o prestador é Pessoa Física
  const isPessoaFisica = values.prestador.tipo === "pf";

  return (
    <div>
      <h2>
        <Box flex="1" textAlign="left" fontWeight="bold">
          Informações do Prestador:{" "}
          <label style={{ fontWeight: "normal", fontStyle: "italic" }}>
            {isTyping
              ? "Carregando" + ".".repeat((Date.now() / 300) % 4)
              : `${displayNome} - SID ${
                  displaySid !== undefined ? displaySid : ""
                }`}
          </label>
        </Box>
      </h2>

      <Box mt={8}>
        <VStack align="stretch">
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Cadastro
          </Text>

          <HStack align="stretch">
            <div>
              <FormField
                label="SID"
                name="prestador.sid"
                type="text"
                mask="9999999"
              />
            </div>

            <FormField
              label="Status"
              name="prestador.status"
              type="select"
              options={[
                { value: "ativo", label: "Ativo" },
                { value: "em-analise", label: "Em Análise" },
                {
                  value: "pendente-de-revisao",
                  label: "Pendente de Revisão",
                },
                { value: "inativo", label: "Inativo" },
                { value: "arquivado", label: "Arquivado" },
              ]}
            />
          </HStack>

          <HStack align="stretch">
            <FormField
              label="Tipo"
              name="prestador.tipo"
              type="select"
              options={[
                { value: "pf", label: "Pessoa Física (CPF)" },
                { value: "pj", label: "Pessoa Jurídica (CNPJ)" },
              ]}
            />
            <FormField
              label="Documento (CPF/CNPJ)"
              name="prestador.documento"
              type="text"
              onChange={handleDocumentoChange}
              mask={
                values.prestador.tipo === "pf"
                  ? "999.999.999-99"
                  : "99.999.999/9999-99"
              }
              style={{
                borderColor:
                  (values.prestador.tipo === "pj" && !cnpjValido) ||
                  (values.prestador.tipo === "pf" && !cpfValido)
                    ? "red"
                    : "#ccc",
                color:
                  (values.prestador.tipo === "pj" && !cnpjValido) ||
                  (values.prestador.tipo === "pf" && !cpfValido)
                    ? "red"
                    : "#8528CE",
              }}
            />
            <FormField label="Nome" name="prestador.nome" type="text" />
            <FormField label="E-mail" name="prestador.email" type="email" />
          </HStack>

          {isPessoaFisica && (
            <HStack align="stretch">
              <FormField
                label="Nome da Mãe"
                name="prestador.pessoaFisica.nomeMae"
                type="text"
              />

              <FormField
                label="Data de Nascimento"
                name="prestador.pessoaFisica.dataNascimento"
                type="date"
              />
            </HStack>
          )}

          {isPessoaFisica && (
            <HStack align="stretch">
              <FormField
                label="PIS"
                name="prestador.pessoaFisica.pis"
                type="text"
                mask="999.99999.99-9"
                onChange={handlePISChange}
                style={{
                  borderColor: !pisValido ? "red" : "#ccc",
                  color: !pisValido ? "red" : "#8528CE",
                }}
              />
              <FormField
                label="RG"
                name="prestador.pessoaFisica.rg.numero"
                type="text"
                mask="999999999"
              />
              <FormField
                label="Órgão Emissor do RG"
                name="prestador.pessoaFisica.rg.orgaoEmissor"
                type="text"
              />
            </HStack>
          )}

          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Endereço
          </Text>

          <HStack align="stretch">
            <FormField
              label="CEP"
              name="prestador.endereco.cep"
              type="text"
              mask="99999-999"
            />
            <FormField label="Rua" name="prestador.endereco.rua" type="text" />
            <FormField
              label="Número"
              name="prestador.endereco.numero"
              type="text"
            />
          </HStack>

          <HStack align="stretch">
            <FormField
              label="Complemento"
              name="prestador.endereco.complemento"
              type="text"
            />
            <FormField
              label="Cidade"
              name="prestador.endereco.cidade"
              type="text"
            />
            {/* <FormField
                label="Estado"
                name="prestador.endereco.estado"
                type="text"
              /> */}

            <div
              style={{ width: "1040px", marginTop: "8px", fontWeight: "500" }}
            >
              <label htmlFor="prestador.endereco.estado">Estado</label>
              <select
                id="prestador.endereco.estado"
                name="prestador.endereco.estado"
                value={values.prestador.endereco.estado}
                onChange={(e) => {
                  if (!isAutoUpdating) {
                    setFieldValue("prestador.endereco.estado", e.target.value);
                  }
                }}
                style={{
                  height: "40px",
                  maxHeight: "150px",
                  overflowY: "auto",
                  padding: "8px",
                  borderRadius: "6px",
                  width: "100%",
                  border: "1px solid rgb(226, 232, 240)",
                  backgroundColor: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">Selecione um estado</option>
                {estados &&
                  estados.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          </HStack>

          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Dados Bancarios
          </Text>
          <HStack align="stretch">
            <FormField
              label="Tipo de Conta"
              name="prestador.dadosBancarios.tipoConta"
              type="select"
              options={[
                { value: "", label: "Selecione o tipo de conta" },
                { value: "corrente", label: "Corrente" },
                { value: "poupanca", label: "Poupança" },
              ]}
            />

            <div
              style={{
                marginBottom: "2rem",
                width: "1050px",
                zIndex: "999999",
              }}
            >
              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Banco
              </label>
              {loadingBanks ? (
                <p>Carregando bancos...</p>
              ) : (
                <Select
                  id="prestador.dadosBancarios.banco"
                  name="prestador.dadosBancarios.banco"
                  options={bancos}
                  value={
                    bancos.find(
                      (option) =>
                        option.label === values.prestador?.dadosBancarios?.banco
                    ) || null
                  }
                  onChange={handleChangeBanks}
                  placeholder="Selecione ou digite o banco"
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "40px",
                      borderRadius: "6px",
                      borderColor: "#ccc",
                      boxShadow: "none",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: "auto",
                      overflowY: "auto",
                      zIndex: "999",
                    }),
                  }}
                />
              )}
            </div>

            <FormField
              label="Agência"
              name="prestador.dadosBancarios.agencia"
              type="text"
            />
            <FormField
              label="Conta"
              name="prestador.dadosBancarios.conta"
              type="text"
            />
          </HStack>

          <HStack align="stretch">
            <FormField
              label="Comentários de Revisão"
              name="prestador.comentariosRevisao"
              type="textarea"
            />
          </HStack>
        </VStack>
      </Box>
    </div>
  );
};

export default PrestadorForm;
