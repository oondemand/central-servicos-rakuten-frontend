# Documento de Arquitetura - CST-Rakuten Frontend

## Índice
- [1. Visão Geral do Projeto](#1-visão-geral-do-projeto)
- [2. Tecnologias Utilizadas](#2-tecnologias-utilizadas)
- [3. Arquitetura da Aplicação](#3-arquitetura-da-aplicação)
  - [3.1 Componentização](#31-componentização)
  - [3.2 Context API e Gerenciamento de Estado](#32-context-api-e-gerenciamento-de-estado)
  - [3.3 Serviços e Camada de Comunicação com a API](#33-serviços-e-camada-de-comunicação-com-a-api)
  - [3.4 Validações e Utilitários](#34-validações-e-utilitários)
  - [3.5 Estilos e Customizações](#35-estilos-e-customizações)
- [4. Estrutura de Pastas](#4-estrutura-de-pastas)
- [5. Fluxo de Dados](#5-fluxo-de-dados)
- [6. Autenticação e Controle de Acesso](#6-autenticação-e-controle-de-acesso)
- [7. Padrões e Convenções](#7-padrões-e-convenções)

## 1. Visão Geral do Projeto
O **CST-Rakuten Frontend** é uma aplicação desenvolvida em **React.js**, que faz parte da plataforma **OonDemand v2**. A aplicação fornece uma interface amigável e responsiva para gerenciar tickets, prestadores de serviço, integrações com o sistema Omie, e outras operações administrativas. O frontend foi desenvolvido para proporcionar uma experiência de usuário fluida e intuitiva, utilizando práticas modernas de desenvolvimento.

## 2. Tecnologias Utilizadas
- **React.js**: Biblioteca JavaScript para criação de interfaces de usuário.
- **Chakra UI**: Biblioteca de componentes para aplicações React com foco em acessibilidade e estilização.
- **Axios**: Cliente HTTP para comunicação com a API backend.
- **React Router**: Biblioteca para roteamento entre as páginas da aplicação.
- **Formik e Yup**: Ferramentas para gerenciamento de formulários e validação.
- **React Toastify**: Biblioteca para notificações.
- **Framer Motion**: Biblioteca para animações fluidas.

## 3. Arquitetura da Aplicação
A arquitetura da aplicação segue uma abordagem modular, onde cada parte do sistema é desenvolvida de forma isolada, visando reaproveitamento e manutenção fácil. Abaixo, detalhamos cada uma das principais áreas da arquitetura.

### 3.1 Componentização
Os componentes são organizados de forma hierárquica e modular para facilitar o desenvolvimento e a reutilização de código. Temos componentes divididos em diferentes categorias:
- **Common**: Componentes genéricos reutilizáveis em diferentes partes da aplicação, como botões, campos de formulário, etc.
- **Form**: Componentes específicos para renderização de formulários, como formulários de prestadores e serviços.
- **Ticket**: Componentes específicos para o gerenciamento de tickets, como o `TicketStatusButtons`, `TicketActions` e modais de criação/edição de tickets.

### 3.2 Context API e Gerenciamento de Estado
A aplicação utiliza a **Context API** para gerenciar estados globais e fornecer funcionalidades compartilhadas em diferentes componentes. Cada contexto é responsável por uma parte específica do sistema:
- **AuthContext**: Gerencia a autenticação de usuários, incluindo login e logout.
- **TicketContext**: Gerencia as operações relacionadas aos tickets, como listagem, criação e alteração de status.
- **NotificacaoContext**: Gerencia as notificações de sucesso, erro e informação dentro da aplicação.
- **BaseOmieContext**: Gerencia as bases Omie, fornecendo uma lista de bases que podem ser selecionadas.

### 3.3 Serviços e Camada de Comunicação com a API
A camada de serviço da aplicação, localizada no diretório `src/services/`, é responsável pela comunicação com a API backend. Os serviços são divididos de acordo com o tipo de entidade que manipulam, por exemplo:
- **authService**: Responsável por autenticar usuários e validar tokens.
- **ticketService**: Responsável por todas as operações relacionadas aos tickets, como criar, alterar e buscar tickets.
- **prestadorService** e **servicoService**: Manipulam prestadores e serviços respectivamente.

### 3.4 Validações e Utilitários
Para garantir a integridade dos dados, são utilizadas ferramentas de validação como **Yup**. Os esquemas de validação são definidos no diretório `src/validation/`.
- **prestadorValidationSchema**: Define regras de validação para os prestadores.
- **ticketValidationSchema**: Define regras de validação para os tickets.

Além disso, no diretório `src/utils/` há funções auxiliares que facilitam a formatação de dados e tratamento de erros.

### 3.5 Estilos e Customizações
Os estilos são gerenciados principalmente com **Chakra UI**, permitindo uma estilização consistente e baseada em temas. O arquivo de configuração do tema personalizado encontra-se em `src/theme/index.jsx`. Além disso, estilos específicos como os do componente **Esteira** são definidos em `src/styles/esteira/esteira.css`.

## 4. Estrutura de Pastas
A estrutura de pastas da aplicação segue uma organização por domínio para facilitar o desenvolvimento:
```
src/
├── components/         # Componentes reutilizáveis e específicos
├── contexts/           # Contextos de gerenciamento de estado
├── initValues/         # Valores iniciais para formulários e entidades
├── pages/              # Páginas da aplicação (telas principais)
├── services/           # Serviços de comunicação com a API
├── styles/             # Estilos customizados
├── theme/              # Configurações de tema para Chakra UI
├── utils/              # Funções utilitárias
└── validation/         # Esquemas de validação dos formulários
```

## 5. Fluxo de Dados
O fluxo de dados da aplicação segue uma arquitetura **unidirecional**. Os componentes apresentam os dados, e qualquer alteração nos dados é realizada através dos **contextos** e dos **serviços** que fazem a ponte com a API.
- **Componentes**: Exibem as informações e invocam ações através dos contextos.
- **Contextos**: Gerenciam os estados globais e chamam os serviços para realizar operações na API.
- **Serviços**: Fazem a comunicação com a API, retornando resultados para os contextos que, por sua vez, atualizam os componentes.

## 6. Autenticação e Controle de Acesso
A autenticação é realizada através de tokens **JWT**. A camada de serviço (`authService`) é responsável por fazer login e armazenar o token no **localStorage** do navegador. As requisições subsequentes à API contêm esse token no cabeçalho para garantir o acesso controlado.
- O **AuthContext** é o ponto central de gerenciamento de autenticação, fornecendo funções como login, logout e verificação de sessão.
- O token é automaticamente anexado às requisições pela utilização de um **interceptor** do **Axios**.

## 7. Padrões e Convenções
Para garantir consistência e qualidade de código, são seguidas as seguintes diretrizes:
- **Padrão de Componentização**: Cada componente deve ser responsável por uma única função.
- **Contextos Segregados**: Cada contexto deve ter uma responsabilidade única (por exemplo, autenticação, tickets).
- **Validação**: Todos os formulários passam por validação utilizando esquemas **Yup** para garantir a integridade dos dados.
- **Toast Notifications**: Qualquer erro ou sucesso que necessite ser comunicado ao usuário deve ser feito através do **Chakra UI** ou **React Toastify**.

---

Este documento de arquitetura fornece uma visão detalhada do projeto **CST-Rakuten Frontend**, servindo como guia para desenvolvedores que desejam compreender a estrutura do código, padrões e melhores práticas adotadas. Caso precise de mais informações, consulte a documentação interna ou a equipe de desenvolvimento.

