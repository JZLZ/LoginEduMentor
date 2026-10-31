import { useState, useEffect, useRef } from "react"
import type {
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from "react"
import {
  assessmentApi,
  authApi,
  coursesApi,
  onboardingApi,
  tokenStorage,
} from "./services/api"
import type {
  AssessmentResult,
  CourseOption,
  QuizQuestion,
} from "./services/api"
import LandingPage from "./components/LandingPage"
import MentorinaCursoAlvo from "./components/MentorinaCursoAlvo"
import MentorinaPensando from "./components/MentorinaPensando"
import MentorinaLendo from "./components/MentorinaLendo"
import MentorinaComemorando from "./components/MentorinaComemorando"
import Mascot from "./components/Mascot"
import TermsModal from "./TermsModal"

type Screen = "landing" | "login" | "signup" | "recovery" | "reset" | "course" | "start" | "quiz" | "subjects" | "language" | "langquiz" | "restarted" | "generating" | "result06" | "goal" | "done"

/**
 * Componente do Logo completo da marca EduMentor AI.
 * Utilizado nas telas de autenticação (Login/Cadastro) e no cabeçalho do Onboarding.
 */

function BrandLogo({
  go,
  className = "",
}: {
  go?: (screen: Screen) => void
  className?: string
}) {
  return (
    <a
      href="#hero"
      onClick={(e) => {
        if (go) {
          e.preventDefault()
          go("landing")
        }
      }}
      className={`flex items-center gap-[10px] w-[219px] h-[39px] group cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95 origin-left ${className}`}
      aria-label="EduMentor AI - Início"
    >
      <svg
        width="219"
        height="39"
        viewBox="0 0 220 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[219px] h-[39px] transition-all duration-300 ease-out group-hover:brightness-110 group-hover:drop-shadow-[0_0_12px_rgba(198,244,50,0.35)]"
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
  )
}

/**
 * Logo da marca em SVG inline (fiel ao Figma), usado no cabeçalho do onboarding.
 * Ícone roxo (balão + escadaria branca + brilho lima) + "EduMentor" + badge "AI".
 */
function BrandLogoMark() {
  // SVG oficial do logo exportado do Figma (ícone + "EduMentor" + badge "AI").
  return (
    <div className="brand-logomark" role="img" aria-label="EduMentor AI">
      <svg
        className="brand-logomark-svg"
        width="177"
        height="30"
        viewBox="0 0 177 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g clipPath="url(#clip0_logo)">
          <path
            d="M8.5 2H21.5C25.1 2 28 4.9 28 8.5V18.5C28 22.1 25.1 25 21.5 25H12L6.5 29C5.75 29.55 4.75 29 4.75 28.1V24.85C3.15 23.75 2 21.25 2 18.5V8.5C2 4.9 4.9 2 8.5 2Z"
            fill="#4F3CF0"
          />
          <path
            d="M7.5 20H12V16H16.5V12H22.5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="white"
          />
          <path
            d="M23.5 4.5C23.8 6.15 24.35 6.7 26 7C24.35 7.3 23.8 7.85 23.5 9.5C23.2 7.85 22.65 7.3 21 7C22.65 6.7 23.2 6.15 23.5 4.5Z"
            fill="#C6F432"
          />
          <path
            d="M22.5 13.75C23.4665 13.75 24.25 12.9665 24.25 12C24.25 11.0335 23.4665 10.25 22.5 10.25C21.5335 10.25 20.75 11.0335 20.75 12C20.75 12.9665 21.5335 13.75 22.5 13.75Z"
            fill="#C6F432"
          />
          <g clipPath="url(#clip1_logo)">
            <path
              d="M41.34 22V8.8H44.58V22H41.34ZM43.7 22V19.4H51.74V22H43.7ZM43.7 16.52V14.18H50.74V16.52H43.7ZM43.7 11.4V8.8H51.68V11.4H43.7ZM56.9256 22.28C56.059 22.28 55.2923 22.06 54.6256 21.62C53.9723 21.1667 53.459 20.5267 53.0856 19.7C52.7123 18.86 52.5256 17.86 52.5256 16.7C52.5256 15.6067 52.6856 14.6533 53.0056 13.84C53.3256 13.0133 53.799 12.3667 54.4256 11.9C55.0523 11.4333 55.8323 11.2 56.7656 11.2C57.4323 11.2 57.9923 11.32 58.4456 11.56C58.9123 11.8 59.299 12.1667 59.6056 12.66C59.9123 13.14 60.1523 13.7467 60.3256 14.48H60.8056C60.7123 14.04 60.6256 13.62 60.5456 13.22C60.4656 12.8067 60.399 12.42 60.3456 12.06C60.3056 11.7 60.2856 11.38 60.2856 11.1V7.64H63.5256V16.94V22H60.8856L60.8456 18.86H60.4256C60.279 19.66 60.0456 20.3133 59.7256 20.82C59.419 21.3267 59.0323 21.7 58.5656 21.94C58.099 22.1667 57.5523 22.28 56.9256 22.28ZM58.0856 19.68C58.4856 19.68 58.8256 19.5933 59.1056 19.42C59.3856 19.2467 59.6123 19.0267 59.7856 18.76C59.959 18.48 60.0856 18.18 60.1656 17.86C60.259 17.5267 60.3056 17.2133 60.3056 16.92V16.52C60.3056 16.2533 60.2656 15.9933 60.1856 15.74C60.119 15.4733 60.019 15.22 59.8856 14.98C59.7656 14.74 59.6123 14.5333 59.4256 14.36C59.2523 14.1733 59.039 14.0267 58.7856 13.92C58.5456 13.8133 58.2856 13.76 58.0056 13.76C57.5656 13.76 57.1923 13.8867 56.8856 14.14C56.579 14.38 56.339 14.72 56.1656 15.16C55.9923 15.6 55.9056 16.12 55.9056 16.72C55.9056 17.3067 55.9923 17.8267 56.1656 18.28C56.3523 18.72 56.6056 19.0667 56.9256 19.32C57.259 19.56 57.6456 19.68 58.0856 19.68ZM69.1367 22.28C67.8967 22.28 66.9634 21.86 66.3367 21.02C65.7101 20.18 65.3967 18.8933 65.3967 17.16V11.44H68.6367V16.76C68.6367 17.7467 68.7767 18.4733 69.0567 18.94C69.3501 19.4067 69.7834 19.64 70.3567 19.64C70.7167 19.64 71.0234 19.5533 71.2767 19.38C71.5434 19.1933 71.7634 18.94 71.9367 18.62C72.1234 18.3 72.2567 17.9267 72.3367 17.5C72.4301 17.06 72.4767 16.58 72.4767 16.06V11.44H75.6967V17.7V22H73.1167L73.0567 18.68H72.6967C72.4967 19.52 72.2501 20.2067 71.9567 20.74C71.6634 21.2733 71.2834 21.6667 70.8167 21.92C70.3634 22.16 69.8034 22.28 69.1367 22.28ZM77.8353 22V8.8H82.6553L86.0553 18.28H86.1353L89.4553 8.8H94.0553V22H90.9953L91.1753 12.08H90.9553L87.1953 22H84.5553L80.8753 12.08H80.6553L80.8353 22H77.8353ZM101.222 22.28C100.342 22.28 99.5549 22.16 98.8616 21.92C98.1682 21.68 97.5816 21.3333 97.1016 20.88C96.6216 20.4267 96.2549 19.8667 96.0016 19.2C95.7482 18.5333 95.6216 17.7733 95.6216 16.92C95.6216 16.0933 95.7416 15.3267 95.9816 14.62C96.2216 13.9133 96.5682 13.3 97.0216 12.78C97.4882 12.26 98.0549 11.86 98.7216 11.58C99.4016 11.3 100.168 11.16 101.022 11.16C101.862 11.16 102.602 11.3 103.242 11.58C103.895 11.86 104.428 12.2667 104.842 12.8C105.268 13.3333 105.575 13.98 105.762 14.74C105.962 15.5 106.028 16.3733 105.962 17.36L97.7416 17.42V15.72L104.062 15.66L102.982 16.46C103.075 15.8067 103.035 15.2733 102.862 14.86C102.702 14.4333 102.455 14.12 102.122 13.92C101.802 13.72 101.442 13.62 101.042 13.62C100.575 13.62 100.162 13.7467 99.8016 14C99.4549 14.2533 99.1816 14.62 98.9816 15.1C98.7949 15.58 98.7016 16.1667 98.7016 16.86C98.7016 17.9533 98.9349 18.7467 99.4016 19.24C99.8816 19.7333 100.488 19.98 101.222 19.98C101.568 19.98 101.862 19.9333 102.102 19.84C102.342 19.7333 102.535 19.6067 102.682 19.46C102.842 19.3 102.962 19.1267 103.042 18.94C103.122 18.74 103.188 18.5533 103.242 18.38L106.042 18.94C105.962 19.4333 105.802 19.8867 105.562 20.3C105.335 20.7 105.028 21.0533 104.642 21.36C104.255 21.6533 103.782 21.88 103.222 22.04C102.662 22.2 101.995 22.28 101.222 22.28ZM107.462 22V15.68V11.44H110.062L110.102 14.64H110.502C110.662 13.8667 110.895 13.22 111.202 12.7C111.522 12.18 111.928 11.7933 112.422 11.54C112.915 11.2867 113.502 11.16 114.182 11.16C115.408 11.16 116.342 11.5867 116.982 12.44C117.622 13.2933 117.942 14.66 117.942 16.54V22H114.702V16.9C114.702 15.8333 114.548 15.06 114.242 14.58C113.948 14.0867 113.502 13.84 112.902 13.84C112.395 13.84 111.982 13.9933 111.662 14.3C111.342 14.5933 111.102 15 110.942 15.52C110.782 16.04 110.702 16.6267 110.702 17.28V22H107.462ZM123.897 22.26C122.644 22.26 121.724 21.9333 121.137 21.28C120.564 20.6133 120.277 19.56 120.277 18.12V13.96H118.777L118.837 11.48H119.837C120.304 11.48 120.65 11.4067 120.877 11.26C121.104 11.1133 121.244 10.8533 121.297 10.48L121.557 9.1H123.357V11.44H125.917V14.06H123.357V17.96C123.357 18.4267 123.47 18.7667 123.697 18.98C123.924 19.1933 124.264 19.3 124.717 19.3C124.957 19.3 125.19 19.2733 125.417 19.22C125.644 19.1667 125.83 19.0933 125.977 19V21.96C125.55 22.0933 125.164 22.1733 124.817 22.2C124.47 22.24 124.164 22.26 123.897 22.26ZM132.245 22.28C131.165 22.28 130.218 22.0733 129.405 21.66C128.592 21.2467 127.952 20.6267 127.485 19.8C127.018 18.9733 126.785 17.94 126.785 16.7C126.785 15.46 127.018 14.4333 127.485 13.62C127.952 12.7933 128.592 12.18 129.405 11.78C130.232 11.3667 131.178 11.16 132.245 11.16C133.325 11.16 134.272 11.3667 135.085 11.78C135.912 12.1933 136.558 12.8133 137.025 13.64C137.492 14.4533 137.725 15.48 137.725 16.72C137.725 17.9867 137.485 19.0333 137.005 19.86C136.525 20.6867 135.865 21.3 135.025 21.7C134.198 22.0867 133.272 22.28 132.245 22.28ZM132.345 19.94C132.812 19.94 133.205 19.8333 133.525 19.62C133.845 19.3933 134.078 19.0533 134.225 18.6C134.385 18.1467 134.465 17.5867 134.465 16.92C134.465 16.2133 134.378 15.62 134.205 15.14C134.045 14.6467 133.792 14.2733 133.445 14.02C133.112 13.7533 132.685 13.62 132.165 13.62C131.698 13.62 131.305 13.7333 130.985 13.96C130.665 14.1733 130.425 14.5067 130.265 14.96C130.105 15.4133 130.025 15.98 130.025 16.66C130.025 17.7533 130.225 18.5733 130.625 19.12C131.025 19.6667 131.598 19.94 132.345 19.94ZM139.152 22V17.04V11.44H141.792L141.852 15.06H142.252C142.346 14.1267 142.519 13.38 142.772 12.82C143.026 12.2467 143.386 11.8333 143.852 11.58C144.332 11.3267 144.926 11.2 145.632 11.2C145.752 11.2 145.879 11.2067 146.012 11.22C146.159 11.2333 146.326 11.26 146.512 11.3L146.392 14.74C146.166 14.6333 145.926 14.56 145.672 14.52C145.419 14.48 145.199 14.46 145.012 14.46C144.506 14.46 144.066 14.5667 143.692 14.78C143.319 14.98 143.026 15.2867 142.812 15.7C142.599 16.1133 142.459 16.6333 142.392 17.26V22H139.152Z"
              fill="#17152E"
            />
          </g>
          <rect x="153" y="3" width="24" height="13" rx="6.5" fill="#C6F432" />
          <path
            d="M160.126 12L162.142 6.06H164.275L166.291 12H164.707L163.285 7.194H163.141L161.71 12H160.126ZM161.323 10.884V9.912H165.31V10.884H161.323ZM167.046 12V6.06H168.522V12H167.046Z"
            fill="#17152E"
          />
        </g>
        <defs>
          <clipPath id="clip0_logo">
            <rect width="177" height="30" fill="white" />
          </clipPath>
          <clipPath id="clip1_logo">
            <rect
              width="137"
              height="24"
              fill="white"
              transform="translate(40 3)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

function BrandPanel({ go }: { go?: (screen: Screen) => void }) {
  return (
    <aside className="brand-panel">
      <BrandLogo go={go} />
      <div className="brand-copy">
        <h1>
          Sua trilha até o
          <br />
          ENEM, com uma
          <br />
          tutora 24h.
        </h1>
        <p>
          Trilhas personalizadas, simulados com questões reais e a Mentorina
          para tirar dúvidas a qualquer hora.
        </p>
      </div>
      <div className="brand-stairs" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
    </aside>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string

  className?: string

  children?: ReactNode
}

function Field({
  label,

  type = "text",

  placeholder,

  children,

  className = "",

  required = true,

  ...rest
}: FieldProps) {
  return (
    <label className={`field ${className}`}>
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input
          type={type}
          placeholder={placeholder ?? label}
          aria-label={label ?? placeholder}
          required={required}
          {...rest}
        />
        {children}
      </span>
    </label>
  )
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  return digits

    .replace(/^(\d{3})(\d)/, "$1.$2")

    .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")

    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/, "$1-$2")
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  if (digits.length <= 2) return digits ? `(${digits}` : ""

  const areaCode = digits.slice(0, 2)

  const subscriber = digits.slice(2)

  return `(${areaCode}) ${subscriber.slice(0, 5)}${
    subscriber.length > 5 ? `-${subscriber.slice(5)}` : ""
  }`
}

function PhoneField({
  label = "Celular",

  placeholder = "(11) 90000-0000",

  value,

  onChange,
}: {
  label?: string

  placeholder?: string

  value?: string

  onChange?: (value: string) => void
} = {}) {
  const [internalPhone, setInternalPhone] = useState("")

  const phone = value !== undefined ? value : internalPhone

  const setPhone = onChange ?? setInternalPhone

  return (
    <label className="field">
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input
          type="tel"
          inputMode="numeric"
          placeholder={placeholder}
          aria-label={label ?? "Celular"}
          pattern="\(\d{2}\) \d{5}-\d{4}"
          maxLength={15}
          required
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.currentTarget.value))}
        />
      </span>
    </label>
  )
}

function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, "")

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const calculateDigit = (length: number) => {
    const sum = [...digits.slice(0, length)].reduce(
      (total, digit, index) => total + Number(digit) * (length + 1 - index),

      0,
    )

    const remainder = sum % 11

    return remainder < 2 ? 0 : 11 - remainder
  }

  return (
    calculateDigit(9) === Number(digits[9]) &&
    calculateDigit(10) === Number(digits[10])
  )
}

