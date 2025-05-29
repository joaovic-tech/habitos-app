/**
 * Tipos para o sistema de validação
 */
import { z } from "zod";

export type ValidationResult = {
  isValid: boolean;
  message?: string;
};

/**
 * Esquema Zod para validação de e-mail
 */
export const emailSchema = z
  .string()
  .min(1, { message: "Digite seu e-mail" })
  .min(5, { message: "E-mail muito curto" })
  .max(50, { message: "E-mail muito longo" })
  .email({ message: "E-mail inválido" });

/**
 * Esquema Zod para validação de senha
 */
export const passwordSchema = z
  .string()
  .min(1, { message: "Digite sua senha" })
  .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  .max(50, { message: "Senha muito longa" });

/**
 * Esquema Zod para validação de nome
 */
export const nameSchema = z
  .string()
  .min(1, { message: "Digite seu nome" })
  .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
  .max(50, { message: "Nome muito longo" })
  .refine((value) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
    message: "Nome não deve conter números ou caracteres especiais",
  });

/**
 * Esquema Zod para validação de sobrenome
 */
export const surnameSchema = z
  .string()
  .min(1, { message: "Digite seu sobrenome" })
  .min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" })
  .max(50, { message: "Sobrenome muito longo" })
  .refine((value) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
    message: "Sobrenome não deve conter números ou caracteres especiais",
  });

/**
 * Função auxiliar para verificar se uma data é válida (incluindo anos bissextos)
 */
const isValidDate = (day: number, month: number, year: number): boolean => {
  try {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  } catch {
    return false;
  }
};

/**
 * Esquema Zod para validação de data de nascimento
 */
export const birthDateSchema = z
  .string()
  .min(1, { message: "Digite sua data de nascimento" })
  .refine((value) => /^\d{2}\/\d{2}\/\d{4}$/.test(value), {
    message: "Data deve estar no formato DD/MM/AAAA",
  })
  .refine(
    (value) => {
      const [day, month, year] = value.split("/").map(Number);
      return isValidDate(day, month, year);
    },
    { message: "Data inválida" }
  )
  .refine(
    (value) => {
      const [day, month, year] = value.split("/").map(Number);
      const birthDateObj = new Date(year, month - 1, day);
      const currentDate = new Date();
      return birthDateObj <= currentDate;
    },
    { message: "Data de nascimento não pode ser no futuro" }
  )
  .refine(
    (value) => {
      const [day, month, year] = value.split("/").map(Number);
      const birthDateObj = new Date(year, month - 1, day);
      const currentDate = new Date();
      const maxAgeDate = new Date();
      maxAgeDate.setFullYear(currentDate.getFullYear() - 120);
      return birthDateObj >= maxAgeDate;
    },
    { message: "Idade não pode ser maior que 120 anos" }
  );

/**
 * Esquema Zod para validação do formulário de login
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Esquema Zod para validação do formulário de registro
 */
export const registerFormSchema = z.object({
  name: nameSchema,
  surname: surnameSchema,
  birthDate: birthDateSchema,
  email: emailSchema,
  password: passwordSchema,
  termsAccepted: z.literal(true, {
    errorMap: () => ({
      message: "Você precisa aceitar os termos para continuar",
    }),
  }),
});

/**
 * Função para converter o resultado do safeParse do Zod para o tipo ValidationResult
 */
const zodResultToValidationResult = (
  result: z.SafeParseReturnType<any, any>
): ValidationResult => {
  if (result.success) {
    return { isValid: true };
  }

  // Extrai a primeira mensagem de erro
  const firstError = result.error.errors[0];
  return {
    isValid: false,
    message: firstError.message,
  };
};

/**
 * Funções específicas para validar cada campo
 */
export const validateEmail = (email: string): ValidationResult => {
  const result = emailSchema.safeParse(email);
  return zodResultToValidationResult(result);
};

export const validatePassword = (password: string): ValidationResult => {
  const result = passwordSchema.safeParse(password);
  return zodResultToValidationResult(result);
};

export const validateName = (name: string): ValidationResult => {
  const result = nameSchema.safeParse(name);
  return zodResultToValidationResult(result);
};

export const validateSurname = (surname: string): ValidationResult => {
  const result = surnameSchema.safeParse(surname);
  return zodResultToValidationResult(result);
};

export const validateBirthDate = (birthDate: string): ValidationResult => {
  const result = birthDateSchema.safeParse(birthDate);
  return zodResultToValidationResult(result);
};

/**
 * Função para validação do formulário de registro
 * Retorna o primeiro erro encontrado ou null se tudo estiver válido
 */
export const validateRegisterForm = (
  name: string,
  surname: string,
  birthDate: string,
  email: string,
  password: string,
  termsAccepted: boolean
): ValidationResult | null => {
  const result = registerFormSchema.safeParse({
    name,
    surname,
    birthDate,
    email,
    password,
    termsAccepted,
  });

  if (result.success) {
    return null;
  }

  // Extrai a primeira mensagem de erro
  const firstError = result.error.errors[0];
  return {
    isValid: false,
    message: firstError.message,
  };
};

/**
 * Função para validação do formulário de login
 * Retorna o primeiro erro encontrado ou null se tudo estiver válido
 */
export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult | null => {
  const result = loginFormSchema.safeParse({
    email,
    password,
  });

  if (result.success) {
    return null;
  }

  // Extrai a primeira mensagem de erro
  const firstError = result.error.errors[0];
  return {
    isValid: false,
    message: firstError.message,
  };
};
