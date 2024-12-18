import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import Select from "react-select";
import { isCPF, isCNPJ, isPIS } from "validation-br";
import axios from "axios";
import {
  VStack,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Button,
  Box,
  useToast,
  Text,
  useFormControlStyles,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import FormField from "@/components/common/FormField";
import CustomSelect from "../common/CustomSelect";
import {
  carregarPrestadorPorSid,
  obterPrestadorPorDocumento,
  obterPrestadorPorEmail,
  obterPrestadorPorPis,
} from "../../services/prestadorService";

const PrestadorForm = ({
  onUpdatePrestadorInfo,
  onDocumentoValido,
  ticket,
}) => {
  const {
    setFieldValue,
    values,
    errors,
    dirty,
    isSubmitting,
    setFieldError,
    handleChange,
  } = useFormikContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [sidValido, setSidValido] = useState(true);
  const [estados, setEstados] = useState([]);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [displayNome, setDisplayNome] = useState(values?.prestador.nome);
  const [displaySid, setDisplaySid] = useState(values?.prestador.sid);
  const [isTyping, setIsTyping] = useState(false);
  const [bancos, setBancos] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [cnpjValido, setCnpjValido] = useState(null);
  const [cpfValido, setCpfValido] = useState(null);
  const [pisValido, setPisValido] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasInteractedCNPJ, setHasInteractedCNPJ] = useState(false);
  const [prestadorExistente, setPrestadorExistente] = useState(null);
  const [isEmailAlertOpen, setIsEmailAlertOpen] = useState(false);
  const [emailAlertData, setEmailAlertData] = useState(null);
  const [isPisAlertOpen, setIsPisAlertOpen] = useState(false);
  const [pisAlertData, setPisAlertData] = useState(null);
  const [sidJaBuscado, setSidJaBuscado] = useState(false);

  const verificarDocumento = async (documentoValue) => {
    const isCPFValido =
      values?.prestador?.tipo === "pf" && isCPF(documentoValue);
    const isCNPJValido =
      values?.prestador?.tipo === "pj" && isCNPJ(documentoValue);
    const validationDocumentSchema = isCPFValido || isCNPJValido;

    setCpfValido(isCPFValido);
    setCnpjValido(isCNPJValido);
    setFieldError(
      "prestador.documento",
      validationDocumentSchema ? "" : "Documento inválido"
    );
    onDocumentoValido(validationDocumentSchema, values?.prestador?.tipo);

    if (validationDocumentSchema) {
      try {
        const prestador = await obterPrestadorPorDocumento(documentoValue);
        if (prestador) {
          setPrestadorExistente(prestador);
          onOpen();
        }
      } catch (error) {
        console.error("Erro ao verificar documento:", error);
      }
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

  const applyMask = (value, tipo) => {
    if (tipo === "pf") {
      return value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (tipo === "pj") {
      return value
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{4})(\d)/, "$1/$2-$3");
    }
    return value;
  };

  const applyPisMask = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, "$1.$2.$3-$4")
      .slice(0, 14);
  };

  const handleDocumentoChange = (e) => {
    const documentoValue = e.target.value;
    const maskedValue = applyMask(documentoValue, values?.prestador?.tipo);

    setFieldValue("prestador.documento", maskedValue);

    if (
      documentoValue.replace(/\D/g, "").length ===
      (values?.prestador?.tipo === "pf" ? 11 : 14)
    ) {
      verificarDocumento(documentoValue.replace(/\D/g, ""));
    }
  };

  const limparDocumento = () => {
    setFieldValue("prestador.documento", "");

    setFieldError("prestador.documento", "Documento inválido");

    setTimeout(() => {
      const hiddenButton = document.getElementById("hidden-focus-button");
      if (hiddenButton) {
        hiddenButton.focus();
      } else {
        document.activeElement.blur();
      }
    }, 0);

    onClose();
  };

  const handlePisChange = async (pisValue) => {
    if (pisValue.length === 14) {
      try {
        const prestador = await obterPrestadorPorPis(pisValue);
        if (prestador) {
          setPisAlertData(prestador);
          setIsPisAlertOpen(true);
        } else {
          console.log("Prestador não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao obter prestador por PIS:", error);
      }
    }
  };

  const handlePisAlertClose = (clearPis = false) => {
    setIsPisAlertOpen(false);
    if (clearPis) {
      setFieldValue("prestador.pessoaFisica.pis", "");
    }
  };

  const verificarEmail = useCallback(
    debounce(async (email) => {
      if (email && /\S+@\S+\.\S+/.test(email)) {
        try {
          const emailPrestador = await obterPrestadorPorEmail(email);
          if (emailPrestador) {
            setEmailAlertData(emailPrestador);
            setIsEmailAlertOpen(true);
            onDocumentoValido(true, emailPrestador?.tipo);
          }
        } catch (error) {
          console.error("Erro ao verificar e-mail:", error);
          toast({
            title: "Erro ao verificar e-mail.",
            description: "Houve um problema ao verificar o e-mail.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }, 500),
    []
  );

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFieldValue("prestador.email", email);
    verificarEmail(email);
  };

  const handleEmailAlertClose = (clearEmail = false) => {
    setIsEmailAlertOpen(false);
    if (clearEmail) {
      setFieldValue("prestador.email", "");
    }
  };

  const handleLoadData = (prestadorData) => {
    if (prestadorData) {
      setFieldValue("prestador._id", prestadorData._id);
      setFieldValue("prestador.nome", prestadorData.nome);
      setFieldValue("prestador.sid", prestadorData.sid);
      setFieldValue("prestador.tipo", prestadorData.tipo);
      setFieldValue("prestador.documento", prestadorData.documento);
      setFieldValue("prestador.email", prestadorData.email);
      setFieldValue(
        "prestador.comentariosRevisao",
        prestadorData.comentariosRevisao
      );
      setFieldValue("prestador.status", prestadorData.status);

      const formattedDate = prestadorData.pessoaFisica?.dataNascimento
        ? new Date(prestadorData.pessoaFisica?.dataNascimento)
            .toISOString()
            .split("T")[0]
        : "";

      setFieldValue(
        "prestador.pessoaFisica.rg.numero",
        prestadorData.pessoaFisica?.rg?.numero
      );
      setFieldValue(
        "prestador.pessoaFisica.rg.orgaoEmissor",
        prestadorData.pessoaFisica?.rg?.orgaoEmissor
      );
      setFieldValue("prestador.pessoaFisica.dataNascimento", formattedDate);
      setFieldValue(
        "prestador.pessoaFisica.nomeMae",
        prestadorData.pessoaFisica?.nomeMae
      );

      setFieldValue("prestador.endereco.cep", prestadorData.endereco?.cep);
      setFieldValue("prestador.endereco.rua", prestadorData.endereco?.rua);
      setFieldValue(
        "prestador.endereco.numero",
        prestadorData.endereco?.numero
      );
      setFieldValue(
        "prestador.endereco.complemento",
        prestadorData.endereco?.complemento
      );
      setFieldValue(
        "prestador.endereco.cidade",
        prestadorData.endereco?.cidade
      );
      setFieldValue(
        "prestador.endereco.estado",
        prestadorData.endereco?.estado
      );

      setFieldValue(
        "prestador.dadosBancarios.banco",
        prestadorData.dadosBancarios?.banco
      );
      setFieldValue(
        "prestador.dadosBancarios.agencia",
        prestadorData.dadosBancarios?.agencia
      );
      setFieldValue(
        "prestador.dadosBancarios.conta",
        prestadorData.dadosBancarios?.conta
      );
      setFieldValue(
        "prestador.dadosBancarios.tipoConta",
        prestadorData.dadosBancarios?.tipoConta
      );
    }
  };

  useEffect(() => {
    onUpdatePrestadorInfo(displayNome, displaySid, isTyping);
  }, [displayNome, displaySid, onUpdatePrestadorInfo]);

  useEffect(
    () => {
      // Funcao para buscar prestador pelo SID
      const buscarPrestador = async (sid) => {
        try {
          const prestador = await carregarPrestadorPorSid(sid);
          if (prestador) {
            setFieldValue("prestador._id", prestador._id);
            setFieldValue("prestador.nome", prestador.nome);
            setFieldValue("prestador.sid", prestador.sid);
            setFieldValue("prestador.tipo", prestador.tipo);
            setFieldValue("prestador.documento", prestador.documento);
            setFieldValue("prestador.email", prestador.email);
            setFieldValue(
              "prestador.comentariosRevisao",
              prestador.comentariosRevisao
            );
            setFieldValue("prestador.status", prestador.status);

            const formattedDate = prestador.pessoaFisica?.dataNascimento
              ? new Date(prestador.pessoaFisica.dataNascimento)
                  .toISOString()
                  .split("T")[0]
              : "";

            setFieldValue(
              "prestador.pessoaFisica.rg.numero",
              prestador.pessoaFisica?.rg?.numero
            );
            setFieldValue(
              "prestador.pessoaFisica.pis",
              prestador.pessoaFisica?.pis
            );
            setFieldValue(
              "prestador.pessoaFisica.rg.orgaoEmissor",
              prestador.pessoaFisica?.rg?.orgaoEmissor
            );
            setFieldValue(
              "prestador.pessoaFisica.dataNascimento",
              formattedDate
            );
            setFieldValue(
              "prestador.pessoaFisica.nomeMae",
              prestador.pessoaFisica?.nomeMae
            );

            setFieldValue("prestador.endereco.cep", prestador.endereco?.cep);
            setFieldValue("prestador.endereco.rua", prestador.endereco?.rua);
            setFieldValue(
              "prestador.endereco.numero",
              prestador.endereco?.numero
            );
            setFieldValue(
              "prestador.endereco.complemento",
              prestador.endereco?.complemento
            );
            setFieldValue(
              "prestador.endereco.cidade",
              prestador.endereco?.cidade
            );
            setFieldValue(
              "prestador.endereco.estado",
              prestador.endereco?.estado
            );

            setFieldValue(
              "prestador.dadosBancarios.banco",
              prestador.dadosBancarios?.banco
            );
            setFieldValue(
              "prestador.dadosBancarios.agencia",
              prestador.dadosBancarios?.agencia
            );
            setFieldValue(
              "prestador.dadosBancarios.conta",
              prestador.dadosBancarios?.conta
            );
            setFieldValue(
              "prestador.dadosBancarios.tipoConta",
              prestador.dadosBancarios?.tipoConta
            );

            const isDocumentoValido =
              prestador.tipo === "pf"
                ? isCPF(prestador.documento)
                : isCNPJ(prestador.documento);
            onDocumentoValido(isDocumentoValido, prestador.tipo);

            toast({
              title: "Prestador Carregado",
              description: `Prestador ${prestador.nome}, com SID ${prestador.sid}.`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (error) {}
      };

      if (/^\d{7}$/.test(values?.prestador?.sid) && !sidJaBuscado && !ticket) {
        buscarPrestador(values?.prestador.sid);
        setSidJaBuscado(true);
      }

      if (!/^\d{7}$/.test(values?.prestador?.sid)) {
        setSidJaBuscado(false);
      }
    },
    [values?.prestador?.sid, sidJaBuscado],
    []
  );

  useEffect(() => {
    const documentoNumerico = values?.prestador?.documento?.replace(/\D/g, "");

    if (values?.prestador?.tipo === "pj" && documentoNumerico?.length === 14) {
      verificarCNPJ(documentoNumerico);
    } else if (
      values?.prestador?.tipo === "pf" &&
      documentoNumerico?.length === 11
    ) {
      verificarCPF(documentoNumerico);
    }
  }, [values?.prestador.documento, values?.prestador.tipo, setFieldValue]);

  const handleCepChange = async (e) => {
    handleChange(e);
    const cep = e.target.value;

    if (cep.length >= 9) {
      try {
        setIsAutoUpdating(true);
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
      }

      setIsAutoUpdating(false);
    }
  };

  useEffect(() => {
    // API BrasilAPI
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
      setDisplayNome(values?.prestador?.nome);
      setDisplaySid(values?.prestador?.sid);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(handler);
  }, [values?.prestador.nome, values?.prestador?.sid]);

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
    const pisNumerico = values?.prestador?.pessoaFisica?.pis?.replace(
      /\D/g,
      ""
    );
    if (pisNumerico && pisNumerico.length === 11) {
      verificarPIS(pisNumerico);
    }
  }, [values?.prestador?.pessoaFisica?.pis]);

  useEffect(() => {
    setCnpjValido(true);
    setCpfValido(true);
  }, [values?.prestador?.tipo, setFieldValue]);

  // Determina se o prestador é Pessoa Física
  const isPessoaFisica = values?.prestador.tipo === "pf";

  return (
    <div>
      <h2>
        <Box flex="1" textAlign="left" fontWeight="bold">
          Informações
          {/* <label style={{ fontWeight: "normal", fontStyle: "italic" }}>
            {isTyping
              ? "Carregando" + ".".repeat((Date.now() / 300) % 4)
              : `${displayNome} - SID ${
                  displaySid !== undefined ? displaySid : ""
                }`}
          </label> */}
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
                label="SID *"
                name="prestador.sid"
                type="text"
                mask="9999999"
              />
            </div>

            <div>
              <FormField
                label="Sci Unico"
                name="prestador.sciUnico"
                type="text"
                mask="999999"
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
                {
                  value: "aguardando-codigo-sci",
                  label: "Aguardando código sci",
                },
              ]}
            />
          </HStack>

          <HStack align="stretch">
            <FormField
              label="Tipo *"
              name="prestador.tipo"
              type="select"
              options={[
                { value: "pf", label: "Pessoa Física (CPF)" },
                { value: "pj", label: "Pessoa Jurídica (CNPJ)" },
              ]}
            />
            <FormField
              label="Documento (CPF/CNPJ) *"
              name="prestador.documento"
              type="text"
              onChange={handleDocumentoChange}
              // mask={
              //   values?.prestador?.tipo === "pf"
              //     ? "999.999.999-99"
              //     : "99.999.999/9999-99"
              // }
              style={{
                borderColor:
                  (!cpfValido && values?.prestador?.tipo === "pf") ||
                  (!cnpjValido && values?.prestador?.tipo === "pj")
                    ? "red"
                    : "#ccc",
              }}
            />

            <button id="hidden-focus-button" style={{ display: "none" }} />

            <FormField label="Nome *" name="prestador.nome" type="text" />

            <FormField
              label="E-mail"
              name="prestador.email"
              type="email"
              onChange={handleEmailChange}
            />
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
                onChange={(e) => {
                  const maskedValue = applyPisMask(e.target.value);
                  setFieldValue("prestador.pessoaFisica.pis", maskedValue);
                  handlePisChange(maskedValue);
                }}
                style={{
                  borderColor: !pisValido ? "red" : "#ccc",
                  color: !pisValido ? "red" : "#8528CE",
                }}
              />
              <FormField
                label="RG"
                name="prestador.pessoaFisica.rg.numero"
                type="text"
                mask="****************"
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
              onChange={handleCepChange}
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
                value={values?.prestador?.endereco?.estado}
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
                        option.label ===
                        values?.prestador?.dadosBancarios?.banco
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

        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Prestador já cadastrado
              </AlertDialogHeader>
              <AlertDialogBody>
                Este prestador já existe no sistema. Deseja carregar os dados
                dele?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={limparDocumento} colorScheme="red">
                  Não
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    handleLoadData(prestadorExistente);
                    onClose();
                  }}
                  ml={3}
                >
                  Sim
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={isEmailAlertOpen}
          onClose={() => handleEmailAlertClose()}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                E-mail já cadastrado
              </AlertDialogHeader>
              <AlertDialogBody>
                Este e-mail já está associado a um prestador. Deseja carregar as
                informações dele?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  onClick={() => handleEmailAlertClose(true)}
                  colorScheme="red"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    handleLoadData(emailAlertData);
                    handleEmailAlertClose();
                  }}
                  ml={3}
                  colorScheme="blue"
                >
                  Carregar dados
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={isPisAlertOpen}
          onClose={() => handlePisAlertClose()}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                PIS já cadastrado
              </AlertDialogHeader>
              <AlertDialogBody>
                Este PIS já está associado a um prestador. Deseja carregar as
                informações dele?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  onClick={() => handlePisAlertClose(true)}
                  colorScheme="red"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    handleLoadData(pisAlertData);
                    handlePisAlertClose();
                  }}
                  colorScheme="blue"
                  ml={3}
                >
                  Carregar dados
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </div>
  );
};

export default PrestadorForm;
