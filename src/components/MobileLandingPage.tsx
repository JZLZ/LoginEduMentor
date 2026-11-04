import MobileHeader from "./mobile/MobileHeader"
import MobileHero from "./mobile/MobileHero"
import MobileRibbon from "./mobile/MobileRibbon"
import MobileProblema from "./mobile/MobileProblema"
import MobileComoFunciona from "./mobile/MobileComoFunciona"
import MobileRecursos from "./mobile/MobileRecursos"
import MobileMentorina from "./mobile/MobileMentorina"
import MobileAparelhos from "./mobile/MobileAparelhos"
import MobileFaq from "./mobile/MobileFaq"
import MobileCta from "./mobile/MobileCta"
import MobileFooter from "./mobile/MobileFooter"

interface MobileLandingPageProps {
  onNavigate: (screen: "login" | "signup" | "course") => void
  isLoggedIn?: boolean
  onLogout?: () => void
  activeFaq: number | null
  setActiveFaq: (idx: number | null) => void
  chatMessages: Array<{ sender: "user" | "mentorina"; text: string }>
  chatInput: string
  setChatInput: (text: string) => void
  isTyping: boolean
  handleSendChat: (customText?: string) => void
  scrollToMentorina: (e?: React.MouseEvent) => void
  setShowTermsModal: (show: boolean) => void
}

export default function MobileLandingPage({
  onNavigate,
  isLoggedIn,
  onLogout,
  activeFaq,
  setActiveFaq,
  chatMessages,
  chatInput,
  setChatInput,
  isTyping,
  handleSendChat,
  scrollToMentorina,
  setShowTermsModal,
}: MobileLandingPageProps) {
  return (
    <div className="w-full min-h-screen bg-[#F7F6FC] text-[#17152E] font-sans antialiased overflow-x-clip selection:bg-[#C6F432] selection:text-[#17152E]">
      <MobileHeader
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        scrollToMentorina={scrollToMentorina}
      />
      <MobileHero onNavigate={onNavigate} />
      <MobileRibbon />
      <MobileProblema />
      <MobileComoFunciona />
      <MobileRecursos />
      <MobileMentorina
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isTyping={isTyping}
        handleSendChat={handleSendChat}
      />
      <MobileAparelhos />
      <MobileFaq activeFaq={activeFaq} setActiveFaq={setActiveFaq} />
      <MobileCta onNavigate={onNavigate} />
      <MobileFooter setShowTermsModal={setShowTermsModal} />
    </div>
  )
}
