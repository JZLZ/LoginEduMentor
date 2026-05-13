"use client";

import { ChangeEvent, useActionState, useEffect, useRef, useState } from "react";
import { RegisterUser } from "../actions/registerActions";
import { RegisterState } from "../types";
import { InferInput } from "valibot";
import { registerSchema } from "../lib/schemas/registerSchema";

export type RegisterInput = InferInput<typeof registerSchema>;

const initialState: RegisterState<Partial<RegisterInput>> = {
  success: false,
  errors: {},
  inputs: {},
};

export function useRegisterForm() {
  const [state, formAction, isPending] = useActionState(RegisterUser, initialState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const prevSuccess = useRef(state.success);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formValues, setFormValues] = useState<Partial<RegisterInput>>({ generatePassword: true });
  const [clientErrors, setClientErrors] = useState<Partial<Record<keyof RegisterInput, string[]>>>({});

  useEffect(() => {
    if (state.success && !prevSuccess.current) {
      // O setTimeout resolve o aviso "Calling setState synchronously within an effect"
      const timer = setTimeout(() => {
        setShowSuccessModal(true);
        setFormValues({ generatePassword: true });
        setClientErrors({});
      }, 0);
      
      prevSuccess.current = true;
      return () => clearTimeout(timer);
    }
    
    prevSuccess.current = state.success;
  }, [state.success]);

  const handleCloseModal = () => setShowSuccessModal(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof RegisterInput;
    const { value, type, checked } = e.target;
    const valorReal = type === "checkbox" ? checked : value;

    setFormValues((prev) => ({ ...prev, [name]: valorReal }));
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const novo = { ...prev };
        delete novo[name];
        return novo;
      });
    }
  };

  const getValue = (field: keyof RegisterInput): string => {
    const val = formValues[field] ?? state.inputs?.[field];
    return val !== null && val !== undefined && typeof val !== "boolean" ? String(val) : "";
  };

  const getChecked = (field: keyof RegisterInput): boolean => {
    const val = formValues[field] ?? state.inputs?.[field];
    return Boolean(val);
  };

  const getError = (field: keyof RegisterInput) => {
    if (clientErrors[field]) return clientErrors[field]![0];
    if (state.errors?.[field]) return state.errors[field]![0];
    return undefined;
  };

  const togglePassword = () => setShowPassword((p) => !p);

  return {
    state,
    formAction,
    isPending,
    handleChange,
    getValue,
    getChecked,
    getError,
    showPassword,
    togglePassword,
    showSuccessModal,
    handleCloseModal,
  };
}