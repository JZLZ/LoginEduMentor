<div align="center">

# 🎓 EduMentor AI — Sherlock Frontend

Plataforma adaptativa de estudos e tutoria para o ENEM com inteligência artificial (Mentorina), simulados com questões reais, trilhas personalizadas e acompanhamento 24h.

<p align="center">
  <img src="https://img.shields.io/badge/Yarn-1.22.22-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Integration" />
</p>

</div>

---

## 📌 Visão Geral

O **EduMentor AI (Sherlock Frontend)** é a interface web da plataforma adaptativa de aprendizagem. O sistema integra-se diretamente ao **`sherlock-backend`** (API em NestJS com MongoDB) para gerenciar autenticação segura via tokens JWT, validação de termos e conduzir o aluno por uma jornada completa: desde a Landing Page até o onboarding adaptativo por curso e simulados.

> ⚠️ **Atenção:** Este projeto está configurado para ser executado e gerenciado **exclusivamente com Yarn**. Outros gerenciadores (`npm` ou `pnpm`) são automaticamente bloqueados via script de preinstall.

---

## 🚀 Funcionalidades

### 🌟 Landing Page Interativa
- **Apresentação Completa:** Apresentação visual da plataforma com a tutora virtual **Mentorina** e paleta de cores oficial.
- **Card "Bora pro ENEM?":** Chamada para ação centralizada com a Mentorina em formato escadaria e acesso direto ao fluxo de cadastro.
- **Destaques e Recursos:** Trilhas adaptativas, simulados com questões oficiais do ENEM e tutoria inteligente.

### 🔐 Autenticação & Cadastro (`sherlock-backend`)
- **Login Seguro:** Autenticação via e-mail e senha integrada à API (`POST /api/auth/login`) com armazenamento de token JWT em `localStorage` (`sherlock_auth_token`).
- **Modal de Seleção de Perfis:** Interface para alternar entre perfil Vestibulando e Universitário após o login.
- **Cadastro Completo:** Registro de novos usuários (`POST /api/user/register`) com validação de nome, sobrenome, e-mail (domínio `.com` ou `.com.br`) e regras de senha segura.
- **Suporte a Menores de 18 Anos:** Cálculo dinâmico de idade com base na data de nascimento e exibição de campos obrigatórios do responsável legal (nome e CPF com validação matemática dos dígitos verificadores).
- **Termos de Uso e Política de Privacidade:** Modal completo com validação de termos de uso e consentimento específico nos moldes do **Artigo 14 da LGPD** (para menores) e termos gerais de adesão (para maiores).
- **Preenchimento Rápido com 1 Clique:** Botões para preencher dados válidos de teste tanto no Login (Admin Seed) quanto no Cadastro.

### 🧭 Onboarding Adaptativo (3 Etapas)
1. **Etapa 1 (Curso-Alvo):** Seleção de graduação e universidade almejada com pesos dinâmicos por área de conhecimento no ENEM.
2. **Etapa 2 (Como Começar):**
   - *Fazer Nivelamento:* Simulado com questões reais, temporizador e gráfico de desempenho.
   - *Escolher Matérias:* Seleção de disciplinas prioritárias para foco imediato.
3. **Etapa 3 (Meta Semanal):** Definição de carga horária, dias de estudo e contagem regressiva para a prova do ENEM.
4. **Finalização:** Trilha de estudos adaptativa gerada e pronta para o aluno.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **Yarn 1.22.x** | Gerenciador de pacotes exclusivo do projeto |
| **React 19** | Biblioteca de interface reativa de última geração |
| **TypeScript** | Tipagem estática rigorosa para segurança e manutenibilidade |
| **Tailwind CSS v4** | Framework utilitário de estilos via `@tailwindcss/vite` |
| **Vite 8** | Ferramenta de build e desenvolvimento com Hot Module Replacement (HMR) |
| **NestJS API Client** | Camada de integração HTTP com `sherlock-backend` (JWT, CORS, DTOs) |
| **oxfmt** | Formatador de código de alto desempenho |

---

## 📁 Estrutura do Projeto

