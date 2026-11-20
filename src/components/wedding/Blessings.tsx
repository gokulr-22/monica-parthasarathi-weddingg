import { useEffect, useState } from "react";
import { MessageCircleHeart } from "lucide-react";
import { wedding } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/wedding-logic";
import { Reveal, SectionHeading, weddingButton } from "./ui";

export function Blessings() {
  const { t } = useI18n();
  const [message, setMessage] = useState(t.blessingsDefault);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (!edited) setMessage(t.blessingsDefault);
  }, [t.blessingsDefault, edited]);

  const href = whatsappUrl(wedding.whatsappNumber, message);
  if (!whatsappUrl(wedding.whatsappNumber, "x")) return null;

  return (
    <section aria-labelledby="blessings-title" className="kolam-bg bg-ivory px-5 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-xl">
        <SectionHeading id="blessings-title" title={t.blessingsTitle} />
        <div className="gold-frame rounded-3xl bg-warm-white px-5 py-7 shadow-card sm:px-8">
          <label htmlFor="blessing-message" className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
            {t.blessingsMessageLabel}
          </label>
          <textarea
            id="blessing-message"
            rows={4}
            value={message}
            onChange={(e) => {
              setEdited(true);
              setMessage(e.target.value);
            }}
            className="mt-3 w-full resize-y rounded-xl border border-gold bg-ivory px-4 py-3 text-base leading-relaxed text-brown focus-visible:outline-maroon"
          />
          <a
            href={href ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={weddingButton({ variant: "maroon", size: "lg", className: "mt-5 w-full" })}
          >
            <MessageCircleHeart aria-hidden="true" />
            {t.sendBlessings}
          </a>
          <p className="mt-3 text-center text-sm text-muted-foreground">{t.sendBlessingsHint}</p>
        </div>
      </Reveal>
    </section>
  );
}
