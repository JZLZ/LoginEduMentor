// src/components/ui/SuccessModal.tsx
"use client";

import { useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FiCopy, FiCheck } from "react-icons/fi";
import { SuccessModalProps } from "@/src/types";

// Atualizamos a interface para aceitar a senha
export function SuccessModal({
  isOpen,
  title = "Parabéns!",
  message,
  password, // Nova prop opcional para a senha
  onClose,
}: SuccessModalProps & { password?: string | null }) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Função para copiar a senha
  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        setIsCopied(true);
        // Reseta o estado do ícone após 2 segundos
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-4 transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de Sucesso */}
        <div className="flex items-center justify-center mb-4">
          <IoMdCheckmarkCircle size={50} color="#27CD27" />
        </div>

        {/* Título e Mensagem de Instrução */}
        <h2 className="text-2xl text-black font-nunito font-bold mb-2">{title}</h2>
        <p className="text-lg text-gray-700 font-nunito mb-6">{message}</p>

        {/* ÁREA DA SENHA DESTACADA (Condicional) */}
        {password && (
          <div className="w-full bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between gap-3">
            <span className="font-mono text-lg text-secondary-700 break-all select-all">
              {password}
            </span>
            <button
              onClick={copyPassword}
              className="flex-shrink-0 p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              title="Copiar senha"
            >
              {isCopied ? (
                <FiCheck size={20} color="#27CD27" />
              ) : (
                <FiCopy size={20} className="text-gray-500" />
              )}
            </button>
          </div>
        )}

        {/* Botão para Fechar o Modal */}
        <button
          onClick={onClose}
          className="w-32 h-10 text-white font-bold rounded-lg transition-all bg-secondary-400 hover:bg-secondary-500 cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}