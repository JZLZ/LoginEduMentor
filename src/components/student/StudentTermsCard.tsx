"use client";

import { useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiFileText,
  FiMail,
} from "react-icons/fi";
import { termosService } from "@/src/services/termosService";

export function StudentTermsCard() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleDownload = async (preview: boolean) => {
    setLoadingAction(preview ? "view" : "download");
    setFeedback(null);

    try {
      await termosService.baixarPdf(preview);
      if (!preview) {
        setFeedback({
          type: "success",
          message: "Download do PDF iniciado com sucesso!",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Falha ao processar o termo em PDF.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSendEmail = async () => {
    setLoadingAction("email");
    setFeedback(null);

    try {
      const result = await termosService.reenviarPorEmail();
      setFeedback({
        type: "success",
        message:
          result.message ||
          "Termo de adesão enviado para o seu e-mail com sucesso!",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Falha ao enviar o termo por e-mail.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs"
      data-cy="student-terms-card"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9E6FF] text-[#4F3CF0]">
          <FiFileText size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#17152E]">
            Termo de Adesão e Uso
          </h2>
          <p className="text-xs font-semibold text-[#5F5B7D]">
            Documento aceito no momento da sua matrícula
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
        Você pode visualizar o documento assinado digitalmente, baixar uma cópia
        em formato PDF ou solicitar um reenvio para seu e-mail a qualquer momento.
      </p>

      {/* Ações */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleDownload(true)}
          disabled={loadingAction !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#4F3CF0] text-[#4F3CF0] font-bold text-sm hover:bg-[#E9E6FF] transition focus-visible:outline-2 focus-visible:outline-[#4F3CF0] disabled:opacity-50 disabled:cursor-not-allowed"
          data-cy="terms-view-btn"
        >
          <FiEye size={18} />
          {loadingAction === "view" ? "Abrindo..." : "Visualizar Termo"}
        </button>

        <button
          type="button"
          onClick={() => handleDownload(false)}
          disabled={loadingAction !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F3CF0] text-white font-bold text-sm hover:bg-[#3F2DD5] transition focus-visible:outline-2 focus-visible:outline-[#4F3CF0] disabled:opacity-50 disabled:cursor-not-allowed"
          data-cy="terms-download-btn"
        >
          <FiDownload size={18} />
          {loadingAction === "download" ? "Baixando..." : "Baixar PDF"}
        </button>

        <button
          type="button"
          onClick={handleSendEmail}
          disabled={loadingAction !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition focus-visible:outline-2 focus-visible:outline-[#4F3CF0] disabled:opacity-50 disabled:cursor-not-allowed"
          data-cy="terms-email-btn"
        >
          <FiMail size={18} />
          {loadingAction === "email" ? "Enviando..." : "Reenviar por E-mail"}
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mt-4 p-3 rounded-xl flex items-center gap-2.5 text-sm font-semibold ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
          data-cy="terms-feedback"
        >
          {feedback.type === "success" ? (
            <FiCheckCircle size={18} className="shrink-0 text-green-600" />
          ) : (
            <FiAlertCircle size={18} className="shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}

