export default function MobileRibbon() {
  const items = [
    "Trilha adaptativa",
    "Questões reais do ENEM",
    "Simulados com cronômetro",
    "Redação corrigida por IA",
    "Mentorina 24h",
  ]

  return (
    <section
      id="mobile-ribbon"
      className="w-full h-[47px] bg-[#C6F432] border-y border-[#17152E]/10 overflow-hidden flex items-center relative text-[#17152E] select-none pointer-events-none"
    >
      <div className="animate-marquee flex items-center gap-0 font-bold text-xs uppercase tracking-wider shrink-0 pointer-events-none select-none">
        {[1, 2].map((half) => (
          <div key={half} className="flex items-center shrink-0">
            {[1, 2, 3].map((rep) => (
              <div key={rep} className="flex items-center gap-5 pr-5 shrink-0">
                {items.map((text, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-5 shrink-0 whitespace-nowrap"
                  >
                    <span>{text}</span>
                    <span className="text-[10px] opacity-60">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
