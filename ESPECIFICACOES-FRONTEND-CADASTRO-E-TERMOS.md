# 📘 Especificações de Integração Frontend — Cadastro e Termos de Uso

Este documento descreve detalhadamente as regras de negócio, contratos de API (endpoints, payloads, headers), validações de formulário e fluxos de tela necessários para a implementação no Frontend.

---

## 📌 Sumário
1. [Visão Geral](#1-visão-geral)
2. [Fluxo e Regras da Tela de Cadastro](#2-fluxo-e-regras-da-tela-de-cadastro)
3. [Contrato da API: Cadastro (`POST /api/auth/cadastro`)](#3-contrato-da-api-cadastro)
4. [Lógica de Exibição dos Termos no Frontend](#4-lógica-de-exibição-dos-termos-no-frontend)
5. [Área do Aluno: Ações com Termos (Área Logada)](#5-área-do-aluno-ações-com-termos-área-logada)
   - [Reenvio por E-mail (`POST /api/termos/enviar-email`)](#51-reenvio-por-e-mail)
   - [Download / Visualização Direta em PDF (`GET /api/termos/download`)](#52-download-e-visualização-do-pdf)
6. [Exemplos de Implementação (TypeScript / React / Axios)](#6-exemplos-de-implementação)
7. [Tratamento de Erros Padronizado](#7-tratamento-de-erros-padronizado)

---

## 1. Visão Geral

O backend implementa o fluxo de cadastro transacional e um sistema de **termos de uso dinâmicos** sem persistência de blobs ou arquivos estáticos:
- O aceite do termo é registrado no banco de dados com metadados de auditoria (`aceito`, `dataAceite`, `versao`, `tipoTermo`).
- O backend gera o PDF **dinamicamente em memória (Buffer)** conforme o perfil do aluno:
  - **Aluno Maior de Idade (≥ 18 anos):** Termo Padrão (`TipoTermo.PADRAO`) — Plataforma EduMentor AI.
  - **Aluno Menor de Idade (< 18 anos):** Termo com Validação Legal e Tutelar (`TipoTermo.MENOR_DE_IDADE`) com dados do responsável e aviso do Art. 14 da LGPD.
- No momento da matrícula, o backend **dispara automaticamente** um e-mail com o PDF em anexo para o aluno.
- O aluno autenticado pode a qualquer momento **solicitar novo envio por e-mail** ou **fazer download/visualização direta do PDF**.

---

## 2. Fluxo e Regras da Tela de Cadastro

### 2.1. Campos e Validações de Interface

| Campo | Tipo / Formato | Obrigatório | Regras de Validação no Frontend |
|---|---|:---:|---|
| **Nome Completo** | `text` | Sim | 3 a 100 caracteres. Apenas letras e espaços. Deve conter ao menos nome e sobrenome. |
| **Data de Nascimento** | `date` (`YYYY-MM-DD`) | Sim | Data válida no passado. Usada para calcular se o aluno é menor de idade. |
| **Escolaridade** | `select` | Sim | Valores aceitos: `ENSINO_FUNDAMENTAL`, `ENSINO_MEDIO`, `ENSINO_SUPERIOR`, `POS_GRADUACAO`. |
| **Celular** | `text` | Sim | Máscara obrigatória: `(99) 99999-9999` (formato `(11) 91234-5678`). |
| **E-mail Principal** | `email` | Sim | Máximo 254 caracteres. Formatos aceitos: `.com` ou `.com.br`. |
| **E-mail de Recuperação** | `email` | Sim | Mesmas regras do principal. **Deve ser obrigatoriamente diferente** do e-mail principal. |
| **Senha** | `password` | Sim | 8 a 20 caracteres. Requer ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (`!@#$%&*`). Não pode conter espaços, nem sequências numéricas (ex: `123`), nem partes do nome ou e-mail. |
| **Confirmar Senha** | `password` | Sim | Deve ser estritamente igual à senha. |
| **Responsável Legal — Nome** | `text` | Condicional | **Obrigatório se idade < 18 anos**. Nome completo com letras e espaços. |
| **Responsável Legal — CPF** | `text` | Condicional | **Obrigatório se idade < 18 anos**. 11 dígitos numéricos (com máscara `000.000.000-00`). Enviar apenas números `^\d{11}$`. |
| **Checkbox de Termos** | `checkbox` | Sim | **Obrigatório estar marcado (`true`)**. Desabilita o botão de submit se desmarcado. |

### 2.2. Gatilho de Menor de Idade
Quando o usuário digita a **Data de Nascimento**:
1. Calcule a idade em tempo real.
2. Se `idade < 18`:
   - Exiba a seção **"Dados do Responsável Legal"** (campos Nome e CPF tornam-se visíveis e obrigatórios).
   - O texto do checkbox de termos deve contextualizar a anuência do responsável.
3. Se `idade >= 18`:
   - Oculte e limpe os campos do Responsável Legal (não devem ser enviados no payload).

---

## 3. Contrato da API: Cadastro

### `POST /api/auth/cadastro`
- **Autenticação:** Pública (sem token).
- **Content-Type:** `application/json`

#### Exemplo 1: Payload para Aluno Maior de Idade (≥ 18 anos)
```json
{
  "nomeCompleto": "Carlos Eduardo da Silva",
  "dataNascimento": "2000-05-15",
  "escolaridade": "ENSINO_MEDIO",
  "celular": "(11) 98765-4321",
  "email": "carlos.silva@exemplo.com",
  "emailRecuperacao": "carlos.recupera@exemplo.com.br",
  "senha": "Forte@9xQ2026",
  "confirmarSenha": "Forte@9xQ2026",
  "termosAceitos": true
}
```

#### Exemplo 2: Payload para Aluno Menor de Idade (< 18 anos)
```json
{
  "nomeCompleto": "Lucas Gabriel da Silva",
  "dataNascimento": "2010-08-20",
  "escolaridade": "ENSINO_FUNDAMENTAL",
  "celular": "(11) 91234-5678",
  "email": "lucas.aluno@exemplo.com",
  "emailRecuperacao": "mae.lucas@exemplo.com.br",
  "senha": "Forte@9xQ2026",
  "confirmarSenha": "Forte@9xQ2026",
  "responsavelLegal": {
    "nomeCompleto": "Mariana Pereira da Silva",
    "cpf": "12345678901"
  },
  "termosAceitos": true
}
```

#### Respostas da API
- **`201 Created`**: Cadastro concluído com sucesso. O corpo de resposta é vazio (`{}`). O backend já grava os dados na transação e enfileira o envio do termo em PDF por e-mail.
  - *Ação no Frontend:* Exibir notificação de sucesso: *"Cadastro realizado com sucesso! Enviamos uma cópia do seu termo de adesão para seu e-mail."* e redirecionar para a tela de login.
- **`400 Bad Request`**: Dados inválidos (ex.: senha fraca, menor de idade sem responsável, termos não aceitos). O payload detalhado virá no array `message` e no objeto `errors`.
- **`409 Conflict`**: E-mail já utilizado na plataforma (`message: "Este e-mail já está em uso"`).

---

## 4. Lógica de Exibição dos Termos no Frontend

Ao lado do checkbox de aceite, forneça um link para abrir os termos em um modal ou drawer:

```html
<label>
  <input type="checkbox" name="termosAceitos" required />
  <span>
    Li e concordo com os 
    <a href="#" onClick="abrirModalTermos()">Termos de Uso e Política de Privacidade</a>
  </span>
</label>
```

### Qual conteúdo exibir no Modal de Prévia?
- **Se `idade < 18`:** Apresente o texto baseado no modelo de menores:
  - Título: *Termo com Validação Legal e Tutelar (Menores de Idade)*
  - Destaque: *Aviso aos Pais e Responsáveis Legais (Artigo 14 da LGPD)*
  - Cláusulas de representação civil e consentimento parental.
- **Se `idade >= 18`:** Apresente o texto baseado no modelo padrão:
  - Título: *Termos de Uso e Política de Privacidade — EduMentor AI*
  - Cláusulas gerais de uso da IA, conduta ética, inexistência de comunicação peer-to-peer e privacidade LGPD.

---

## 5. Área do Aluno: Ações com Termos (Área Logada)

Após efetuar o login, o aluno possui o token JWT. As seguintes ações devem estar disponíveis no perfil ou painel de configurações do aluno:

### 5.1. Reenvio por E-mail
O aluno clica em **"Enviar Termo de Adesão por E-mail"**.

- **Rota:** `POST /api/termos/enviar-email`
- **Headers:**
  - `Authorization: Bearer <TOKEN_JWT>`
- **Body:** Vazio (`{}`)
- **Resposta `200 OK`:**
  ```json
  {
    "message": "Termo de adesão gerado e enviado por e-mail com sucesso."
  }
  ```
- **Feedback:** Toast de sucesso informando que o documento foi enviado para a caixa de entrada.

---

### 5.2. Download e Visualização do PDF
O aluno clica em **"Baixar Termo em PDF"** ou **"Visualizar Termo"**.

- **Rota:** `GET /api/termos/download`
- **Headers:**
  - `Authorization: Bearer <TOKEN_JWT>`
- **Resposta `200 OK`:**
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline; filename="Termo_de_Adesao.pdf"`
  - Corpo: Stream binário (Blob) do PDF gerado sob demanda.

---

## 6. Exemplos de Implementação

### 6.1. Tipos TypeScript (`types/auth.ts`)
```typescript
export enum Escolaridade {
  ENSINO_FUNDAMENTAL = 'ENSINO_FUNDAMENTAL',
  ENSINO_MEDIO = 'ENSINO_MEDIO',
  ENSINO_SUPERIOR = 'ENSINO_SUPERIOR',
  POS_GRADUACAO = 'POS_GRADUACAO',
}

export interface ResponsavelLegalPayload {
  nomeCompleto: string;
  cpf: string; // 11 dígitos limpos
}

export interface CadastroPayload {
  nomeCompleto: string;
  dataNascimento: string; // YYYY-MM-DD
  escolaridade: Escolaridade;
  celular: string; // (11) 91234-5678
  email: string;
  emailRecuperacao: string;
  senha: string;
  confirmarSenha: string;
  termosAceitos: boolean; // Deve ser true
  responsavelLegal?: ResponsavelLegalPayload;
}
```

---

### 6.2. Serviços de Integração com Axios (`services/termosService.ts`)
```typescript
import api from './api'; // Instância configurada do axios com baseURL e interceptor de token

export const termosService = {
  /**
   * Solicita o reenvio do termo em PDF por e-mail
   */
  async reenviarPorEmail(): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/api/termos/enviar-email');
    return data;
  },

  /**
   * Faz o download do PDF em memória ou abre em nova aba
   * @param abrirEmNovaAba Se true, abre a pré-visualização no navegador
   */
  async baixarPdf(abrirEmNovaAba = false): Promise<void> {
    const response = await api.get('/api/termos/download', {
      responseType: 'blob',
    });

    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    if (abrirEmNovaAba) {
      window.open(fileURL, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'Termo_de_Adesao_Sherlock.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    // Libera a memória do objeto URL
    setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
  },
};
```

---

### 6.3. Cálculo de Idade Utilitário (`utils/calcularIdade.ts`)
```typescript
export function calcularIdade(dataNascimentoIso: string): number {
  if (!dataNascimentoIso) return 0;
  const nascimento = new Date(dataNascimentoIso);
  const hoje = new Date();

  let idade = hoje.getUTCFullYear() - nascimento.getUTCFullYear();
  const aindaNaoFezAniversario =
    hoje.getUTCMonth() < nascimento.getUTCMonth() ||
    (hoje.getUTCMonth() === nascimento.getUTCMonth() &&
      hoje.getUTCDate() < nascimento.getUTCDate());

  if (aindaNaoFezAniversario) {
    idade--;
  }

  return idade;
}
```

---

## 7. Tratamento de Erros Padronizado

O backend possui um filtro global de exceções que devolve respostas sempre no seguinte padrão:

```json
{
  "statusCode": 400,
  "message": [
    "É obrigatório aceitar os termos de uso.",
    "Responsável legal é obrigatório para menores de idade."
  ],
  "errors": {
    "termosAceitos": ["É obrigatório aceitar os termos de uso."],
    "responsavelLegal": ["O nome do responsável é obrigatório."]
  },
  "path": "/api/auth/cadastro",
  "timestamp": "2026-10-13T22:30:00.000Z"
}
```

### Diretrizes de Feedback no Front:
1. **Campos inválidos (`400`):** Conecte o objeto `errors[campo]` diretamente aos erros visuais de cada input do formulário.
2. **Conflito de e-mail (`409`):** Exiba alerta no campo de e-mail informando que já existe uma conta cadastrada com aquele endereço e sugira o login.
3. **Não autorizado (`401`):** Redirecione o usuário para a tela de login limpando tokens inválidos ou expirados.

