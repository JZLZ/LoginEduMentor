export enum Escolaridade {
  ENSINO_FUNDAMENTAL = "ENSINO_FUNDAMENTAL",
  ENSINO_MEDIO = "ENSINO_MEDIO",
  ENSINO_SUPERIOR = "ENSINO_SUPERIOR",
  POS_GRADUACAO = "POS_GRADUACAO",
}

export interface ResponsavelLegalPayload {
  nomeCompleto: string;
  cpf: string;
}

export interface CadastroPayload {
  nomeCompleto: string;
  dataNascimento: string;
  escolaridade: Escolaridade;
  celular: string;
  email: string;
  emailRecuperacao: string;
  senha: string;
  confirmarSenha: string;
  termosAceitos: boolean;
  responsavelLegal?: ResponsavelLegalPayload;
}

export interface ReenviarTermosResponse {
  message: string;
}

