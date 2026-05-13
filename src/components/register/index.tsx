// src/components/register/index.tsx
"use client";

import { useRegisterForm } from "@/src/hooks/useRegisterForm";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { SuccessModal } from "@/src/components/ui/SuccessModal";

const EyeIcon = ({ visible }: { visible: boolean }) => {
  const Icon = visible ? FiEye : FiEyeOff;
  return (
    <Icon size={22} style={{ color: "#759FFE" }} className={`transition-opacity ${visible ? "opacity-100" : "opacity-60"}`} />
  );
};

export default function Register() {
  const {
    formAction,
    isPending,
    getError,
    getValue,
    getChecked,
    handleChange,
    state,
    showPassword,
    togglePassword,
    showSuccessModal,
    handleCloseModal,
  } = useRegisterForm();

  const isGenerating = getChecked("generatePassword");

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
      <h2 className="text-2xl font-bold text-secondary-700 mb-4">Cadastrar Novo Usuário</h2>
      
      <form action={formAction} className="w-full relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col mb-2">
            <label htmlFor="name" className="text-secondary-700 text-sm font-bold">Nome:</label>
            <input id="name" name="name" type="text" placeholder="Ex: João" value={getValue("name")} onChange={handleChange} className="mt-1 p-2 border-2 rounded-lg bg-secondary-100 text-black focus:outline-none border-secondary-200"/>
            {getError("name") && <span className="text-[#f80303] font-bold text-xs mt-1">{getError("name")}</span>}
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="surname" className="text-secondary-700 text-sm font-bold">Sobrenome:</label>
            <input id="surname" name="surname" type="text" placeholder="Ex: Silva" value={getValue("surname")} onChange={handleChange} className="mt-1 p-2 border-2 rounded-lg bg-secondary-100 text-black focus:outline-none border-secondary-200"/>
            {getError("surname") && <span className="text-[#f80303] font-bold text-xs mt-1">{getError("surname")}</span>}
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-secondary-700 text-sm font-bold">E-mail do usuário:</label>
          <input id="email" name="email" type="email" placeholder="usuario@email.com" value={getValue("email")} onChange={handleChange} className="mt-1 p-2 border-2 rounded-lg bg-secondary-100 text-black focus:outline-none border-secondary-200"/>
          {getError("email") && <span className="text-[#f80303] font-bold text-xs mt-1">{getError("email")}</span>}
        </div>

        <div className="flex items-center mb-4 border border-gray-200 p-3 rounded-lg bg-gray-50">
          <input id="generatePassword" name="generatePassword" type="checkbox" checked={isGenerating} onChange={handleChange} className="w-4 h-4 text-secondary-400 rounded focus:ring-secondary-400 cursor-pointer" />
          <label htmlFor="generatePassword" className="ml-2 text-sm text-secondary-700 font-bold cursor-pointer">
            Gerar senha automaticamente (Recomendado)
          </label>
        </div>

        {!isGenerating && (
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="text-secondary-700 text-sm font-bold">Definir Senha Manualmente:</label>
            <div className="relative mt-1">
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="********" value={getValue("password")} onChange={handleChange} className="p-2 w-full border-2 rounded-lg bg-secondary-100 text-black focus:outline-none border-secondary-200"/>
              <button type="button" onClick={togglePassword} className="absolute right-3 top-2 cursor-pointer hover:opacity-80">
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            {getError("password") && <span className="text-[#f80303] font-bold text-xs mt-1">{getError("password")}</span>}
          </div>
        )}

        <button type="submit" disabled={isPending} className={`w-full h-10 text-white font-bold rounded-lg transition-all mt-2 ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-success-500 hover:bg-success-400 cursor-pointer"}`}>
          {isPending ? "Salvando..." : "Cadastrar Usuário"}
        </button>

        {state.message && !state.success && (
          <div className="mt-4 p-3 rounded text-center text-sm font-bold bg-red-100 text-red-600 border border-red-300">
            {state.message}
          </div>
        )}
      </form>

      {/* MODAL DE SUCESSO MELHORADO */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        title="Usuário Cadastrado!"
        // Simplificamos a mensagem para conter apenas a instrução
        message={
          state.tempPassword 
            ? "Usuário cadastrado com sucesso! Por favor, copie a senha temporária abaixo para enviá-la ao usuário."
            : "O usuário foi cadastrado com sucesso com a senha definida manualmente."
        } 
        // Passamos a senha gerada na prop 'password'
        password={state.tempPassword}
        onClose={handleCloseModal} 
      />
    </div>
  );
}