function CpfField({
  label = "CPF do responsável",

  placeholder = "000.000.000-00",

  value,

  onChange,
}: {
  label?: string

  placeholder?: string

  value: string

  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          aria-label={label ?? "CPF do responsável"}
          pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
          maxLength={14}
          required
          value={value}
          onChange={(event) => {
            const formattedValue = formatCpf(event.currentTarget.value)

            onChange(formattedValue)

            event.currentTarget.setCustomValidity(
              formattedValue.length === 14 && !isValidCpf(formattedValue)
                ? "Informe um CPF válido."
                : "",
            )
          }}
        />
      </span>
    </label>
  )
}

function PasswordVisibilityButton({
  visible,

  toggle,
}: {
  visible: boolean

  toggle: () => void
}) {
  return (
    <button
      className="input-action"
      type="button"
      onClick={toggle}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={visible}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
        {visible && <path d="m4 4 16 16" />}
      </svg>
    </button>
  )
}

function AuthTabs({
  active,

  go,
}: {
  active: "login" | "signup"

  go: (screen: Screen) => void
}) {
  return (
    <nav className="auth-tabs" aria-label="Acesso">
      <button
        type="button"
        className={active === "signup" ? "active" : ""}
        onClick={() => go("signup")}
      >
        Criar conta
      </button>
      <button
        type="button"
        className={active === "login" ? "active" : ""}
        onClick={() => go("login")}
      >
        Fazer login
      </button>
    </nav>
  )
}

