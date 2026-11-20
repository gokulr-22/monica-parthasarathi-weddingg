import { wedding } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FloralCorner, KolamBand, KuthuVilakku, MangoToran } from "./ornaments";
import { OrnamentDivider } from "./ui";

function Corner({ className }: { className: string }) {
  return <FloralCorner className={cn("absolute w-[46vw] max-w-[360px]", className)} />;
}

export function Hero() {
  const { t, lang } = useI18n();
  const nameSize = lang === "ta" ? "text-[clamp(1.9rem,8.2vw,4.25rem)]" : "text-[clamp(1.75rem,8vw,4.5rem)]";
  return (
    <section aria-labelledby="hero-names" className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-ivory-glow px-5 py-24">
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 -scale-x-100" />
      <Corner className="bottom-0 left-0 -scale-y-100" />
      <Corner className="bottom-0 right-0 -scale-100" />

      <MangoToran className="absolute inset-x-0 top-0 z-[5] h-14 w-full sm:h-20 lg:h-24" />
      <KolamBand className="absolute inset-x-0 bottom-2 mx-auto w-[70%] max-w-xl" />

      <KuthuVilakku className="absolute left-[3%] top-1/2 hidden h-auto w-24 -translate-y-1/2 lg:block xl:w-28" />
      <KuthuVilakku className="absolute right-[3%] top-1/2 hidden h-auto w-24 -translate-y-1/2 lg:block xl:w-28" />

      <div className="gold-frame relative z-10 w-full max-w-3xl rounded-[2rem] bg-warm-white/80 px-4 py-12 text-center shadow-card sm:px-12 sm:py-16">
        <p className="font-label text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep sm:text-sm">
          {t.blessingsOfFamilies}
        </p>
        <OrnamentDivider className="mt-5" />
        <h1 id="hero-names" className="mt-6 font-display font-semibold leading-[0.95] text-maroon">
          <span className={cn("block", nameSize, lang === "en" && "uppercase")}>{wedding.groom[lang]}</span>
          <span className="my-2 block text-[clamp(2.2rem,8vw,3.8rem)] italic text-gold-deep">&amp;</span>
          <span className={cn("block", nameSize, lang === "en" && "uppercase")}>{wedding.bride[lang]}</span>
        </h1>
        <OrnamentDivider className="mt-7" />
        <p className="mx-auto mt-5 max-w-md font-label text-sm font-semibold uppercase leading-relaxed tracking-[0.18em] text-brown sm:text-base">
          {t.joyfullyInvite}
        </p>
        <KuthuVilakku className="mx-auto mt-6 h-auto w-14 lg:hidden" />
      </div>
    </section>
  );
}
