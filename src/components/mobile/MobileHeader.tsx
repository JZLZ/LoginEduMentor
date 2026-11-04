import { useState, useEffect } from "react"
import { tokenStorage } from "../../services/api"

interface MobileHeaderProps {
  onNavigate: (screen: "login" | "signup" | "course") => void
  isLoggedIn?: boolean
  onLogout?: () => void
  scrollToMentorina?: (e?: React.MouseEvent) => void
}

export default function MobileHeader({
  onNavigate,
  isLoggedIn: propIsLoggedIn,
  onLogout,
  scrollToMentorina,
}: MobileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Resolve whether user is logged in (from prop, URL param ?logged_in=true, or tokenStorage)
  const [localLoggedIn, setLocalLoggedIn] = useState<boolean>(() => {
    if (typeof propIsLoggedIn === "boolean") return propIsLoggedIn
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("logged_in") === "true") return true
      if (params.get("logged_in") === "false") return false
      const user = tokenStorage.getUser()
      return !!(user && (!user.exp || Date.now() < user.exp * 1000))
    }
    return false
  })

  useEffect(() => {
    if (typeof propIsLoggedIn === "boolean") {
      setLocalLoggedIn(propIsLoggedIn)
      return
    }
    const syncAuth = () => {
      const params = new URLSearchParams(window.location.search)
      if (params.get("logged_in") === "true") {
        setLocalLoggedIn(true)
        return
      }
      if (params.get("logged_in") === "false") {
        setLocalLoggedIn(false)
        return
      }
      const user = tokenStorage.getUser()
      setLocalLoggedIn(!!(user && (!user.exp || Date.now() < user.exp * 1000)))
    }
    syncAuth()
    window.addEventListener("storage", syncAuth)
    return () => window.removeEventListener("storage", syncAuth)
  }, [propIsLoggedIn])

  // Prevent background scroll when the open menu drawer/modal is active
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const handleLinkClick = (hash: string) => {
    setMenuOpen(false)
    if (hash === "#mentorina" && scrollToMentorina) {
      scrollToMentorina()
    } else {
      const el = document.querySelector(hash)
      if (el) {
        const headerOffset = 60
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
      window.history.pushState(null, "", hash)
    }
  }

  const handleNavigate = (screen: "login" | "signup" | "course") => {
    setMenuOpen(false)
    onNavigate(screen)
  }

  const handleLogout = () => {
    setMenuOpen(false)
    tokenStorage.clear()
    try {
      localStorage.removeItem("sherlock_assessment_session")
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (url.searchParams.has("logged_in")) {
        url.searchParams.delete("logged_in")
        window.history.replaceState(
          {},
          "",
          url.pathname + (url.search ? url.search : "") + url.hash,
        )
      }
    }
    setLocalLoggedIn(false)
    if (onLogout) {
      onLogout()
    }
  }

  const navLinks = [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Recursos", href: "#recursos" },
    { label: "Mentorina", href: "#mentorina" },
    { label: "Dúvidas", href: "#duvidas" },
  ]

  return (
    <>
      {/* =========================================================================
          CLOSED STATE HEADER (Height: 60px com transparência de 50% e backdrop-blur)
          - Transparência de 50%: bg-[#17152E]/50 (ajuste a porcentagem após a barra se desejar)
          - Efeito de desfoque/vidro: backdrop-blur-md
          ========================================================================= */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 w-full select-none overflow-hidden h-[60px] border-b transition-all duration-700 ease-in-out ${
          isScrolled
            ? "bg-[#17152E]/95 backdrop-blur-md border-white/10 shadow-md shadow-black/20"
            : "bg-[#17152E]/0 backdrop-blur-none border-transparent shadow-none"
        }`}
      >
        {/* Subtle grid pattern com transição suave e gradual de opacidade */}
        <div
          className={`hero-grid-pattern absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out ${
            isScrolled ? "opacity-40" : "opacity-0"
          }`}
        />

        <div className="relative z-10 w-full h-[60px] px-4 sm:px-6 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo EduMentor AI */}
          <a
            href="#hero"
            onClick={() => {
              setMenuOpen(false)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex items-center gap-2 group cursor-pointer transition-transform duration-300 ease-out active:scale-95 shrink-0"
            aria-label="EduMentor AI - Início"
          >
            <svg
              width="186"
              height="30"
              viewBox="0 0 224 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[28px] sm:h-[30px] w-auto shrink-0 transition-all duration-300 ease-out group-hover:brightness-110"
            >
              <path
                d="M10.1999 2.40039H25.7999C30.1199 2.40039 33.5999 5.88039 33.5999 10.2004V22.2004C33.5999 26.5204 30.1199 30.0004 25.7999 30.0004H14.3999L7.7999 34.8004C6.8999 35.4604 5.6999 34.8004 5.6999 33.7204V29.8204C3.7799 28.5004 2.3999 25.5004 2.3999 22.2004V10.2004C2.3999 5.88039 5.8799 2.40039 10.1999 2.40039Z"
                fill="#4F3CF0"
              />
              <path
                d="M9 24.0004H14.4V19.2004H19.8V14.4004H27"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="white"
              />
              <path
                d="M28.2 5.40039C28.56 7.38039 29.22 8.04039 31.2 8.40039C29.22 8.76039 28.56 9.42039 28.2 11.4004C27.84 9.42039 27.18 8.76039 25.2 8.40039C27.18 8.04039 27.84 7.38039 28.2 5.40039Z"
                fill="#C6F432"
              />
              <path
                d="M26.9999 16.4998C28.1597 16.4998 29.0999 15.5596 29.0999 14.3998C29.0999 13.24 28.1597 12.2998 26.9999 12.2998C25.8401 12.2998 24.8999 13.24 24.8999 14.3998C24.8999 15.5596 25.8401 16.4998 26.9999 16.4998Z"
                fill="#C6F432"
              />
              <path
                d="M48.4848 26.5V9.3928H52.6839V26.5H48.4848ZM51.5434 26.5V23.1045H61.8596V26.5H51.5434ZM51.5434 19.3979V16.3653H60.5636V19.3979H51.5434ZM51.5434 12.7624V9.3928H61.8077V12.7624H51.5434ZM68.5066 26.8629C67.3834 26.8629 66.3985 26.5778 65.5518 26.0075C64.705 25.4373 64.0398 24.6165 63.5559 23.5451C63.0721 22.4565 62.8302 21.1432 62.8302 19.6053C62.8302 18.1883 63.0375 16.9528 63.4522 15.8987C63.867 14.8274 64.4804 13.9979 65.2926 13.4104C66.1047 12.8056 67.107 12.5032 68.2993 12.5032C69.146 12.5032 69.8718 12.6587 70.4766 12.9698C71.0814 13.2808 71.5825 13.756 71.9799 14.3954C72.3774 15.0347 72.6884 15.8382 72.913 16.8059H73.4833C73.3623 16.2184 73.25 15.6654 73.1463 15.147C73.0599 14.6114 72.9822 14.1102 72.913 13.6437C72.8612 13.1598 72.8353 12.7365 72.8353 12.3736V7.91536H77.0343V20.0718V26.5H73.587L73.5351 22.4306H73.0167C72.8266 23.4674 72.5329 24.3141 72.1354 24.9707C71.738 25.6101 71.2282 26.0853 70.6062 26.3963C70.0014 26.7074 69.3015 26.8629 68.5066 26.8629ZM69.9841 23.4933C70.4852 23.4933 70.9172 23.3896 71.2801 23.1822C71.643 22.9576 71.9367 22.6725 72.1614 22.3269C72.4033 21.964 72.5761 21.5752 72.6798 21.1605C72.7834 20.7285 72.8353 20.3051 72.8353 19.8904V19.3979C72.8353 19.0523 72.7921 18.7067 72.7057 18.3611C72.6193 18.0155 72.4897 17.6958 72.3169 17.4021C72.1614 17.091 71.9626 16.8232 71.7207 16.5986C71.4788 16.3566 71.2023 16.1752 70.8913 16.0542C70.5975 15.916 70.2692 15.8469 69.9063 15.8469C69.3361 15.8469 68.8522 16.011 68.4548 16.3394C68.0574 16.6504 67.7463 17.091 67.5217 17.6613C67.3143 18.2315 67.2106 18.8968 67.2106 19.6571C67.2106 20.4174 67.323 21.0914 67.5476 21.6789C67.7722 22.2491 68.0919 22.6984 68.5066 23.0267C68.9386 23.3378 69.4311 23.4933 69.9841 23.4933ZM84.1797 26.8629C82.5727 26.8629 81.3631 26.3186 80.5509 25.2299C79.756 24.1413 79.3586 22.4824 79.3586 20.2533V12.8142H83.5576V19.7608C83.5576 21.0222 83.7391 21.9467 84.102 22.5342C84.4648 23.1218 85.0178 23.4155 85.7608 23.4155C86.2101 23.4155 86.5989 23.3032 86.9272 23.0786C87.2728 22.8539 87.558 22.5342 87.7826 22.1195C88.0245 21.6875 88.1973 21.195 88.301 20.6421C88.422 20.0718 88.4824 19.4411 88.4824 18.7499V12.8142H92.6556V20.8754V26.5H89.3119L89.2341 22.1195H88.7676C88.5429 23.2254 88.2319 24.1326 87.8344 24.8411C87.4543 25.5323 86.9618 26.0421 86.357 26.3704C85.7695 26.6987 85.0437 26.8629 84.1797 26.8629ZM95.3525 26.5V9.3928H101.599L105.928 21.6789H106.057L110.256 9.3928H116.218V26.5H112.278L112.486 13.6437H112.226L107.431 26.5H103.984L99.2923 13.6437H99.0331L99.2405 26.5H95.3525ZM125.409 26.8629C124.233 26.8629 123.197 26.7074 122.298 26.3963C121.417 26.0853 120.665 25.636 120.043 25.0485C119.421 24.4437 118.946 23.7093 118.617 22.8453C118.306 21.9813 118.151 21.005 118.151 19.9163C118.151 18.845 118.306 17.8514 118.617 16.9355C118.929 16.0197 119.378 15.2334 119.965 14.5768C120.57 13.9029 121.305 13.3845 122.169 13.0216C123.033 12.6414 124.017 12.4514 125.123 12.4514C126.229 12.4514 127.197 12.6328 128.026 12.9957C128.873 13.3586 129.564 13.8942 130.1 14.6027C130.653 15.2939 131.042 16.132 131.266 17.117C131.508 18.1019 131.577 19.2165 131.474 20.4606L120.898 20.5643V18.3611L128.985 18.2834L127.638 19.3461C127.759 18.4821 127.715 17.7822 127.508 17.2466C127.301 16.6936 126.981 16.2962 126.549 16.0542C126.134 15.795 125.668 15.6654 125.149 15.6654C124.545 15.6654 124.017 15.8296 123.568 16.1579C123.119 16.4862 122.773 16.9614 122.531 17.5835C122.289 18.1883 122.169 18.9314 122.169 19.8126C122.169 21.2296 122.462 22.2578 123.05 22.8971C123.655 23.5365 124.432 23.8562 125.383 23.8562C125.832 23.8562 126.212 23.7957 126.523 23.6747C126.834 23.5538 127.085 23.3982 127.275 23.2082C127.465 23.0008 127.612 22.7762 127.715 22.5342C127.819 22.275 127.905 22.0245 127.975 21.7826L131.629 22.4824C131.526 23.1045 131.327 23.6834 131.033 24.219C130.757 24.7547 130.368 25.2213 129.867 25.6187C129.366 26.0162 128.744 26.3186 128.001 26.5259C127.275 26.7506 126.411 26.8629 125.409 26.8629ZM133.42 26.5V18.3352V12.8142H136.789L136.841 17.0651H137.308C137.515 16.0283 137.818 15.173 138.215 14.499C138.63 13.8078 139.157 13.2981 139.796 12.9698C140.436 12.6242 141.196 12.4514 142.077 12.4514C143.667 12.4514 144.868 13.0043 145.68 14.1102C146.509 15.1989 146.924 16.9355 146.924 19.3202V26.5H142.725V19.8126C142.725 18.4648 142.535 17.4798 142.155 16.8578C141.775 16.2357 141.196 15.9246 140.418 15.9246C139.796 15.9246 139.269 16.1234 138.837 16.5208C138.422 16.901 138.111 17.4366 137.904 18.1278C137.697 18.8018 137.593 19.588 137.593 20.4866V26.5H133.42ZM154.542 26.837C152.935 26.837 151.751 26.4136 150.991 25.5669C150.231 24.7029 149.851 23.3464 149.851 21.4974V16.0802H147.959L148.01 12.9179H149.229C149.868 12.9006 150.335 12.7797 150.628 12.555C150.939 12.3304 151.129 11.9502 151.199 11.4146L151.51 9.75568H153.868V12.8142H157.16V16.2098H153.868V21.2901C153.868 21.8776 154.015 22.3096 154.309 22.5861C154.603 22.8626 155.035 23.0008 155.605 23.0008C155.916 23.0008 156.218 22.9662 156.512 22.8971C156.806 22.828 157.048 22.733 157.238 22.612V26.4482C156.685 26.621 156.184 26.7246 155.735 26.7592C155.285 26.811 154.888 26.837 154.542 26.837ZM165.285 26.8629C163.903 26.8629 162.684 26.595 161.63 26.0594C160.576 25.5237 159.747 24.7202 159.142 23.6488C158.537 22.5774 158.235 21.2382 158.235 19.6312C158.235 18.0242 158.537 16.6936 159.142 15.6395C159.747 14.5682 160.576 13.7733 161.63 13.2549C162.702 12.7192 163.929 12.4514 165.311 12.4514C166.693 12.4514 167.912 12.7192 168.966 13.2549C170.037 13.7906 170.866 14.5941 171.454 15.6654C172.059 16.7195 172.361 18.0501 172.361 19.6571C172.361 21.2987 172.05 22.6552 171.428 23.7266C170.823 24.7979 169.985 25.5928 168.914 26.1112C167.842 26.6123 166.633 26.8629 165.285 26.8629ZM165.415 23.8302C166.019 23.8302 166.521 23.6834 166.918 23.3896C167.333 23.0958 167.644 22.6552 167.851 22.0677C168.058 21.4802 168.162 20.763 168.162 19.9163C168.162 19.0005 168.05 18.2315 167.825 17.6094C167.601 16.9701 167.272 16.4862 166.84 16.1579C166.408 15.8123 165.855 15.6395 165.181 15.6395C164.594 15.6395 164.093 15.7864 163.678 16.0802C163.263 16.3739 162.952 16.8146 162.745 17.4021C162.555 17.9896 162.46 18.7154 162.46 19.5794C162.46 20.979 162.71 22.0418 163.211 22.7675C163.73 23.476 164.464 23.8302 165.415 23.8302ZM174.162 26.5V19.9941V12.8142H177.583L177.661 17.5576H178.128C178.249 16.3307 178.473 15.3458 178.801 14.6027C179.147 13.8597 179.614 13.324 180.201 12.9957C180.806 12.6674 181.558 12.5032 182.456 12.5032C182.612 12.5032 182.785 12.5118 182.975 12.5291C183.182 12.5464 183.407 12.5896 183.649 12.6587L183.467 17.117C183.173 16.9787 182.862 16.8837 182.534 16.8318C182.206 16.78 181.921 16.7541 181.679 16.7541C181.022 16.7541 180.452 16.8923 179.968 17.1688C179.501 17.428 179.13 17.8341 178.853 18.387C178.594 18.9227 178.421 19.5966 178.335 20.4088V26.5H174.162Z"
                fill="white"
              />
              <rect
                x="190.8"
                y="9.5"
                width="29"
                height="17"
                rx="8.5"
                fill="#C6F432"
              />
              <path
                d="M198.971 22.5L201.713 14.4216H204.614L207.356 22.5H205.202L203.268 15.9638H203.072L201.126 22.5H198.971ZM200.599 20.9822V19.6603H206.022V20.9822H200.599ZM208.383 22.5V14.4216H210.39V22.5H208.383Z"
                fill="#17152E"
              />
            </svg>
          </a>

          {/* Right Action Area */}
          <div className="flex items-center gap-[6px] sm:gap-[8.5px] shrink-0">
            {/* "Minha trilha" Button (Shown when logged in, matching exact Figma 105x35 rx 17.5) */}
            {localLoggedIn && (
              <button
                type="button"
                onClick={() => handleNavigate("course")}
                className="px-3 sm:w-[105px] h-[34px] sm:h-[35px] rounded-full bg-[#C6F432] hover:bg-[#b8e42e] text-[#17152E] font-bold text-[12px] sm:text-[13px] flex items-center justify-center shadow-[0_2px_8px_rgba(198,244,50,0.25)] active:scale-95 transition-all cursor-pointer select-none shrink-0"
              >
                Minha trilha
              </button>
            )}

            {/* Hamburger Button (39x35 pill with 3 horizontal white bars matching Figma) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="w-[39px] h-[34px] sm:h-[35px] rounded-[11.5px] border border-white/30 flex flex-col items-center justify-center gap-[4px] text-white active:scale-90 transition-transform cursor-pointer shrink-0"
              aria-label="Abrir menu"
            >
              <span className="w-[18px] h-[2px] bg-white rounded-full block" />
              <span className="w-[18px] h-[2px] bg-white rounded-full block" />
              <span className="w-[18px] h-[2px] bg-white rounded-full block" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          OPEN STATE MENU (Full-screen overlay matching exact 393x852 Figma SVG)
          ========================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 w-full h-[100dvh] bg-[#17152E] flex flex-col justify-between overflow-y-auto select-none animate-in fade-in duration-200">
          {/* Exact Background Radial Gradient from Figma */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 393 852"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="393" height="852" fill="#17152E" />
              <rect
                width="393"
                height="852"
                fill="url(#paint0_radial_2448_8072)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_2448_8072"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(65.5 547.714) scale(218.333 608.571)"
                >
                  <stop stopColor="#4F3CF0" stopOpacity="0.75" />
                  <stop offset="1" stopColor="#4F3CF0" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 w-full max-w-lg mx-auto min-h-full flex flex-col justify-between px-5 sm:px-6 pt-[18px] pb-10">
            {/* Top Bar: Logo & Close Button */}
            <div className="w-full flex items-center justify-between shrink-0">
              {/* Logo */}
              <a
                href="#hero"
                onClick={() => {
                  setMenuOpen(false)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="flex items-center gap-2 group cursor-pointer transition-transform duration-300 ease-out active:scale-95 shrink-0"
                aria-label="EduMentor AI - Início"
              >
                <svg
                  width="186"
                  height="30"
                  viewBox="0 0 224 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[28px] sm:h-[30px] w-auto shrink-0 transition-all duration-300 ease-out group-hover:brightness-110"
                >
                  <path
                    d="M10.1999 2.40039H25.7999C30.1199 2.40039 33.5999 5.88039 33.5999 10.2004V22.2004C33.5999 26.5204 30.1199 30.0004 25.7999 30.0004H14.3999L7.7999 34.8004C6.8999 35.4604 5.6999 34.8004 5.6999 33.7204V29.8204C3.7799 28.5004 2.3999 25.5004 2.3999 22.2004V10.2004C2.3999 5.88039 5.8799 2.40039 10.1999 2.40039Z"
                    fill="#4F3CF0"
                  />
                  <path
                    d="M9 24.0004H14.4V19.2004H19.8V14.4004H27"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="white"
                  />
                  <path
                    d="M28.2 5.40039C28.56 7.38039 29.22 8.04039 31.2 8.40039C29.22 8.76039 28.56 9.42039 28.2 11.4004C27.84 9.42039 27.18 8.76039 25.2 8.40039C27.18 8.04039 27.84 7.38039 28.2 5.40039Z"
                    fill="#C6F432"
                  />
                  <path
                    d="M26.9999 16.4998C28.1597 16.4998 29.0999 15.5596 29.0999 14.3998C29.0999 13.24 28.1597 12.2998 26.9999 12.2998C25.8401 12.2998 24.8999 13.24 24.8999 14.3998C24.8999 15.5596 25.8401 16.4998 26.9999 16.4998Z"
                    fill="#C6F432"
                  />
                  <path
                    d="M48.4848 26.5V9.3928H52.6839V26.5H48.4848ZM51.5434 26.5V23.1045H61.8596V26.5H51.5434ZM51.5434 19.3979V16.3653H60.5636V19.3979H51.5434ZM51.5434 12.7624V9.3928H61.8077V12.7624H51.5434ZM68.5066 26.8629C67.3834 26.8629 66.3985 26.5778 65.5518 26.0075C64.705 25.4373 64.0398 24.6165 63.5559 23.5451C63.0721 22.4565 62.8302 21.1432 62.8302 19.6053C62.8302 18.1883 63.0375 16.9528 63.4522 15.8987C63.867 14.8274 64.4804 13.9979 65.2926 13.4104C66.1047 12.8056 67.107 12.5032 68.2993 12.5032C69.146 12.5032 69.8718 12.6587 70.4766 12.9698C71.0814 13.2808 71.5825 13.756 71.9799 14.3954C72.3774 15.0347 72.6884 15.8382 72.913 16.8059H73.4833C73.3623 16.2184 73.25 15.6654 73.1463 15.147C73.0599 14.6114 72.9822 14.1102 72.913 13.6437C72.8612 13.1598 72.8353 12.7365 72.8353 12.3736V7.91536H77.0343V20.0718V26.5H73.587L73.5351 22.4306H73.0167C72.8266 23.4674 72.5329 24.3141 72.1354 24.9707C71.738 25.6101 71.2282 26.0853 70.6062 26.3963C70.0014 26.7074 69.3015 26.8629 68.5066 26.8629ZM69.9841 23.4933C70.4852 23.4933 70.9172 23.3896 71.2801 23.1822C71.643 22.9576 71.9367 22.6725 72.1614 22.3269C72.4033 21.964 72.5761 21.5752 72.6798 21.1605C72.7834 20.7285 72.8353 20.3051 72.8353 19.8904V19.3979C72.8353 19.0523 72.7921 18.7067 72.7057 18.3611C72.6193 18.0155 72.4897 17.6958 72.3169 17.4021C72.1614 17.091 71.9626 16.8232 71.7207 16.5986C71.4788 16.3566 71.2023 16.1752 70.8913 16.0542C70.5975 15.916 70.2692 15.8469 69.9063 15.8469C69.3361 15.8469 68.8522 16.011 68.4548 16.3394C68.0574 16.6504 67.7463 17.091 67.5217 17.6613C67.3143 18.2315 67.2106 18.8968 67.2106 19.6571C67.2106 20.4174 67.323 21.0914 67.5476 21.6789C67.7722 22.2491 68.0919 22.6984 68.5066 23.0267C68.9386 23.3378 69.4311 23.4933 69.9841 23.4933ZM84.1797 26.8629C82.5727 26.8629 81.3631 26.3186 80.5509 25.2299C79.756 24.1413 79.3586 22.4824 79.3586 20.2533V12.8142H83.5576V19.7608C83.5576 21.0222 83.7391 21.9467 84.102 22.5342C84.4648 23.1218 85.0178 23.4155 85.7608 23.4155C86.2101 23.4155 86.5989 23.3032 86.9272 23.0786C87.2728 22.8539 87.558 22.5342 87.7826 22.1195C88.0245 21.6875 88.1973 21.195 88.301 20.6421C88.422 20.0718 88.4824 19.4411 88.4824 18.7499V12.8142H92.6556V20.8754V26.5H89.3119L89.2341 22.1195H88.7676C88.5429 23.2254 88.2319 24.1326 87.8344 24.8411C87.4543 25.5323 86.9618 26.0421 86.357 26.3704C85.7695 26.6987 85.0437 26.8629 84.1797 26.8629ZM95.3525 26.5V9.3928H101.599L105.928 21.6789H106.057L110.256 9.3928H116.218V26.5H112.278L112.486 13.6437H112.226L107.431 26.5H103.984L99.2923 13.6437H99.0331L99.2405 26.5H95.3525ZM125.409 26.8629C124.233 26.8629 123.197 26.7074 122.298 26.3963C121.417 26.0853 120.665 25.636 120.043 25.0485C119.421 24.4437 118.946 23.7093 118.617 22.8453C118.306 21.9813 118.151 21.005 118.151 19.9163C118.151 18.845 118.306 17.8514 118.617 16.9355C118.929 16.0197 119.378 15.2334 119.965 14.5768C120.57 13.9029 121.305 13.3845 122.169 13.0216C123.033 12.6414 124.017 12.4514 125.123 12.4514C126.229 12.4514 127.197 12.6328 128.026 12.9957C128.873 13.3586 129.564 13.8942 130.1 14.6027C130.653 15.2939 131.042 16.132 131.266 17.117C131.508 18.1019 131.577 19.2165 131.474 20.4606L120.898 20.5643V18.3611L128.985 18.2834L127.638 19.3461C127.759 18.4821 127.715 17.7822 127.508 17.2466C127.301 16.6936 126.981 16.2962 126.549 16.0542C126.134 15.795 125.668 15.6654 125.149 15.6654C124.545 15.6654 124.017 15.8296 123.568 16.1579C123.119 16.4862 122.773 16.9614 122.531 17.5835C122.289 18.1883 122.169 18.9314 122.169 19.8126C122.169 21.2296 122.462 22.2578 123.05 22.8971C123.655 23.5365 124.432 23.8562 125.383 23.8562C125.832 23.8562 126.212 23.7957 126.523 23.6747C126.834 23.5538 127.085 23.3982 127.275 23.2082C127.465 23.0008 127.612 22.7762 127.715 22.5342C127.819 22.275 127.905 22.0245 127.975 21.7826L131.629 22.4824C131.526 23.1045 131.327 23.6834 131.033 24.219C130.757 24.7547 130.368 25.2213 129.867 25.6187C129.366 26.0162 128.744 26.3186 128.001 26.5259C127.275 26.7506 126.411 26.8629 125.409 26.8629ZM133.42 26.5V18.3352V12.8142H136.789L136.841 17.0651H137.308C137.515 16.0283 137.818 15.173 138.215 14.499C138.63 13.8078 139.157 13.2981 139.796 12.9698C140.436 12.6242 141.196 12.4514 142.077 12.4514C143.667 12.4514 144.868 13.0043 145.68 14.1102C146.509 15.1989 146.924 16.9355 146.924 19.3202V26.5H142.725V19.8126C142.725 18.4648 142.535 17.4798 142.155 16.8578C141.775 16.2357 141.196 15.9246 140.418 15.9246C139.796 15.9246 139.269 16.1234 138.837 16.5208C138.422 16.901 138.111 17.4366 137.904 18.1278C137.697 18.8018 137.593 19.588 137.593 20.4866V26.5H133.42ZM154.542 26.837C152.935 26.837 151.751 26.4136 150.991 25.5669C150.231 24.7029 149.851 23.3464 149.851 21.4974V16.0802H147.959L148.01 12.9179H149.229C149.868 12.9006 150.335 12.7797 150.628 12.555C150.939 12.3304 151.129 11.9502 151.199 11.4146L151.51 9.75568H153.868V12.8142H157.16V16.2098H153.868V21.2901C153.868 21.8776 154.015 22.3096 154.309 22.5861C154.603 22.8626 155.035 23.0008 155.605 23.0008C155.916 23.0008 156.218 22.9662 156.512 22.8971C156.806 22.828 157.048 22.733 157.238 22.612V26.4482C156.685 26.621 156.184 26.7246 155.735 26.7592C155.285 26.811 154.888 26.837 154.542 26.837ZM165.285 26.8629C163.903 26.8629 162.684 26.595 161.63 26.0594C160.576 25.5237 159.747 24.7202 159.142 23.6488C158.537 22.5774 158.235 21.2382 158.235 19.6312C158.235 18.0242 158.537 16.6936 159.142 15.6395C159.747 14.5682 160.576 13.7733 161.63 13.2549C162.702 12.7192 163.929 12.4514 165.311 12.4514C166.693 12.4514 167.912 12.7192 168.966 13.2549C170.037 13.7906 170.866 14.5941 171.454 15.6654C172.059 16.7195 172.361 18.0501 172.361 19.6571C172.361 21.2987 172.05 22.6552 171.428 23.7266C170.823 24.7979 169.985 25.5928 168.914 26.1112C167.842 26.6123 166.633 26.8629 165.285 26.8629ZM165.415 23.8302C166.019 23.8302 166.521 23.6834 166.918 23.3896C167.333 23.0958 167.644 22.6552 167.851 22.0677C168.058 21.4802 168.162 20.763 168.162 19.9163C168.162 19.0005 168.05 18.2315 167.825 17.6094C167.601 16.9701 167.272 16.4862 166.84 16.1579C166.408 15.8123 165.855 15.6395 165.181 15.6395C164.594 15.6395 164.093 15.7864 163.678 16.0802C163.263 16.3739 162.952 16.8146 162.745 17.4021C162.555 17.9896 162.46 18.7154 162.46 19.5794C162.46 20.979 162.71 22.0418 163.211 22.7675C163.73 23.476 164.464 23.8302 165.415 23.8302ZM174.162 26.5V19.9941V12.8142H177.583L177.661 17.5576H178.128C178.249 16.3307 178.473 15.3458 178.801 14.6027C179.147 13.8597 179.614 13.324 180.201 12.9957C180.806 12.6674 181.558 12.5032 182.456 12.5032C182.612 12.5032 182.785 12.5118 182.975 12.5291C183.182 12.5464 183.407 12.5896 183.649 12.6587L183.467 17.117C183.173 16.9787 182.862 16.8837 182.534 16.8318C182.206 16.78 181.921 16.7541 181.679 16.7541C181.022 16.7541 180.452 16.8923 179.968 17.1688C179.501 17.428 179.13 17.8341 178.853 18.387C178.594 18.9227 178.421 19.5966 178.335 20.4088V26.5H174.162Z"
                    fill="white"
                  />
                  <rect
                    x="190.8"
                    y="9.5"
                    width="29"
                    height="17"
                    rx="8.5"
                    fill="#C6F432"
                  />
                  <path
                    d="M198.971 22.5L201.713 14.4216H204.614L207.356 22.5H205.202L203.268 15.9638H203.072L201.126 22.5H198.971ZM200.599 20.9822V19.6603H206.022V20.9822H200.599ZM208.383 22.5V14.4216H210.39V22.5H208.383Z"
                    fill="#17152E"
                  />
                </svg>
              </a>

              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-[39px] h-[29px] rounded-[11.5px] border border-white/30 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shrink-0"
                aria-label="Fechar menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1.08 15.36L0 14.28L6.56 7.68L0 1.08L1.08 0L7.64 6.6L14.16 0L15.24 1.08L8.68 7.68L15.24 14.28L14.16 15.36L7.64 8.8L1.08 15.36Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="w-full flex flex-col gap-[38px] pt-12 pb-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer active:opacity-75 transition-opacity"
                >
                  <span className="text-white text-[20px] font-bold tracking-tight font-display">
                    {link.label}
                  </span>
                  <svg
                    width="5"
                    height="9"
                    viewBox="0 0 5 9"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1 group-active:translate-x-1"
                  >
                    <path
                      d="M1.826 8.448L0 7.634L1.628 4.224L0 0.836L1.848 0L4.048 3.542V4.906L1.826 8.448Z"
                      fill="#C6F432"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* Bottom CTA Buttons */}
            <div className="w-full flex flex-col gap-3 pt-6">
              {localLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleNavigate("course")}
                    className="w-full h-[54px] rounded-full bg-[#C6F432] text-[#17152E] font-bold text-[16px] flex items-center justify-center shadow-[0_4px_16px_rgba(198,244,50,0.3)] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Minha trilha
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full h-[55px] rounded-full border-[1.5px] border-white/35 text-white font-bold text-[16px] flex items-center justify-center hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Sair da conta
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleNavigate("signup")}
                    className="w-full h-[54px] rounded-full bg-[#C6F432] text-[#17152E] font-bold text-[16px] flex items-center justify-center shadow-[0_4px_16px_rgba(198,244,50,0.3)] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Criar minha conta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate("login")}
                    className="w-full h-[55px] rounded-full border-[1.5px] border-white/35 text-white font-bold text-[16px] flex items-center justify-center hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Entrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
