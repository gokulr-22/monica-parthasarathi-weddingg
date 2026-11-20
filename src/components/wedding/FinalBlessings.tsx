import { wedding } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { FloralCorner, KolamBand, KuthuVilakku, MangoToran } from "./ornaments";
import { KolamMotif, OrnamentDivider, Reveal } from "./ui";

export function FinalBlessings() {
  const { t, lang } = useI18n();
  return (
    <footer className="relative overflow-hidden bg-ivory-glow px-5 pb-16 pt-24 text-center">
      <FloralCorner className="absolute left-0 top-0 w-36 sm:w-60" />
      <FloralCorner className="absolute right-0 top-0 w-36 -scale-x-100 sm:w-60" />
      <MangoToran className="absolute inset-x-0 top-0 z-[5] h-12 w-full sm:h-16" swags={4} />
      <Reveal className="relative mx-auto max-w-2xl">
        <KuthuVilakku className="mx-auto h-auto w-20 sm:w-24" />
        <p className="mt-6 font-display text-3xl font-medium leading-snug text-maroon sm:text-4xl">{t.finalLine}</p>
        <OrnamentDivider className="mt-8" />
        <p className="mt-8 font-display text-xl italic text-brown sm:text-2xl">{t.withLove}</p>
       <p className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">
  {lang === "ta" ? "பார்த்தா" : "Partha"}{" "}
  <span className="italic text-gold-deep">&amp;</span>{" "}
  {lang === "ta" ? "மோனி" : "Moni"}
</p>
        <div className="mt-12 flex items-center justify-center gap-4 text-gold-deep" aria-hidden="true">
          <span className="h-px w-16 bg-gold sm:w-28" />
          <KolamMotif className="size-12" />
          <span className="h-px w-16 bg-gold sm:w-28" />
        </div>
      </Reveal>
      <KolamBand className="relative mx-auto mt-10 w-[80%] max-w-md" />
    </footer>
  );
}
