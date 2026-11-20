import { CalendarDays, CalendarPlus, Clock, Download, MapPin, Navigation, Sparkles, Sun } from "lucide-react";
import { wedding, type WeddingEvent } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { buildIcs, googleCalendarUrl, pickLang, visibleEvents, type CalendarText } from "@/lib/wedding-logic";
import { cn } from "@/lib/utils";
import { KolamMotif, Reveal, SectionHeading, weddingButton } from "./ui";

function useCalendarText(e: WeddingEvent): CalendarText {
  const { t, lang } = useI18n();
  const venue = pickLang(e.venue, lang);
  const address = pickLang(e.address, lang);
  return {
    title: t.calendarTitle[e.kind],
    description: `${t.calendarDescription}\n\n${pickLang(e.dateLabel, lang)}, ${pickLang(e.timeLabel, lang)} (IST)\n${venue}\n${e.mapsUrl}`,
    location: address ? `${venue}, ${address}` : venue,
  };
}

function downloadIcs(e: WeddingEvent, text: CalendarText) {
  const blob = new Blob([buildIcs(e, text)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parthasarathi-monica-${e.kind}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EventCard({ event }: { event: WeddingEvent }) {
  const { t, lang } = useI18n();
  const cal = useCalendarText(event);
  const main = event.kind === "wedding";
  const Icon = main ? Sun : Sparkles;
  const address = pickLang(event.address, lang);

  return (
    <li className="relative pl-14 sm:pl-20">
      <span
        className="absolute left-0 top-6 flex size-11 items-center justify-center rounded-full border-2 border-gold bg-maroon text-gold-light shadow-gold sm:left-2 sm:size-12"
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>
      <Reveal>
        <article
          aria-labelledby={`event-${event.id}`}
          className={cn(
            "gold-frame rounded-3xl px-5 py-7 shadow-card sm:px-9 sm:py-9",
            main ? "bg-warm-white" : "bg-ivory",
          )}
        >
          <p className="font-label text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
            {wedding.groom[lang]} &amp; {wedding.bride[lang]}
          </p>
          <h3 id={`event-${event.id}`} className="mt-2 font-display text-3xl font-semibold text-maroon sm:text-4xl">
            {pickLang(event.title, lang)}
          </h3>

          <dl className="mt-6 space-y-4 text-base sm:text-lg">
            <div className="flex gap-3">
              <dt className="mt-0.5 text-gold-deep">
                <CalendarDays className="size-5" aria-hidden="true" />
                <span className="sr-only">{t.date}</span>
              </dt>
              <dd className="font-semibold text-brown">
                {pickLang(event.dayLabel, lang)}, {pickLang(event.dateLabel, lang)}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="mt-0.5 text-gold-deep">
                <Clock className="size-5" aria-hidden="true" />
                <span className="sr-only">{t.time}</span>
              </dt>
              <dd className="font-semibold text-brown">{pickLang(event.timeLabel, lang)}</dd>
            </div>
            {event.muhurtham && (
              <div className="flex gap-3">
                <dt className="font-label text-sm font-bold text-maroon">{t.muhurtham}:</dt>
                <dd className="font-semibold text-brown">{pickLang(event.muhurtham, lang)}</dd>
              </div>
            )}
            <div className="flex gap-3">
              <dt className="mt-0.5 text-gold-deep">
                <MapPin className="size-5" aria-hidden="true" />
                <span className="sr-only">{t.venue}</span>
              </dt>
              <dd className="text-brown">
                <span className="block font-semibold">{pickLang(event.venue, lang)}</span>
                {address && <span className="mt-0.5 block text-muted-foreground">{address}</span>}
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className={weddingButton({ variant: "maroon" })}>
              <Navigation aria-hidden="true" />
              {t.getDirections}
              <span className="sr-only"> {t.opensNewTab}</span>
            </a>
            <a
              href={googleCalendarUrl(event, cal)}
              target="_blank"
              rel="noopener noreferrer"
              className={weddingButton({ variant: "outline", size: "sm" })}
            >
              <CalendarPlus aria-hidden="true" />
              {t.addToGoogle[event.kind]}
              <span className="sr-only"> {t.opensNewTab}</span>
            </a>
            <button type="button" onClick={() => downloadIcs(event, cal)} className={weddingButton({ variant: "outline", size: "sm" })}>
              <Download aria-hidden="true" />
              {t.downloadIcs[event.kind]}
            </button>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

export function EventsTimeline() {
  const { t } = useI18n();
  const events = visibleEvents(wedding.events);
  if (events.length === 0) return null;
  return (
    <section aria-labelledby="events-title" className="relative bg-ivory-glow px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="events-title" eyebrow={t.eventsEyebrow} title={t.eventsTitle} />
        <div className="relative">
          <span
            className="absolute bottom-6 left-[21px] top-6 w-0.5 bg-gradient-to-b from-gold via-gold-deep to-gold sm:left-[31px]"
            aria-hidden="true"
          />
          <ol className="relative space-y-10">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </ol>
        </div>
        <KolamMotif className="mx-auto mt-12 size-14" />
      </div>
    </section>
  );
}
