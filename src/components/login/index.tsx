"use client";

import { LoginPops } from "@/src/types";
import { useLoginForm } from "@/src/hooks/useLoginForm";
import { FiEye, FiEyeOff } from "react-icons/fi";

const EyeIcon = ({ visible }: { visible: boolean }) => {
  const Icon = visible ? FiEye : FiEyeOff;
  return (
    <Icon
      size={22}
      style={{ color: "#759FFE" }}
      className={`transition-opacity ${visible ? "opacity-100" : "opacity-60"}`}
    />
  );
};

export default function Login({ isLogin }: LoginPops) {
  const {
    formAction,
    isPending,
    state,
    showPassword,
    togglePassword,
    formValues,
    handleChange,
  } = useLoginForm();

  if (!isLogin) return null;

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col mb-2">
        <label
          htmlFor="email"
          className="text-secondary-700 text-[20px] font-bold font-nunito"
        >
          Insira seu e-mail:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 p-3 outline-2 outline-secondary-400 bg-secondary-100 rounded-xl text-black focus:none"
          placeholder="admin@admin.com"
          value={formValues.email || ""}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col mb-4">
        <label
          htmlFor="password"
          className="text-secondary-700 text-[20px] font-bold font-nunito"
        >
          Insira sua senha:
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="p-3 w-full outline-2 outline-secondary-400 rounded-xl text-black focus:none bg-secondary-100"
            placeholder="********"
            value={formValues.password || ""}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-3 cursor-pointer hover:opacity-80"
          >
            <EyeIcon visible={showPassword} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center text-sm mb-4">
        <input id="remember" type="checkbox" className="peer hidden" />
        <div
          className="w-5 h-5 border border-[#1f6fe3] rounded-full flex items-center justify-center cursor-pointer peer-checked:bg-[url('/assets/check-box.png')] peer-checked:bg-cover peer-checked:bg-center transition-all"
          onClick={() => document.getElementById("remember")?.click()}
        ></div>
        <label
          htmlFor="remember"
          className="text-[14px] text-secondary-700 font-bold ml-2 cursor-pointer"
        >
          Lembre meu acesso
        </label>
      </div>

      <div className="flex justify-center mt-4">
        <button
          disabled={isPending}
          className={`w-28 h-10 text-white text-[20px] rounded-lg font-nunito transition-all bg-secondary-400 cursor-pointer ${
            isPending
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-secondary-400 hover:bg-[#1f6fe3] cursor-pointer"
          }`}
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </div>

      {state.error && (
        <div className="my-4 p-3 text-[#f10e0e] text-sm font-bold text-center">
          {state.error}
        </div>
      )}
    </form>
  );
}