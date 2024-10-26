// src/components/form/PrestadorForm.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

const PrestadorForm = () => {
  const { setFieldValue, values, dirty } = useFormikContext();

  const [cnpjValido, setCnpjValido] = useState(true);
  const [sidValido, setSidValido] = useState(true);
  const [estados, setEstados] = useState([]);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [displayNome, setDisplayNome] = useState(values.prestador.nome);
  const [displaySid, setDisplaySid] = useState(values.prestador.sid);
  const [isTyping, setIsTyping] = useState(false);

  const verificarCNPJ = async (cnpj) => {
    try {
      const response = await axios.get(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
      );
      if (response.data) {
        setCnpjValido(true);
        toast.success("CNPJ validado com sucesso!");
      }
      return response.data;
    } catch (error) {
      setCnpjValido(false);
      toast.error("CNPJ inválido. Verifique o número e tente novamente.");
      return null;
    }
  };

  console.log(values);

  useEffect(() => {
    const cnpjNumerico = values.prestador.documento.replace(/\D/g, "");

    if (
      values.prestador.tipo === "pj" &&
      cnpjNumerico.length === 14 &&
      values.prestador.documento.includes("/")
    ) {
      verificarCNPJ(cnpjNumerico);
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
        toast({
          title: "Erro ao buscar CEP",
          description: "Não foi possível buscar o CEP informado.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsAutoUpdating(false); // Desativa o modo de atualização automática após a busca
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
          title: "Erro ao carregar prestador",
          description:
            "Não foi possível encontrar o prestador com o SID fornecido.",
          status: "error",
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

  // Determina se o prestador é Pessoa Física
  const isPessoaFisica = values.prestador.tipo === "pf";

  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem borderRadius="md">
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Informações do Prestador:{" "}
              <label style={{ fontWeight: "normal", fontStyle: "italic" }}>
                {isTyping
                  ? "Carregando" + ".".repeat((Date.now() / 300) % 4)
                  : `${displayNome} - SID ${displaySid}`}
              </label>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
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
                mask={
                  values.prestador.tipo === "pf"
                    ? "999.999.999-99"
                    : "99.999.999/9999-99"
                }
                style={{
                  borderColor:
                    !cnpjValido && values.prestador.tipo !== "pf"
                      ? "red"
                      : "#ccc",
                  color:
                    !cnpjValido && values.prestador.tipo !== "pf"
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
              <FormField
                label="Rua"
                name="prestador.endereco.rua"
                type="text"
              />
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
                      setFieldValue(
                        "prestador.endereco.estado",
                        e.target.value
                      );
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
              <FormField
                label="Banco"
                name="prestador.dadosBancarios.banco"
                type="text"
              />
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default PrestadorForm;
