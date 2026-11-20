import { useEffect, useRef, useState } from "react";
import { MailOpen } from "lucide-react";
import { wedding } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";
import { InvitationCardArt } from "./ornaments";
import { usePrefersReducedMotion, weddingButton } from "./ui";

export function IntroScreen({ onDone }: { onDone: () => void }) {
  const { t, lang } = useI18n();
  const [opening, setOpening] = useState(false);
  const reduced = usePrefersReducedMotion();
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;

    html.style.overflow = "hidden";
    openRef.current?.focus({ preventScroll: true });

    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const open = () => {
    if (opening) return;

    if (reduced) {
      return onDone();
    }

    setOpening(true);
    window.setTimeout(onDone, 650);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-names"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-maroon-silk px-4 py-16"
    >
      {/* Language toggle */}
      <div className="fixed left-3 top-3 z-10 sm:left-5 sm:top-5">
        <LanguageToggle onDark />
      </div>

      {/* Skip intro */}
      <button
        type="button"
        onClick={onDone}
        className={cn(
          weddingButton({ variant: "ghostLight", size: "sm" }),
          "fixed right-3 top-3 z-10 sm:right-5 sm:top-5"
        )}
      >
        {t.skipIntro}
      </button>

      {/* Invitation card and button */}
      <div
        className={cn(
          "flex flex-col items-center",
          opening ? "animate-invite-open" : "animate-card-in"
        )}
      >
        {/* Invitation card */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-card"
          style={{
            width: "min(88vw, 400px, calc((100svh - 190px) * 0.6667))",
            aspectRatio: "2 / 3",
          }}
        >
          {/* Card background artwork */}
          <InvitationCardArt className="absolute inset-0 h-full w-full" />

          {/* Gold shimmer */}
          <div
            className="gold-shimmer absolute inset-0 opacity-40"
            aria-hidden="true"
          />

          {/* Invitation text */}
          <div className="absolute inset-x-[4%] bottom-[12%] top-[26%] flex flex-col items-center justify-center text-center">
            <p className="font-label text-[clamp(0.6rem,2.6vw,0.8rem)] font-semibold uppercase leading-relaxed tracking-[0.22em] text-gold-light">
              {t.blessingsOfFamilies}
            </p>

            <h1
              id="intro-names"
              className="mt-[8%] w-full font-display font-semibold leading-none text-ivory"
            >
              {/* Groom */}
              <span
                className={cn(
                  "block w-full",
                  lang === "ta"
                    ? "text-[clamp(1.4rem,6vw,2.4rem)]"
                    : "text-[clamp(1.2rem,5.5vw,2.2rem)] uppercase"
                )}
              >
                {wedding.groom[lang]}
              </span>

              {/* And */}
              <span className="my-2 block font-display text-[clamp(1.8rem,8vw,2.8rem)] italic text-gold">
                &amp;
              </span>

              {/* Bride */}
              <span
                className={cn(
                  "block w-full",
                  lang === "ta"
                    ? "text-[clamp(1.4rem,6vw,2.4rem)]"
                    : "text-[clamp(1.2rem,5.5vw,2.2rem)] uppercase"
                )}
              >
                {wedding.bride[lang]}
              </span>
            </h1>

            {/* Invitation message */}
            <p className="mt-[9%] font-label text-[clamp(0.6rem,2.6vw,0.8rem)] font-semibold uppercase leading-relaxed tracking-[0.18em] text-gold-light">
              {t.joyfullyInvite}
            </p>
          </div>
        </div>

        {/* Open invitation button */}
        <button
          ref={openRef}
          type="button"
          onClick={open}
          className={cn(
            weddingButton({ variant: "gold" }),
            "mt-6 max-w-[88vw] sm:min-h-14 sm:px-8 sm:text-base"
          )}
        >
          <MailOpen aria-hidden="true" />
          {t.openInvitation}
        </button>
      </div>
    </div>
  );
}