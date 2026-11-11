import { type FC } from "react"
import { type AccountOptionDto } from "../../services/api"

export interface MobileAccountModalProps {
  email: string
  accounts: AccountOptionDto[]
  selectedType: string
  setSelectedType: (type: string) => void
  submitting: boolean
  modalError: string | null
  onConfirm: () => void
  onClose: () => void
}

export const MobileAccountModal: FC<MobileAccountModalProps> = ({
  email,
  accounts,
  selectedType,
  setSelectedType,
  submitting,
  modalError,
  onConfirm,
  onClose,
}) => {
  const accountCards = accounts.map((acc) => {
    const isVestibulando =
      acc.tipoPreparacao === "VESTIBULANDO" || acc.tipoPreparacao === "ENEM"
    const isUniversitario = acc.tipoPreparacao === "UNIVERSITARIO"

    return {
      id: acc.tipoPreparacao,
      title: isVestibulando
        ? "Vestibulando"
        : isUniversitario
          ? "Universitário"
          : acc.tipoPreparacao,
      description: isVestibulando
        ? "Preparação para o ENEM · Medicina"
        : isUniversitario
          ? "Graduação · Ensino Superior"
          : `Perfil ${acc.tipoPreparacao}`,
      isVestibulando,
      isUniversitario,
    }
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17152E]/55 animate-in fade-in duration-200 transition-opacity"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose()
        }
      }}
    >
      <section
        className="w-full max-w-[345px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col gap-4 border border-[#E2DFF1] relative animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-account-title"
      >
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E6FF] text-[#4F3CF0] text-[11px] font-bold tracking-wide w-fit">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Passo de segurança</span>
        </div>

        {/* Header Texts */}
        <div className="space-y-1.5">
          <h2
            id="mobile-account-title"
            className="text-[#17152E] font-['Bricolage_Grotesque'] text-[22px] font-bold leading-tight"
          >
            Com qual conta você quer entrar?
          </h2>
          <p className="text-[#5F5B7D] text-xs leading-relaxed">
            Encontramos mais de um perfil vinculado a{" "}
            <strong className="text-[#17152E] font-semibold">
              {email || "sua conta"}
            </strong>
            . Escolha como quer navegar hoje:
          </p>
        </div>

        {/* Error Alert */}
        {modalError && (
          <div
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
            role="alert"
          >
            <svg
              className="w-4 h-4 shrink-0 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1 leading-snug">{modalError}</span>
          </div>
        )}

        {/* Account Cards List */}
        <div className="flex flex-col gap-2.5">
          {accountCards.map(
            ({ id, title, description, isVestibulando, isUniversitario }) => {
              const isSelected = selectedType === id

              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setSelectedType(id)}
                  disabled={submitting}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#4F3CF0] bg-[#F2EFFE] shadow-xs"
                      : "border border-[#E2DFF1] bg-white hover:border-[#8C88AA] hover:bg-[#F7F6FC]/60"
                  }`}
                >
                  {/* Account Icon Box */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#4F3CF0] text-white"
                        : "bg-[#F7F6FC] text-[#4F3CF0]"
                    }`}
                  >
                    {isVestibulando ? (
                      /* Graduation Cap Icon */
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    ) : isUniversitario ? (
                      /* University / College Icon */
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3z" />
                      </svg>
                    ) : (
                      /* Generic Account Icon */
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="7" r="4" />
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      </svg>
                    )}
                  </div>

                  {/* Texts */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#17152E] text-sm leading-snug">
                      {title}
                    </div>
                    <div className="text-[11px] text-[#5F5B7D] truncate mt-0.5 leading-tight">
                      {description}
                    </div>
                  </div>

                  {/* Radio / Check Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#4F3CF0] border-2 border-[#4F3CF0] text-white"
                        : "border-2 border-[#D1CDED] bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            },
          )}
        </div>

        {/* Security / Token Note */}
        <div className="bg-[#F7F6FC] border border-[#E2DFF1] rounded-xl p-3 text-[11px] text-[#5F5B7D] leading-relaxed flex items-start gap-2.5">
          <svg
            className="w-4 h-4 text-[#4F3CF0] shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>
            Por segurança, faça sua escolha em alguns minutos. Se o tempo
            acabar, é só entrar de novo.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !selectedType}
            className="w-full h-12 rounded-full bg-[#4F3CF0] hover:bg-[#3F2DD5] text-white font-bold text-sm tracking-wide shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              "Entrar com esta conta"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full h-11 rounded-full border border-[#8C88AA] text-[#17152E] hover:bg-gray-100 font-bold text-sm transition disabled:opacity-50 cursor-pointer"
          >
            Voltar ao login
          </button>
        </div>
      </section>
    </div>
  )
}

export default MobileAccountModal
