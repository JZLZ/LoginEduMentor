export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role?: string;
}

export interface RegisterApiResponse {
  message: string;
  data: User & { tempPassword?: string | null };
}

export type RegisterState<T = unknown> = {
  success: boolean;
  message?: string;
  tempPassword?: string | null; // <-- Adicionado para guardar a senha gerada
  errors?: Record<string, string[] | undefined>;
  inputs?: T;
};