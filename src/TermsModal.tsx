import { useEffect } from "react"

function FiFileText({
  size = 22,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function FiShield({
  size = 20,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function FiX({
  size = 20,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  isMinor?: boolean
  onAccept?: () => void
}

export function TermsModal({
  isOpen,
  onClose,
  isMinor = false,
  onAccept,
}: TermsModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        data-cy="terms-modal"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-[#E2DFF1] p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9E6FF] text-[#4F3CF0]">
              <FiFileText size={22} />
            </div>
            <div>
              <h2
                id="terms-modal-title"
                className="text-xl font-extrabold text-[#17152E] sm:text-2xl"
              >
                {isMinor
                  ? "Termo com Validação Legal e Tutelar (Menores de Idade)"
                  : "Termos de Uso e Política de Privacidade — EduMentor AI"}
              </h2>
              <p className="text-xs font-semibold text-[#5F5B7D]">
                Versão 2026.1 • Plataforma EduMentor AI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#5F5B7D] transition hover:bg-gray-100 hover:text-[#17152E] focus-visible:outline-2 focus-visible:outline-[#4F3CF0] cursor-pointer"
            aria-label="Fechar termos de uso"
            data-cy="terms-modal-close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed text-[#17152E]">
          {isMinor ? (
            <>
              {/* Destaque LGPD Art. 14 para Menores */}
              <div
                className="flex items-start gap-3 rounded-xl border border-[#4F3CF0]/30 bg-[#E9E6FF] p-4 text-[#17152E]"
                data-cy="terms-minor-notice"
              >
                <div className="mt-0.5 text-[#4F3CF0] shrink-0">
                  <FiShield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#4F3CF0]">
                    Aviso aos Pais e Responsáveis Legais (Artigo 14 da LGPD)
                  </h3>
                  <p className="mt-1 text-xs text-[#5F5B7D] leading-normal">
                    Em conformidade com o Art. 14 da Lei Geral de Proteção de
                    Dados (Lei nº 13.709/2018), o tratamento de dados pessoais
                    de crianças e adolescentes é realizado exclusivamente em seu
                    melhor interesse, com o consentimento específico e em
                    destaque dado por ao menos um dos pais ou pelo responsável
                    legal.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  1. Representação Civil e Consentimento Parental
                </h4>
                <p>
                  O presente termo formaliza a anuência expressa do responsável
                  legal para a matrícula, acesso e utilização da plataforma
                  EduMentor AI pelo estudante menor de 18 anos. O responsável
                  declara que os dados cadastrais fornecidos (incluindo nome e
                  CPF do responsável) são verdadeiros e que autoriza o estudante
                  a usufruir dos serviços educacionais oferecidos.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  2. Finalidade Educacional e Tratamento de Dados
                </h4>
                <p>
                  Os dados do estudante menor serão coletados e tratados
                  estritamente para fins de aprendizado individual, geração de
                  trilhas adaptativas, simulados e diagnósticos pedagógicos de
                  preparação para o ENEM e vestibulares. Nenhuma informação será
                  comercializada ou compartilhada com terceiros para finalidades
                  publicitárias.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  3. Ambiente Seguro e Tutora Inteligente (Mentorina)
                </h4>
                <p>
                  A interação do estudante na plataforma ocorre unicamente com
                  os conteúdos instrucionais e com a tutora virtual de
                  inteligência artificial (Mentorina). Não há salas de bate-papo
                  abertas, fóruns não moderados ou canais de comunicação direta
                  peer-to-peer (P2P) entre usuários, assegurando um ambiente
                  digital protegido contra assédio ou exposição a contatos
                  externos.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  4. Direitos do Responsável Legal
                </h4>
                <p>
                  O responsável legal poderá, a qualquer tempo, solicitar acesso
                  aos dados do menor, retificação de informações, cópia do termo
                  de adesão assinado ou revogação do consentimento por meio dos
                  canais oficiais de suporte da plataforma.
                </p>
              </section>
            </>
          ) : (
            <>
              {/* Termo Padrão Maior de 18 anos */}
              <div
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-[#17152E]"
                data-cy="terms-standard-notice"
              >
                <div className="mt-0.5 text-[#4F3CF0] shrink-0">
                  <FiShield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#17152E]">
                    Condições Gerais de Adesão
                  </h3>
                  <p className="mt-1 text-xs text-[#5F5B7D] leading-normal">
                    Ao prosseguir com o cadastro, você concorda com as condições
                    de uso da plataforma EduMentor AI, com os padrões éticos de
                    aprendizado e com o tratamento dos seus dados nos termos da
                    LGPD.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  1. Objeto e Adesão aos Serviços
                </h4>
                <p>
                  A EduMentor AI disponibiliza uma plataforma digital voltada à
                  preparação para o Exame Nacional do Ensino Médio (ENEM) e
                  exames vestibulares, composta por trilhas de aprendizagem,
                  simulados com questões oficiais e suporte da tutora
                  inteligente 24 horas por dia.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  2. Uso Ético da Inteligência Artificial (Mentorina)
                </h4>
                <p>
                  A tutora inteligente (Mentorina) foi projetada para estimular
                  o raciocínio crítico e orientar a resolução de problemas
                  educacionais. O usuário compromete-se a utilizar as
                  ferramentas de IA de maneira ética, sem empregar métodos
                  automatizados para burlar avaliações ou violar direitos
                  autorais de materiais didáticos.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  3. Inexistência de Comunicação Peer-to-Peer
                </h4>
                <p>
                  Para preservar a privacidade e o foco no aprendizado
                  individualizado, a plataforma não possui canais de mensagens
                  abertas entre estudantes (comunicação peer-to-peer). Todas as
                  interações ocorrem entre o aluno e os sistemas automatizados
                  de tutoria e avaliação.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-base text-[#17152E]">
                  4. Proteção de Dados Pessoais (LGPD)
                </h4>
                <p>
                  Os dados pessoais coletados no cadastro são tratados em
                  estrita conformidade com a Lei Geral de Proteção de Dados
                  Pessoais (Lei nº 13.709/2018), com finalidade exclusiva de
                  prestação dos serviços contratados, segurança da conta e
                  comunicação acadêmica.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-[#E2DFF1] p-4 sm:px-6 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#8C88AA] font-bold text-[#17152E] hover:bg-gray-100 transition focus-visible:outline-2 focus-visible:outline-[#4F3CF0] cursor-pointer"
            data-cy="terms-modal-dismiss"
          >
            Fechar
          </button>
          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept()
                onClose()
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4F3CF0] font-bold text-white hover:bg-[#3F2DD5] transition focus-visible:outline-2 focus-visible:outline-[#4F3CF0] cursor-pointer"
              data-cy="terms-modal-accept"
            >
              Entendi e Aceito
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TermsModal
