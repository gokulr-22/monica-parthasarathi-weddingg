import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const opts = [
    { code: "en" as const, label: "English" },
    { code: "ta" as const, label: "தமிழ்" },
  ];
  return (
    <div
      role="group"
      aria-label={t.langToggleLabel}
      className={cn(
        "inline-flex items-center rounded-full border p-1 text-sm shadow-card backdrop-blur",
        onDark ? "border-gold-light/60 bg-maroon-deep/60" : "border-gold bg-warm-white/90",
      )}
    >
      {opts.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            lang={o.code}
            aria-pressed={active}
            onClick={() => setLang(o.code)}
            className={cn(
              "min-h-9 rounded-full px-3 text-xs font-semibold transition-colors sm:text-sm",
              o.code === "ta" ? "font-tamil" : "font-label tracking-wider",
              active
                ? onDark
                  ? "bg-gold-foil text-maroon-deep"
                  : "bg-maroon text-ivory"
                : onDark
                  ? "text-gold-light hover:text-ivory"
                  : "text-maroon hover:bg-ivory-deep",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
