import {
  object,
  string,
  boolean,
  email,
  minLength,
  maxLength,
  regex,
  pipe,
  nonEmpty,
  trim,
  InferInput,
  optional,
} from "valibot";

export const registerSchema = object({
  name: pipe(
    string("O campo nome é obrigatório"),
    nonEmpty("O campo nome é obrigatório"),
    trim(),
    minLength(2, "O campo nome deve conter entre 2 e 50 caracteres"),
    maxLength(50, "O campo nome deve conter entre 2 e 50 caracteres"),
    regex(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, "Apenas letras, acentuação e espaços"),
  ),

  surname: pipe(
    string("O campo sobrenome é obrigatório"),
    nonEmpty("O campo sobrenome é obrigatório"),
    trim(),
    minLength(2, "O campo Sobrenome deve conter entre 2 e 50 caracteres"),
    maxLength(50, "O campo Sobrenome deve conter entre 2 e 50 caracteres"),
    regex(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, "Apenas letras, acentuação e espaços"),
  ),

  email: pipe(
    string("O campo e-mail é obrigatório."),
    nonEmpty("O campo e-mail é obrigatório."),
    trim(),
    email("O formato do e-mail parece inválido."),
    regex(/@.*\.(com|com\.br)$/, "Formato inválido (nome@dominio.com)"),
    maxLength(50, "Máximo de 50 caracteres"),
  ),

  generatePassword: optional(boolean()),

  password: optional(string()), 
});

export type registerSchema = InferInput<typeof registerSchema>;