```
sherlock-frontend/
├── .env                       # Variáveis de ambiente (VITE_API_URL)
├── .env.example               # Modelo de configuração de ambiente
├── .mise.toml                 # Toolchain (Node.js 22, Yarn 1.22.22)
├── AGENTS.md                  # Especificações técnicas do ambiente
├── index.html                 # Shell HTML da aplicação
├── package.json               # Dependências, engines e scripts Yarn
├── yarn.lock                  # Lockfile oficial do projeto (exclusivo)
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração do Vite, plugins e Tailwind v4
├── public/                    # Arquivos estáticos servidos diretamente
│   └── pdfs/                  # PDFs oficiais dos Termos de Uso e Privacidade
└── src/
    ├── assets/                # Imagens, favicons e logotipo vetorial
    │   ├── img/               # Favicons e ilustrações
    │   └── logo/              # Vetores e tipografia oficial EduMentor AI
    ├── components/            # Componentes modulares
    │   └── LandingPage.tsx    # Landing Page completa com Mentorina
    ├── services/
    │   └── api.ts             # Cliente HTTP e autenticação com sherlock-backend
    ├── TermsModal.tsx         # Modal completo de Termos de Uso e LGPD Art. 14
    ├── App.tsx                # Gerenciador de telas (Landing, Login, Cadastro, Onboarding)
    ├── index.css              # Sistema de design, tokens CSS e Tailwind v4
    ├── main.tsx               # Bootstrap da aplicação React 19
    └── vite-env.d.ts          # Declaração de tipos do Vite
```

---

## ⚙️ Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 20 ou superior — recomendado Node 22)
- **Yarn** (versão 1.22 ou superior)

Para verificar as versões instaladas:
```bash
node -v
yarn -v
```

Caso não possua o Yarn instalado globalmente:
```bash
npm install -g yarn
```

---

## 🚀 Como Rodar o Projeto

### 1. Acessar o Diretório

```bash
cd sherlock-frontend
```

### 2. Instalar as Dependências com Yarn

> ⚠️ Utilize **apenas o Yarn**. O comando `npm install` é automaticamente recusado.

```bash
yarn install
```

### 3. Configurar as Variáveis de Ambiente

Crie o arquivo `.env` a partir do modelo `.env.example`:

```bash
# Windows (PowerShell):
Copy-Item .env.example .env

# Linux / macOS:
cp .env.example .env
```

Conteúdo padrão do arquivo `.env`:
```env
# URL base da API do sherlock-backend (NestJS)
VITE_API_URL=http://localhost:21165/api
```

### 4. Iniciar o Backend (`sherlock-backend`)

Para que as funções de autenticação e persistência no banco de dados funcionem:

```bash
cd ../sherlock-backend
yarn install
yarn start:dev
```

- API NestJS: `http://localhost:21165/api`
- Documentação Swagger: `http://localhost:21165/api-docs`

### 5. Iniciar o Frontend em Modo de Desenvolvimento

No diretório `sherlock-frontend`:

```bash
yarn dev
```

Acesse a aplicação no navegador em **`http://localhost:8443`** (ou a porta informada pelo Vite).

---

## 🧪 Credenciais e Atalhos de Teste

Para agilizar o desenvolvimento e validação, o sistema conta com atalhos de preenchimento automático:

| Cenário | Onde Encontrar | Dados Utilizados |
|---|---|---|
| **Administrador (Seed)** | Tela de Login → Botão `⚡ Preencher dados de teste (Admin)` | `admin@admin.com` / `Admin@123` |
| **Aluno de Teste** | Tela de Cadastro → Botão `⚡ Simular preenchimento` | `julia.andrade[ID]@email.com` / `EduMentor2026@` |

---

## 📦 Scripts Disponíveis

Todos os comandos devem ser executados com o **Yarn**:

| Comando | Descrição |
|---|---|
| `yarn dev` | Inicia o servidor Vite de desenvolvimento com Hot Reload |
| `yarn build` | Compila o projeto com TypeScript e Vite para produção na pasta `dist/` |
| `yarn preview` | Executa um servidor local para inspecionar o build de produção |
| `yarn format` | Formata o código fonte com `oxfmt` |

---

## 📄 Licença

Este projeto é de uso privado e educacional para o ecossistema **EduMentor AI / Sherlock**.
