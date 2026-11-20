import { useEffect, useState } from "react";
import { getCountdownState, type CountdownState } from "@/lib/wedding-logic";
import { useI18n } from "@/lib/i18n";
import { OrnamentDivider } from "./ui";

export function Countdown({ startIso }: { startIso: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    const tick = () => setState(getCountdownState(Date.now(), startIso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startIso]);

  if (!state) return null;

  return (
    <section aria-labelledby="countdown-title" className="bg-ivory px-5 pb-20">
      <div className="mx-auto max-w-2xl text-center">
        {state.status === "counting" ? (
          <>
            <h2 id="countdown-title" className="font-label text-sm font-bold uppercase tracking-[0.25em] text-gold-deep">
              {t.countdownTitle}
            </h2>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4" role="timer" aria-live="off">
              {(
                [
                  [state.days, t.days],
                  [state.hours, t.hours],
                  [state.minutes, t.minutes],
                  [state.seconds, t.seconds],
                ] as const
              ).map(([value, label]) => (
                <div key={label} className="gold-frame rounded-2xl bg-warm-white px-1 py-4 shadow-card sm:py-6">
                  <div className="font-display text-3xl font-bold tabular-nums text-maroon sm:text-5xl">
                    {String(value).padStart(2, "0")}
                  </div>
                  <div className="mt-1 font-label text-[0.62rem] font-semibold uppercase tracking-widest text-brown sm:text-xs">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h2 id="countdown-title" className="font-display text-4xl font-semibold text-maroon sm:text-5xl">
            {state.status === "today" ? t.todayIsTheDay : t.thankYou}
          </h2>
        )}
        <OrnamentDivider className="mt-8" />
      </div>
    </section>
  );
}
