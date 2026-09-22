<div align="center">

# Frontend Template

Aplicação web construída com Next.js (App Router), React e TypeScript, com autenticação, formulários validados e estilização via Tailwind CSS.

<br />

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nextjs,ts,tailwind,nodejs,figma" alt="Tech Stack Icons" />
</p>

</div>

---

## ⚙️ Tecnologias Usadas

| Tecnologia | Descrição |
|------------|-----------|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=white) | Biblioteca para construção da UI |
| ![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat&logo=next.js&logoColor=white) | Framework React (App Router) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Tipagem estática |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Estilização utilitária |
| ![Valibot](https://img.shields.io/badge/-Valibot-3B82F6?style=flat&logoColor=white) | Validação de schemas de formulário |
| ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) | Padronização e qualidade de código |
| ![Yarn](https://img.shields.io/badge/-Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white) | Gerenciador de pacotes |
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white) | Containerização |
| ![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=flat&logo=figma&logoColor=white) | Design da UI |

---

## 📁 Estrutura de Pastas

```
📦frontend
 ┣ 📂public
 ┃ ┗ 📂assets            # Imagens e ícones estáticos
 ┣ 📂src
 ┃ ┣ 📂actions           # Server actions (auth, registro)
 ┃ ┣ 📂app               # Rotas do App Router
 ┃ ┃ ┣ 📂(protected)     # Rotas autenticadas (home)
 ┃ ┃ ┣ 📂(public)        # Rotas públicas (login)
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┣ 📜not-found.tsx
 ┃ ┃ ┗ 📜globals.css
 ┃ ┣ 📂components        # Componentes de UI (login, register, ui)
 ┃ ┣ 📂context           # Contextos React (AuthContext)
 ┃ ┣ 📂hooks             # Hooks customizados (forms)
 ┃ ┣ 📂lib               # Utilitários, fontes e schemas
 ┃ ┣ 📂types             # Definições de tipos
 ┃ ┗ 📜proxy.ts
 ┣ 📜.env.exemple
 ┣ 📜dockerfile
 ┣ 📜eslint.config.mjs
 ┣ 📜next.config.ts
 ┣ 📜postcss.config.mjs
 ┣ 📜package.json
 ┗ 📜Readme.md
```

---

## 🚀 Como Rodar o Projeto

### 1. Instalar as dependências

```bash
yarn install
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` e copie o conteúdo de `.env.exemple`.

### 3. Rodar em modo de desenvolvimento

```bash
yarn dev
```

### 4. Gerar a versão final (build para produção)

```bash
yarn build
```

### 5. Rodar em modo de produção

> Só funciona depois de rodar o `yarn build`.

```bash
yarn start
```

### 6. Rodar o Lint

Vasculha todo o código à procura de más práticas, variáveis não utilizadas, erros de digitação e problemas de formatação.

```bash
yarn lint
```
