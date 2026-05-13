"use client";
import Login from "@/src/components/login";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-secondary-700">
      <div className="flex flex-1 flex-col items-center justify-center mt-5">
        <div className="flex flex-col items-center relative">
          <div className="relative inline-block">
            <h2 className="text-[24px] text-center font-nunito font-bold text-[#FFFFFF] mb-10 z-10 relative">
              Faça login para entrar no sistema.
            </h2>
          </div>
        </div>

        <div className="w-140 h-fit bg-[#FAFEFC] rounded-xl p-8 shadow-2xl border-4 border-[#759FFE] mb-22 z-10">
          <Login isLogin={true} />
        </div>
      </div>
    </div>
  );
}