function AccountModal({
  close,

  continueFlow,
}: {
  close: () => void

  continueFlow: () => void
}) {
  const [account, setAccount] = useState("vestibulando")

  const user = tokenStorage.getUser()

  const accounts = [
    {
      id: "vestibulando",

      title: "Vestibulando",

      description: "Preparação para o ENEM · Medicina",

      icon: "◎",
    },

    {
      id: "universitario",

      title: "Universitário",

      description: "Graduação · Engenharia Civil",

      icon: "◇",
    },
  ]

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="account-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
      >
        <span className="eyebrow">Passo de segurança</span>
        <h2 id="account-title">
          {user?.name
            ? `Olá, ${user.name}! Escolha seu perfil:`
            : "Com qual conta você quer entrar?"}
        </h2>
        <p>
          Encontramos mais de um perfil vinculado a{" "}
          {user?.email ? <strong>{user.email}</strong> : "sua conta"}. Escolha
          como quer navegar hoje:
        </p>
        <div className="account-list">
          {accounts.map(({ id, title, description, icon }) => (
            <button
              type="button"
              className={`account-option ${account === id ? "selected" : ""}`}
              onClick={() => setAccount(id)}
              key={id}
            >
              <i>{icon}</i>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <b>{account === id ? "✓" : ""}</b>
            </button>
          ))}
        </div>
        <div className="token-note">
          Por segurança, faça sua escolha em alguns minutos. Se o tempo acabar,
          é só entrar de novo.
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={close}>
            Voltar ao login
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={continueFlow}
          >
            Entrar com esta conta
          </button>
        </div>
      </section>
    </div>
  )
}

function Login({ go }: { go: (screen: Screen) => void }) {
  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [rememberMe, setRememberMe] = useState(false)

  const [accounts, setAccounts] = useState(false)

  const [formAttempted, setFormAttempted] = useState(false)

  const [loading, setLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sherlock_remembered_login")

      if (saved) {
        const parsed = JSON.parse(saved)

        if (parsed.email) setEmail(parsed.email)

        if (parsed.password) setPassword(parsed.password)

        setRememberMe(true)
      }
    } catch {
      // ignore
    }
  }, [])

  function handleRememberChange(checked: boolean) {
    setRememberMe(checked)

    if (!checked) {
      try {
        localStorage.removeItem("sherlock_remembered_login")
      } catch {
        // ignore
      }
    } else {
      try {
        if (email || password) {
          localStorage.setItem(
            "sherlock_remembered_login",

            JSON.stringify({ email, password }),
          )
        }
      } catch {
        // ignore
      }
    }
  }

  function fillAdminData() {
    setEmail("admin@admin.com")

    setPassword("Admin@123")

    setErrorMessage(null)

    if (rememberMe) {
      try {
        localStorage.setItem(
          "sherlock_remembered_login",

          JSON.stringify({ email: "admin@admin.com", password: "Admin@123" }),
        )
      } catch {
        // ignore
      }
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (rememberMe) {
      try {
        localStorage.setItem(
          "sherlock_remembered_login",

          JSON.stringify({ email, password }),
        )
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem("sherlock_remembered_login")
      } catch {
        // ignore
      }
    }

    setLoading(true)

    setErrorMessage(null)

    try {
      await authApi.login(email, password)

      setAccounts(true)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao efetuar login"

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout go={go}>
      <div className="auth-form login-form">
        <AuthTabs active="login" go={go} />
        <header className="form-heading">
          <h2>Que bom te ver de novo!</h2>
          <p>Entre para iniciar sua trilha até o ENEM.</p>
        </header>
        <div
          style={{
            display: "flex",

            justifyContent: "flex-end",

            marginBottom: "12px",
          }}
        >
          <button
            type="button"
            className="text-button"
            style={{
              color: "var(--indigo)",

              fontSize: "12px",

              fontWeight: 700,

              padding: "4px 10px",

              background: "var(--lavender)",

              borderRadius: "999px",

              cursor: "pointer",

              maxWidth: "100%",

              whiteSpace: "normal",

              textAlign: "right",
            }}
            onClick={fillAdminData}
          >
            ⚡ Preencher dados de teste (Admin)
          </button>
        </div>
        <form
          className={formAttempted ? "required-check" : ""}
          onInvalidCapture={() => setFormAttempted(true)}
          onSubmit={submit}
        >
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
            </div>
          )}
          <Field
            type="email"
            placeholder="nome@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            type={showPassword ? "text" : "password"}
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            <PasswordVisibilityButton
              visible={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </Field>
          <button
            className="text-button forgot"
            type="button"
            onClick={() => go("recovery")}
          >
            Esqueceu sua senha?
          </button>
          <label className="check-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => handleRememberChange(e.target.checked)}
            />
            <span>Manter conectado</span>
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="auth-switch">
          Não possui uma conta?{" "}
          <button type="button" onClick={() => go("signup")}>
            Criar conta
          </button>
        </p>
        <button className="support-link" type="button">
          Precisa de ajuda? <strong>Fale com o suporte</strong>
        </button>
      </div>
      {accounts && (
        <AccountModal
          close={() => setAccounts(false)}
          continueFlow={() => go("course")}
        />
      )}
    </AuthLayout>
  )
}

function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)

  return digits

    .replace(/^(\d{2})(\d)/, "$1/$2")

    .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2")
}

const UNDER_13_ERROR_MESSAGE =
  "Sua data de nascimento esta correta? Essa plataforma não é recomendada para menores de 13 anos, por isso não podemos permitir seu cadastro."

function getBirthDateError(value: string) {
  if (!value) return ""

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return "Use o formato dd/mm/aaaa."
  }

  if (!parseBirthDate(value)) {
    return "Informe uma data válida, que não seja futura."
  }

  const age = getAge(value)
  if (age !== null && age < 13) {
    return UNDER_13_ERROR_MESSAGE
  }

  return ""
}

function parseBirthDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)

  if (!match) return null

  const [, day, month, year] = match

  const date = new Date(Number(year), Number(month) - 1, Number(day))

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day) ||
    date > today
  ) {
    return null
  }

  return date
}

function getAge(birthDate: string) {
  const date = parseBirthDate(birthDate)

  if (!date) return null

  const today = new Date()

  const hasHadBirthdayThisYear =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())

  return (
    today.getFullYear() - date.getFullYear() - (hasHadBirthdayThisYear ? 0 : 1)
  )
}

function Signup({ go }: { go: (screen: Screen) => void }) {
  const [fullName, setFullName] = useState("")

  const [birthDate, setBirthDate] = useState("")

  const [phone, setPhone] = useState("")

  const [education, setEducation] = useState("")

  const [guardianCpf, setGuardianCpf] = useState("")

  const [guardianName, setGuardianName] = useState("")

  const [email, setEmail] = useState("")

  const [recoveryEmail, setRecoveryEmail] = useState("")

  const [password, setPassword] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [accepted, setAccepted] = useState(false)

  const [showTermsModal, setShowTermsModal] = useState(false)

  const [formAttempted, setFormAttempted] = useState(false)

  const [loading, setLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const age = getAge(birthDate)

  const isUnder13 = age !== null && age < 13

  const minor = age !== null && age >= 13 && age < 18

  function fillTestData() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)

    setFullName("Júlia Andrade")

    setBirthDate("15/06/2004")

    setPhone("(11) 90000-0000")

    setEducation("medio-completo")

    setEmail(`julia.andrade${randomSuffix}@email.com`)

    setRecoveryEmail(`nome${randomSuffix}@email.com`)

    setPassword("EduMentor2026@")

    setConfirmPassword("EduMentor2026@")

    setAccepted(true)

    setErrorMessage(null)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const currentAge = getAge(birthDate)

    if (currentAge !== null && currentAge < 13) {
      setErrorMessage(UNDER_13_ERROR_MESSAGE)
      return
    }

    const birthDateError = getBirthDateError(birthDate)
    if (birthDateError) {
      setErrorMessage(birthDateError)
      return
    }

    if (currentAge === null) {
      setErrorMessage("Informe uma data de nascimento válida.")
      return
    }

    if (!accepted) {
      setErrorMessage("Você precisa aceitar os Termos de uso para continuar.")
      return
    }

    if (minor && !isValidCpf(guardianCpf)) {
      setErrorMessage("Informe um CPF válido para o responsável legal.")
      return
    }

    const parts = fullName.trim().split(/\s+/)

    if (parts.length < 2 || !parts[1]) {
      setErrorMessage("Por favor, digite seu nome e sobrenome completo.")

      return
    }

    if (!/^[^\s@]+@[^\s@]+\.(com|com\.br)$/.test(email.trim().toLowerCase())) {
      setErrorMessage(
        "O e-mail deve ter o formato válido (ex: nome@dominio.com ou .com.br).",
      )

      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("As duas senhas informadas não são iguais.")

      return
    }

    // Regras alinhadas ao backend (CadastroDto): 8–20 caracteres.
    if (password.length < 8 || password.length > 20) {
      setErrorMessage("A senha deve ter entre 8 e 20 caracteres.")
      return
    }

    // Maiúscula, minúscula, número e especial (!@#$%&*), sem espaços.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])\S+$/
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "A senha deve conter maiúscula, minúscula, número e caractere especial (!@#$%&*), sem espaços.",
      )

      return
    }

    // Sem números sequenciais (ex.: 123, 321) — regra do backend.
    if (
      /(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/.test(
        password,
      )
    ) {
      setErrorMessage("A senha não pode conter números sequenciais.")
      return
    }

    // O e-mail de recuperação precisa existir e ser diferente do principal.
    const recovery = recoveryEmail.trim().toLowerCase()
    if (!recovery) {
      setErrorMessage("Informe um e-mail de recuperação.")
      return
    }
    if (recovery === email.trim().toLowerCase()) {
      setErrorMessage(
        "O e-mail de recuperação deve ser diferente do e-mail principal.",
      )
      return
    }

    if (!education) {
      setErrorMessage("Selecione sua escolaridade.")
      return
    }

    setLoading(true)

    setErrorMessage(null)

    // Converte dd/mm/aaaa -> YYYY-MM-DD (ISO) exigido pelo backend.
    const [dd, mm, yyyy] = birthDate.split("/")
    const dataNascimento = `${yyyy}-${mm}-${dd}`

    // Mapeia os valores do select para o enum Escolaridade do backend.
    const escolaridadeMap: Record<string, string> = {
      "fundamental-incompleto": "ENSINO_FUNDAMENTAL",
      "fundamental-completo": "ENSINO_FUNDAMENTAL",
      "medio-incompleto": "ENSINO_MEDIO",
      "medio-completo": "ENSINO_MEDIO",
      "superior-incompleto": "ENSINO_SUPERIOR",
      "superior-completo": "ENSINO_SUPERIOR",
      "pos-graduacao": "POS_GRADUACAO",
    }

    try {
      await authApi.cadastrar({
        nomeCompleto: fullName.trim().replace(/\s+/g, " "),
        dataNascimento,
        escolaridade: escolaridadeMap[education] ?? "ENSINO_MEDIO",
        celular: phone,
        email: email.trim().toLowerCase(),
        emailRecuperacao: recovery,
        senha: password,
        confirmarSenha: confirmPassword,
        termosAceitos: accepted,
        ...(minor
          ? {
              responsavelLegal: {
                nomeCompleto: guardianName.trim(),
                cpf: guardianCpf.replace(/\D/g, ""),
              },
            }
          : {}),
      })

      // Login automático: o cadastro criou a conta, então o login funciona.
      await authApi.login(email, password)

      go("course")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao cadastrar usuário"

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout go={go}>
      <div className="auth-form signup-form">
        <AuthTabs active="signup" go={go} />
        <header className="form-heading">
          <h2>Bora criar sua conta?</h2>
          <p>Leva menos de 2 minutos.</p>
        </header>
        <div
          style={{
            display: "flex",

            justifyContent: "flex-end",

            marginBottom: "12px",
          }}
        >
          <button
            type="button"
            className="text-button"
            style={{
              color: "var(--indigo)",

              fontSize: "12px",

              fontWeight: 700,

              padding: "4px 10px",

              background: "var(--lavender)",

              borderRadius: "999px",

              cursor: "pointer",

              maxWidth: "100%",

              whiteSpace: "normal",

              textAlign: "right",
            }}
            onClick={fillTestData}
          >
            ⚡ Simular preenchimento com dados válidos
          </button>
        </div>
        <form
          className={formAttempted ? "required-check" : ""}
          onInvalidCapture={() => {
            setFormAttempted(true)
            const currentAge = getAge(birthDate)
            if (currentAge !== null && currentAge < 13) {
              setErrorMessage(UNDER_13_ERROR_MESSAGE)
            }
          }}
          onSubmit={submit}
        >
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
              {!errorMessage.includes("menores de 13 anos") && (
                <div style={{ marginTop: "8px" }}>
                  <button
                    type="button"
                    className="text-button"
                    style={{
                      color: "var(--indigo)",

                      textDecoration: "underline",

                      fontWeight: 700,

                      cursor: "pointer",
                    }}
                    onClick={() => go("course")}
                  >
                    Continuar em modo demonstração →
                  </button>
                </div>
              )}
            </div>
          )}
          <Field
            label="Nome completo"
            placeholder="Júlia Andrade"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="field-row">
            <label className="field">
              <span>Data de nascimento</span>
              <span className="input-shell">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday"
                  placeholder="dd/mm/aaaa"
                  aria-label="Data de nascimento"
                  pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                  maxLength={10}
                  required
                  value={birthDate}
                  onChange={(event) => {
                    const value = formatBirthDate(event.currentTarget.value)

                    setBirthDate(value)

                    const err = getBirthDateError(value)
                    event.currentTarget.setCustomValidity(err)
                    if (err === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(UNDER_13_ERROR_MESSAGE)
                    } else if (errorMessage === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(null)
                    }
                  }}
                  onBlur={(event) => {
                    const err = getBirthDateError(birthDate)
                    event.currentTarget.setCustomValidity(err)
                    if (err === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(UNDER_13_ERROR_MESSAGE)
                    } else if (errorMessage === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(null)
                    }
                  }}
                />
              </span>
            </label>
            <PhoneField
              label="Celular"
              placeholder="(11) 90000-0000"
              value={phone}
              onChange={setPhone}
            />
          </div>
          {isUnder13 && (
            <small
              className="field-help"
              style={{
                color: "#b42318",
                marginTop: "-8px",
                marginBottom: "8px",
                fontWeight: 600,
                display: "block",
              }}
              role="alert"
            >
              {UNDER_13_ERROR_MESSAGE}
            </small>
          )}
          <Field
            label="E-mail"
            type="email"
            placeholder="julia@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="E-mail de recuperação"
            type="email"
            placeholder="nome@email.com"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <small className="field-help">
            É para ele que enviamos o link de nova senha.
          </small>
          <div className="field-row">
            <Field
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            </Field>
            <Field
              label="Confirmar senha"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            </Field>
          </div>
          <small
            className="field-help"
            style={{ marginTop: "-6px", marginBottom: "8px" }}
          >
            Mínimo 8 e no máximo 20 caracteres, com letra maiúscula, minúscula,
            número e símbolo (@#$%).
          </small>
          <label className="field">
            <span>Escolaridade</span>
            <span className="input-shell">
              <select
                aria-label="Escolaridade"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              >
                <option value="" disabled>
                  Selecione sua escolaridade
                </option>
                <option value="fundamental-incompleto">
                  Ensino fundamental incompleto
                </option>
                <option value="fundamental-completo">
                  Ensino fundamental completo
                </option>
                <option value="medio-incompleto">
                  Ensino médio incompleto
                </option>
                <option value="medio-completo">Ensino médio completo</option>
                <option value="superior-incompleto">
                  Ensino superior incompleto
                </option>
                <option value="superior-completo">
                  Ensino superior completo
                </option>
                <option value="pos-graduacao">Pós-graduação</option>
              </select>
            </span>
          </label>
          {minor && (
            <div className="guardian-card">
              <div className="guardian-header">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>SE VOCÊ TIVER MENOS DE 18 ANOS</span>
              </div>
              <p>Precisamos dos dados do seu responsável legal.</p>
              <div className="guardian-fields">
                <Field
                  label="Nome do responsável legal"
                  placeholder="Nome completo"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
                <CpfField
                  label="CPF do responsável"
                  placeholder="000.000.000-00"
                  value={guardianCpf}
                  onChange={setGuardianCpf}
                />
              </div>
            </div>
          )}
          <label className="check-row">
            <input
              type="checkbox"
              required
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              Li e concordo com os{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()

                  e.stopPropagation()

                  setShowTermsModal(true)
                }}
                className="underline hover:opacity-80 font-bold cursor-pointer"
                style={{
                  color: "var(--indigo)",

                  background: "transparent",

                  border: "none",

                  padding: 0,

                  font: "inherit",
                }}
              >
                Termos de uso
              </button>
            </span>
          </label>
          <button
            className="primary-button"
            type="submit"
            disabled={!accepted || loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          isMinor={minor}
          onAccept={() => setAccepted(true)}
        />
      </div>
    </AuthLayout>
  )
}

function PasswordScreen({
  reset,

  go,
}: {
  reset?: boolean

  go: (screen: Screen) => void
}) {
  const [sent, setSent] = useState(false)

  const [show, setShow] = useState(false)

  const [password, setPassword] = useState("")

  const [confirmation, setConfirmation] = useState("")

  const [formAttempted, setFormAttempted] = useState(false)

  const validLength = password.length >= 8 && password.length <= 20

  const validMix = /[a-zA-Z]/.test(password) && /\d/.test(password)

  const same = password.length > 0 && password === confirmation

  return (
    <AuthLayout go={go}>
      <div className="auth-form password-form">
        <button className="back-link" type="button" onClick={() => go("login")}>
          ← Voltar{reset ? " ao login" : ""}
        </button>
        <header className="form-heading">
          <h2>{reset ? "Crie uma nova senha" : "Esqueceu a senha?"}</h2>
          <p>
            {reset
              ? "Escolha uma senha que você não use em outros sites."
              : "Digite seu e-mail de recuperação. Vamos enviar um link para você criar uma nova senha. Ele vale por 1 hora."}
          </p>
        </header>
        {!reset ? (
          <form
            className={formAttempted ? "required-check" : ""}
            onInvalidCapture={() => setFormAttempted(true)}
            onSubmit={(e) => {
              e.preventDefault()

              setSent(true)
            }}
          >
            <Field
              label="E-mail de recuperação"
              type="email"
              placeholder="nome@email.com"
            />
            <button className="primary-button" type="submit">
              Enviar link
            </button>
            {sent && (
              <div className="success-state">
                <strong>✓ Link enviado!</strong>
                <span>Confira sua caixa de entrada e o spam.</span>
                <button type="button" onClick={() => go("reset")}>
                  Abrir link recebido
                </button>
              </div>
            )}
          </form>
        ) : (
          <form
            className={formAttempted ? "required-check" : ""}
            onInvalidCapture={() => setFormAttempted(true)}
            onSubmit={(e) => {
              e.preventDefault()

              if (validLength && validMix && same) go("login")
            }}
          >
            <Field
              label="Nova senha"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={show}
                toggle={() => setShow(!show)}
              />
            </Field>
            <Field
              label="Confirmar nova senha"
              type={show ? "text" : "password"}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={show}
                toggle={() => setShow(!show)}
              />
            </Field>
            <ul className="password-rules">
              <li className={validLength ? "valid" : ""}>
                Entre 8 e 20 caracteres
              </li>
              <li className={validMix ? "valid" : ""}>Letras e números</li>
              <li className={same ? "valid" : ""}>As duas senhas são iguais</li>
            </ul>
            <button
              className="primary-button"
              type="submit"
              disabled={!validLength || !validMix || !same}
            >
              Redefinir senha
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

function AuthLayout({
  children,
  go,
}: {
  children: ReactNode
  go?: (screen: Screen) => void
}) {
  return (
    <div className="auth-screen-wrapper">
      <main className="auth-screen">
        <div className="brand-panel-wrapper">
          <BrandPanel go={go} />
        </div>
        <section className="auth-content">{children}</section>
      </main>
    </div>
  )
}

interface StepperProps {
  step: number

  back: () => void
}

function Stepper({ step, back }: StepperProps) {
  const labels = ["Curso-alvo", "Como começar", "Meta semanal"]

  return (
    <header className="onboarding-header">
      <BrandLogoMark />
      <div className="stepper">
        {labels.map((label, index) => (
          <div className={index + 1 <= step ? "complete" : ""} key={label}>
            <i>{index + 1 < step ? "✓" : index + 1}</i>
            <span>{label}</span>
            {index < 2 && <b />}
          </div>
        ))}
      </div>
      <button className="back-link" type="button" onClick={back}>
        ← Voltar
      </button>
    </header>
  )
}

function OnboardingLayout({
  step,

  back,

  children,
}: {
  step: number

  back: () => void

  children: ReactNode
}) {
  return (
    <div className="onboarding-screen-wrapper">
      <main className="onboarding">
        <Stepper step={step} back={back} />
        <section className="onboarding-content">{children}</section>
      </main>
    </div>
  )
}

function Course({ go }: { go: (screen: Screen) => void }) {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<CourseOption[]>([])
  const [selected, setSelected] = useState<CourseOption | null>(null)
  const [weightAreas, setWeightAreas] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // RN02: busca no servidor (ignora acento/caixa), com debounce.
  useEffect(() => {
    const term = query.trim()
    // Se o texto não corresponde mais ao curso selecionado, invalida a seleção (RN03).
    if (selected && term !== selected.name) {
      setSelected(null)
      setWeightAreas([])
    }
    if (term.length < 2) {
      setOptions([])
      return
    }
    let active = true
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const items = await coursesApi.search(term)
        if (active) {
          setOptions(items)
          setHighlight(-1)
        }
      } catch {
        if (active) setOptions([])
      } finally {
        if (active) setLoading(false)
      }
    }, 300)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, selected])

  // RN07/RN11: ao selecionar um curso válido, carrega e exibe as áreas de peso.
  async function selectCourse(option: CourseOption) {
    setSelected(option)
    setQuery(option.name)
    setOptions([])
    setOpen(false)
    setErrorMessage(null)
    try {
      const areas = await coursesApi.getWeightAreas(option.id)
      setWeightAreas(areas)
    } catch {
      setWeightAreas([])
    }
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!open || options.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (event.key === "Enter" && highlight >= 0) {
      event.preventDefault()
      void selectCourse(options[highlight])
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  // RN08/RN09: só avança com curso válido; persiste a escolha antes de seguir.
  async function handleContinue() {
    if (!selected) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onboardingApi.setTargetCourse(selected.id)
      go("start")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao registrar o curso."
      setErrorMessage(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <OnboardingLayout step={1} back={() => go("signup")}>
      <div className="course-mascot" aria-hidden="true">
        <MentorinaCursoAlvo size={180} />
      </div>
      <div className="center-heading">
        <h1>Qual curso você quer fazer?</h1>
        <p>
          Com isso, sua trilha dá mais peso às áreas que mais contam para o seu
          curso.
        </p>
      </div>
      <div className="course-single">
        <label className="field course-combobox">
          <span>Curso (obrigatório)</span>
          <span className="input-shell">
            <input
              type="text"
              role="combobox"
              aria-expanded={open && options.length > 0}
              aria-autocomplete="list"
              aria-controls="course-options"
              placeholder="Busque seu curso. Ex.: Medicina"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onKeyDown={onKeyDown}
              autoComplete="off"
            />
          </span>
          {open && (loading || options.length > 0) && (
            <ul className="course-options" id="course-options" role="listbox">
              {loading && options.length === 0 ? (
                <li className="course-option muted">Buscando...</li>
              ) : (
                options.map((option, index) => (
                  <li
                    key={option.id}
                    role="option"
                    aria-selected={index === highlight}
                    className={`course-option ${
                      index === highlight ? "active" : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      void selectCourse(option)
                    }}
                    onMouseEnter={() => setHighlight(index)}
                  >
                    {option.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </label>
      </div>
      {selected && weightAreas.length > 0 && (
        <div className="weight-card">
          <span>Áreas com mais peso para {selected.name}</span>
          <div>
            {weightAreas.map((area) => (
              <b key={area}>{area}</b>
            ))}
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="form-alert error" role="alert">
          {errorMessage}
        </div>
      )}
      <button
        className="primary-button narrow"
        type="button"
        disabled={!selected || saving}
        aria-disabled={!selected || saving}
        onClick={handleContinue}
      >
        {saving ? "Salvando..." : "Continuar"}
      </button>
    </OnboardingLayout>
  )
}

function StartChoice({ go }: { go: (screen: Screen) => void }) {
  const [saving, setSaving] = useState<"nivelamento" | "materias" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // RN04/RN05: registra o modo de início e navega para a sub-tela.
  // Cada card dispara o próprio CTA: persiste o modo e navega.
  async function choose(mode: "nivelamento" | "materias") {
    if (saving) return
    setSaving(mode)
    setErrorMessage(null)
    try {
      await onboardingApi.setStartMode(mode)
      go(mode === "nivelamento" ? "quiz" : "subjects")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao registrar a escolha."
      setErrorMessage(message)
      setSaving(null)
    }
  }

  return (
    <OnboardingLayout step={2} back={() => go("course")}>
      <div className="start-choice">
        <div className="start-choice-mascot" aria-hidden="true">
          <MentorinaPensando size={160} />
        </div>
        <h1 className="start-choice-title">Como você quer começar?</h1>
        <p className="start-choice-subtitle">
          Escolha como prefere montar sua trilha de estudos. Dá para mudar essa
          decisão depois no seu perfil.
        </p>

        {errorMessage && (
          <div className="form-alert error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="start-choice-options">
          <article className="start-card start-card--recommended">
            <span className="start-card-icon start-card-icon--indigo" aria-hidden="true">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="12" cy="12" r="1" fill="#ffffff" stroke="none" />
              </svg>
            </span>
            <span className="start-card-badge">Recomendado</span>
            <h2 className="start-card-title">Fazer o nivelamento rápido</h2>
            <p className="start-card-text">
              8 questões · cerca de 25 minutos. A IA descobre seu nível em cada
              área e monta uma trilha no seu ritmo.
            </p>
            <p className="start-card-info">
              Responda sem consultar: a Mentorina percebe chutes e pesquisas, e
              assim sua trilha fica mais certeira.
            </p>
            <button
              className="primary-button start-card-cta"
              type="button"
              disabled={saving !== null}
              onClick={() => void choose("nivelamento")}
            >
              {saving === "nivelamento" ? "Salvando..." : "Começar nivelamento"}
            </button>
          </article>

          <article className="start-card">
            <span className="start-card-icon start-card-icon--lavender" aria-hidden="true">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f3cf0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6.5c-1.8-1.2-4-1.5-6-1.5v12c2 0 4.2.3 6 1.5 1.8-1.2 4-1.5 6-1.5V5c-2 0-4.2.3-6 1.5Z" />
                <path d="M12 6.5V18" />
              </svg>
            </span>
            <h2 className="start-card-title">Escolher as matérias</h2>
            <p className="start-card-text">
              Você escolhe as matérias que quer focar e a IA gera a trilha
              delas, sem o nivelamento.
            </p>
            <button
              className="secondary-button start-card-cta"
              type="button"
              disabled={saving !== null}
              onClick={() => void choose("materias")}
            >
              {saving === "materias" ? "Salvando..." : "Escolher matérias"}
            </button>
          </article>
        </div>
      </div>
    </OnboardingLayout>
  )
}

function Quiz({ go }: { go: (screen: Screen) => void }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [index, setIndex] = useState(1)
  const [total, setTotal] = useState(8)
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shownAt, setShownAt] = useState<number>(Date.now())

  // Inicia o nivelamento geral ao montar (RN04).
  useEffect(() => {
    let active = true
    setLoading(true)
    assessmentApi
      .start("geral")
      .then((data) => {
        if (!active) return
        setSessionId(data.sessionId)
        setTotal(data.total)
        setIndex(data.index)
        setQuestion(data.question)
        setShownAt(Date.now())
      })
      .catch((err: unknown) => {
        if (active)
          setErrorMessage(
            err instanceof Error ? err.message : "Erro ao iniciar o nivelamento.",
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const isLast = index >= total

  // Registra a resposta e avança (RN07) ou finaliza (RN08).
  async function submit() {
    if (!sessionId || !answer || submitting) return
    setSubmitting(true)
    setErrorMessage(null)
    const elapsedMs = Date.now() - shownAt
    try {
      const res = await assessmentApi.answer(sessionId, answer, elapsedMs)
      if (res.finished) {
        await assessmentApi.finish(sessionId)
        // Guarda o id para a tela de resultado (fluxo seguinte).
        try {
          localStorage.setItem("sherlock_assessment_session", sessionId)
        } catch {
          // ignore
        }
        go("language")
        return
      }
      setIndex(res.index)
      setQuestion(res.question)
      setAnswer(null)
      setShownAt(Date.now())
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao registrar a resposta.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <OnboardingLayout step={2} back={() => go("start")}>
      <div className="quiz-layout">
        <section className="quiz-main">
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
            </div>
          )}
          {loading || !question ? (
            <div className="question-card">Carregando questão...</div>
          ) : (
            <>
              <div className="quiz-meta">
                <span>{question.area}</span>
                <b>
                  Questão {index} de {total}
                </b>
              </div>
              <div
                className="quiz-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={index}
              >
                {Array.from({ length: total }, (_, i) => (
                  <span
                    key={i}
                    className={i < index ? "filled" : ""}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="question-card">{question.statement}</div>
              <div className="answers">
                {question.options.map(({ letter, text }) => (
                  <button
                    type="button"
                    className={answer === letter ? "selected" : ""}
                    onClick={() => setAnswer(letter)}
                    key={letter}
                  >
                    <i>{letter}</i>
                    {text}
                  </button>
                ))}
              </div>
              <button
                className="primary-button quiz-next"
                type="button"
                disabled={!answer || submitting}
                onClick={() => void submit()}
              >
                {submitting
                  ? "Enviando..."
                  : isLast
                    ? "Finalizar"
                    : "Próxima"}
              </button>
            </>
          )}
        </section>
      </div>
    </OnboardingLayout>
  )
}

const SUBJECT_LIST = [
  "Matemática",

  "Ciências da Natureza",

  "Linguagens",

  "Ciências Humanas",

  "Redação",
]

function Subjects({ go }: { go: (screen: Screen) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [language, setLanguage] = useState<"ingles" | "espanhol" | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function toggle(subject: string) {
    setSelected((items) =>
      items.includes(subject)
        ? items.filter((item) => item !== subject)
        : [...items, subject],
    )
  }

  // RN04: habilita só com >=1 matéria e 1 língua.
  const canContinue = selected.length > 0 && language !== null

  // RN05: registra as escolhas e segue para a próxima etapa (língua estrangeira).
  async function handleContinue() {
    if (!canContinue || !language || saving) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onboardingApi.setSubjects({
        subjects: selected,
        foreignLanguage: language,
      })
      go("language")
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao registrar as matérias.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <OnboardingLayout step={2} back={() => go("start")}>
      <div className="center-heading">
        <h1>Quais matérias você quer focar?</h1>
        <p>Selecione uma ou mais matérias e a sua língua estrangeira.</p>
      </div>
      {errorMessage && (
        <div className="form-alert error" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="subject-grid">
        {SUBJECT_LIST.map((subject, index) => {
          const isSelected = selected.includes(subject)

          return (
            <button
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => toggle(subject)}
              key={subject}
            >
              <i>{isSelected ? "✓" : ""}</i>
              <b className={`subject-dot dot-${index}`} />
              <span>{subject}</span>
              {isSelected && <em>{selected.indexOf(subject) + 1}º</em>}
            </button>
          )
        })}
      </div>
      <div className="language-choice">
        <span className="language-choice-label">Língua estrangeira</span>
        <div className="language-options">
          {(
            [
              { id: "ingles", label: "Inglês" },
              { id: "espanhol", label: "Espanhol" },
            ] as const
          ).map((opt) => (
            <button
              type="button"
              className={language === opt.id ? "selected" : ""}
              aria-pressed={language === opt.id}
              onClick={() => setLanguage(opt.id)}
              key={opt.id}
            >
              <i>{language === opt.id ? "✓" : ""}</i>
              <span>{opt.label}</span>
              <small>5 questões na prova de Linguagens</small>
            </button>
          ))}
        </div>
      </div>
      <div className="info-strip">
        ⓘ Uma trilha por vez: termine uma para liberar a próxima. A ordem da
        seleção define a prioridade.
      </div>
      <button
        className="primary-button narrow"
        type="button"
        disabled={!canContinue || saving}
        onClick={() => void handleContinue()}
      >
        {saving ? "Salvando..." : "Continuar"}
      </button>
    </OnboardingLayout>
  )
}

function ForeignLanguage({ go }: { go: (screen: Screen) => void }) {
  const [language, setLanguage] = useState<"ingles" | "espanhol" | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pré-seleciona a língua já escolhida (ex.: vinda da Tela 03c).
  useEffect(() => {
    let active = true
    onboardingApi
      .getMe()
      .then((data) => {
        if (active && data.foreignLanguage) setLanguage(data.foreignLanguage)
      })
      .catch(() => {
        // silencioso: apenas não pré-seleciona
      })
    return () => {
      active = false
    }
  }, [])

  // RN04: registra e segue para Gerando trilha (enquanto 05 não existe, vai para goal).
  async function handleContinue() {
    if (!language || saving) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onboardingApi.setForeignLanguage(language)
      go("langquiz")
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao registrar a língua.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <OnboardingLayout step={2} back={() => go("subjects")}>
      <div className="language-mascot" aria-hidden="true">
        <MentorinaLendo size={150} />
      </div>
      <div className="center-heading">
        <h1>Qual língua estrangeira você vai fazer?</h1>
        <p>
          No ENEM você escolhe uma delas. A Mentorina coloca essa língua na sua
          trilha de Linguagens.
        </p>
      </div>
      {errorMessage && (
        <div className="form-alert error" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="language-choice language-choice--wide">
        <div className="language-options" role="radiogroup">
          {(
            [
              { id: "ingles", label: "Inglês", desc: "5 questões de inglês na prova de Linguagens" },
              { id: "espanhol", label: "Espanhol", desc: "5 questões de espanhol na prova de Linguagens" },
            ] as const
          ).map((opt) => (
            <button
              type="button"
              className={`language-option${language === opt.id ? " selected" : ""}`}
              role="radio"
              aria-checked={language === opt.id}
              onClick={() => setLanguage(opt.id)}
              key={opt.id}
            >
              <span className="language-option-radio" aria-hidden="true" />
              <span className="language-option-body">
                <strong>{opt.label}</strong>
                <small>{opt.desc}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="language-hint">
        Dá para trocar depois em Perfil › Língua estrangeira.
      </p>
      <button
        className="primary-button narrow"
        type="button"
        disabled={!language || saving}
        onClick={() => void handleContinue()}
      >
        {saving ? "Salvando..." : "Continuar"}
      </button>
    </OnboardingLayout>
  )
}

function LanguageQuiz({ go }: { go: (screen: Screen) => void }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [index, setIndex] = useState(1)
  const [total, setTotal] = useState(5)
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shownAt, setShownAt] = useState<number>(Date.now())

  // Mantém o sessionId acessível aos listeners de interrupção (RN10).
  const sessionRef = useRef<string | null>(null)
  sessionRef.current = sessionId

  // Lê a língua escolhida e inicia o nivelamento de língua (5 questões).
  useEffect(() => {
    let active = true
    setLoading(true)
    onboardingApi
      .getMe()
      .then((profile) => {
        if (!active) return
        if (!profile.foreignLanguage) {
          go("language")
          return
        }
        return assessmentApi
          .start("lingua", profile.foreignLanguage)
          .then((data) => {
            if (!active) return
            setSessionId(data.sessionId)
            setTotal(data.total)
            setIndex(data.index)
            setQuestion(data.question)
            setShownAt(Date.now())
          })
      })
      .catch((err: unknown) => {
        if (active)
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Erro ao iniciar o nivelamento de língua.",
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [go])

  // RN10 — interrupção: ao ocultar a aba ou recarregar, descarta a sessão.
  useEffect(() => {
    function handleInterrupt() {
      const id = sessionRef.current
      if (!id) return
      try {
        localStorage.setItem("sherlock_langquiz_interrupted", "1")
      } catch {
        // ignore
      }
      void assessmentApi.discard(id).catch(() => undefined)
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") handleInterrupt()
    }
    window.addEventListener("beforeunload", handleInterrupt)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("beforeunload", handleInterrupt)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  // Ao voltar à aba, se houve interrupção, encaminha para "recomeçou".
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return
      let interrupted = false
      try {
        interrupted =
          localStorage.getItem("sherlock_langquiz_interrupted") === "1"
      } catch {
        // ignore
      }
      if (interrupted && sessionRef.current) {
        try {
          localStorage.removeItem("sherlock_langquiz_interrupted")
        } catch {
          // ignore
        }
        go("restarted")
      }
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [go])

  const isLast = index >= total

  async function submit() {
    if (!sessionId || !answer || submitting) return
    setSubmitting(true)
    setErrorMessage(null)
    const elapsedMs = Date.now() - shownAt
    try {
      const res = await assessmentApi.answer(sessionId, answer, elapsedMs)
      if (res.finished) {
        await assessmentApi.finish(sessionId)
        try {
          localStorage.setItem("sherlock_assessment_session", sessionId)
        } catch {
          // ignore
        }
        go("generating")
        return
      }
      setIndex(res.index)
      setQuestion(res.question)
      setAnswer(null)
      setShownAt(Date.now())
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao registrar a resposta.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <OnboardingLayout step={2} back={() => go("language")}>
      <div className="quiz-layout">
        <section className="quiz-main">
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
            </div>
          )}
          {loading || !question ? (
            <div className="question-card">Carregando questão...</div>
          ) : (
            <>
              <div className="quiz-meta">
                <span>Língua estrangeira</span>
                <b>
                  Questão {index} de {total}
                </b>
              </div>
              <div
                className="quiz-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={index}
              >
                {Array.from({ length: total }, (_, i) => (
                  <span
                    key={i}
                    className={i < index ? "filled" : ""}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="question-card">{question.statement}</div>
              <div className="answers">
                {question.options.map(({ letter, text }) => (
                  <button
                    type="button"
                    className={answer === letter ? "selected" : ""}
                    onClick={() => setAnswer(letter)}
                    key={letter}
                  >
                    <i>{letter}</i>
                    {text}
                  </button>
                ))}
              </div>
              <button
                className="primary-button quiz-next"
                type="button"
                disabled={!answer || submitting}
                onClick={() => void submit()}
              >
                {submitting
                  ? "Enviando..."
                  : isLast
                    ? "Finalizar"
                    : "Próxima"}
              </button>
            </>
          )}
        </section>
      </div>
    </OnboardingLayout>
  )
}

function AssessmentRestarted({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={2} back={() => go("language")}>
      <div className="restarted-wrap">
        <div className="restarted-mascot" aria-hidden="true">
          <MentorinaPensando size={150} />
        </div>
        <h1 className="restarted-title">Seu nivelamento recomeçou</h1>
        <p className="restarted-subtitle">
          Sem problema: acontece. Vamos fazer de novo com calma.
        </p>

        <div className="restarted-card">
          <div className="restarted-block">
            <h2>Por que recomeçou?</h2>
            <p>
              Você saiu da tela ou a conexão caiu durante o nivelamento. Para o
              seu resultado ser justo, ele volta do zero.
            </p>
          </div>

          <div className="restarted-block">
            <h2>O que muda?</h2>
            <p>
              Você recebe 8 novas questões, de novo 2 fáceis, 3 médias e 3
              difíceis, misturando as áreas.
            </p>
          </div>
        </div>

        <div className="restarted-tip">
          <p>
            <strong>Dica da Mentorina:</strong> reserve cerca de 25 minutos, com
            boa conexão, e responda sem sair da tela.
          </p>
        </div>

        <div className="restarted-actions">
          <button
            className="primary-button narrow"
            type="button"
            onClick={() => go("langquiz")}
          >
            Recomeçar nivelamento
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => go("subjects")}
          >
            Prefiro escolher as matérias
          </button>
        </div>
      </div>
    </OnboardingLayout>
  )
}

const GENERATING_STEPS = [
  "Ler curso e prioridades",
  "Priorizar áreas de maior peso",
  "Organizar tópicos e revisões",
  "Adequar à sua meta semanal",
]

function GeneratingTrack({ go }: { go: (screen: Screen) => void }) {
  const [step, setStep] = useState(0)

  // RN02/RN04/RN06: evolui as etapas automaticamente (~20s no total) e, ao
  // concluir, abre o Resultado automaticamente (RN05). Sem ação manual.
  useEffect(() => {
    const perStep = 1200
    const timers = GENERATING_STEPS.map((_, i) =>
      setTimeout(() => setStep(i + 1), perStep * (i + 1)),
    )
    const done = setTimeout(
      () => go("result06"),
      perStep * (GENERATING_STEPS.length + 1),
    )
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [go])

  return (
    <OnboardingLayout step={2} back={() => go("goal")}>
      <div className="generating-card">
        <div className="generating-mascot" aria-hidden="true">
          <MentorinaComemorando size={150} />
        </div>
        <div className="center-heading">
          <h1>A Mentorina está montando sua trilha</h1>
          <p>Isso leva só alguns segundos. Não feche esta tela.</p>
        </div>
        <ul className="generating-steps">
          {GENERATING_STEPS.map((label, i) => {
            const state =
              i < step ? "done" : i === step ? "active" : "pending"
            return (
              <li className={`generating-step ${state}`} key={label}>
                <span className="generating-step-icon" aria-hidden="true">
                  {state === "done" ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : null}
                </span>
                <span>{label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </OnboardingLayout>
  )
}

function AssessmentResult({ go }: { go: (screen: Screen) => void }) {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    let sessionId: string | null = null
    try {
      sessionId = localStorage.getItem("sherlock_assessment_session")
    } catch {
      sessionId = null
    }
    if (!sessionId) {
      setLoading(false)
      return
    }
    assessmentApi
      .result(sessionId)
      .then((data) => {
        if (active) setResult(data)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const level = result?.level ?? null
  const levels: AssessmentResult["level"][] = [
    "Iniciante",
    "Intermediário",
    "Avançado",
  ]

  return (
    <OnboardingLayout step={2} back={() => go("goal")}>
      <div className="result-card">
        <div className="result-mascot" aria-hidden="true">
          <MentorinaComemorando size={130} />
        </div>
        <div className="center-heading">
          <h1>Seu nivelamento está pronto!</h1>
          {loading ? (
            <p>Calculando seu resultado...</p>
          ) : result ? (
            <p>Veja como você foi nas {result.total} questões.</p>
          ) : (
            <p>
              Não encontramos um nivelamento recente. Você pode seguir e
              ajustar sua trilha pela meta semanal.
            </p>
          )}
        </div>

        {!loading && result && (
          <>
            <div className="result-counts">
              <div className="result-count">
                <span className="result-count-label">Acertos</span>
                <strong className="result-count-ok">{result.correct}</strong>
                <small>de {result.total} questões</small>
              </div>
              <div className="result-count">
                <span className="result-count-label">Erros</span>
                <strong className="result-count-err">{result.wrong}</strong>
                <small>de {result.total} questões</small>
              </div>
              <div className="result-level">
                <span className="result-level-label">Seu nível</span>
                <strong className="result-level-name">{level}</strong>
                <div className="result-level-badges">
                  {levels.map((lv) => (
                    <b className={lv === level ? "active" : ""} key={lv}>
                      {lv}
                    </b>
                  ))}
                </div>
              </div>
            </div>
            <p className="result-level-note">
              Sua trilha começa pelos tópicos em que você mais errou e já está
              pronta na sua Home.
            </p>
          </>
        )}

        <button
          className="primary-button narrow"
          type="button"
          onClick={() => go("goal")}
        >
          Continuar
        </button>
      </div>
    </OnboardingLayout>
  )
}

const GOAL_OPTIONS = [
  {
    days: 3,
    title: "Leve",
    description: "3 dias por semana. Ritmo tranquilo para encaixar na rotina.",
    accent: "indigo" as const,
  },
  {
    days: 5,
    title: "Ideal",
    description:
      "5 dias por semana. O equilíbrio que a Mentorina recomenda para evoluir.",
    accent: "lime" as const,
    recommended: true,
    tags: ["Ideal", "Mais escolhido"],
  },
  {
    days: 7,
    title: "Intenso",
    description: "7 dias por semana. Para quem quer acelerar a preparação.",
    accent: "coral" as const,
  },
]

function Goal({ go }: { go: (screen: Screen) => void }) {
  const [selected, setSelected] = useState<3 | 5 | 7>(5)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pré-seleciona a meta semanal já registrada no perfil, se houver.
  useEffect(() => {
    let active = true
    onboardingApi
      .getMe()
      .then((data) => {
        if (active && data.weeklyGoalDays) setSelected(data.weeklyGoalDays)
      })
      .catch(() => {
        // silencioso: apenas não pré-seleciona
      })
    return () => {
      active = false
    }
  }, [])

  // Persiste a meta semanal e conclui o onboarding no backend. O nível é
  // derivado no servidor a partir da sessão de nivelamento (quando houver).
  async function handleContinue() {
    if (saving) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onboardingApi.setWeeklyGoal(selected)
      let assessmentSessionId: string | undefined
      try {
        assessmentSessionId =
          localStorage.getItem("sherlock_assessment_session") ?? undefined
      } catch {
        assessmentSessionId = undefined
      }
      await onboardingApi.complete(assessmentSessionId)
      go("done")
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Erro ao concluir o onboarding.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <OnboardingLayout step={3} back={() => go("subjects")}>
      <div className="goal-choice">
        <div className="goal-mascot" aria-hidden="true">
          <Mascot pose="comemorando" size={130} />
        </div>
        <h1 className="goal-title">Qual sua meta de estudo semanal?</h1>
        <p className="goal-subtitle">
          Escolha o ritmo que combina com a sua rotina. Dá para mudar depois no
          seu perfil.
        </p>

        {errorMessage && (
          <div className="form-alert error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="goal-options" role="radiogroup">
          {GOAL_OPTIONS.map((opt) => {
            const isSelected = selected === opt.days
            return (
              <button
                type="button"
                key={opt.days}
                role="radio"
                aria-checked={isSelected}
                className={`goal-option goal-option--${opt.accent}${
                  isSelected ? " selected" : ""
                }${opt.recommended ? " recommended" : ""}`}
                onClick={() => setSelected(opt.days as 3 | 5 | 7)}
              >
                {opt.tags && (
                  <span className="goal-option-tags">
                    {opt.tags.map((tag, i) => (
                      <em
                        key={tag}
                        className={i === 0 ? "goal-tag-primary" : "goal-tag"}
                      >
                        {tag}
                      </em>
                    ))}
                  </span>
                )}
                <strong className="goal-option-number">{opt.days}</strong>
                <span className="goal-option-unit">dias por semana</span>
                <span className="goal-option-title">{opt.title}</span>
                <span className="goal-option-text">{opt.description}</span>
              </button>
            )
          })}
        </div>

        <button
          className="primary-button narrow"
          type="button"
          disabled={saving}
          onClick={() => void handleContinue()}
        >
          {saving ? "Salvando..." : "Continuar"}
        </button>
      </div>
    </OnboardingLayout>
  )
}

function Done({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={3} back={() => go("goal")}>
      <div className="done-card">
        <i>✓</i>
        <h1>Sua trilha está pronta!</h1>
        <p>
          Organizamos seus estudos de acordo com seu curso, suas prioridades e
          sua rotina semanal.
        </p>
        <button
          className="primary-button narrow"
          type="button"
          onClick={() => {
            // Onboarding concluído: limpa a sessão de nivelamento residual.
            try {
              localStorage.removeItem("sherlock_assessment_session")
            } catch {
              // ignore
            }
            authApi.logout()

            go("login")
          }}
        >
          Ir para o início
        </button>
      </div>
    </OnboardingLayout>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing")

  switch (screen) {
    case "landing":
      return <LandingPage onNavigate={(dest) => setScreen(dest)} />

    case "login":
      return <Login go={setScreen} />

    case "signup":
      return <Signup go={setScreen} />

    case "recovery":
      return <PasswordScreen go={setScreen} />

    case "reset":
      return <PasswordScreen reset go={setScreen} />

    case "course":
      return <Course go={setScreen} />

    case "start":
      return <StartChoice go={setScreen} />

    case "quiz":
      return <Quiz go={setScreen} />

    case "subjects":
      return <Subjects go={setScreen} />
    case "language":
      return <ForeignLanguage go={setScreen} />
    case "langquiz":
      return <LanguageQuiz go={setScreen} />
    case "restarted":
      return <AssessmentRestarted go={setScreen} />
    case "generating":
      return <GeneratingTrack go={setScreen} />
    case "result06":
      return <AssessmentResult go={setScreen} />
    case "goal":
      return <Goal go={setScreen} />

    case "done":
      return <Done go={setScreen} />
  }
}
