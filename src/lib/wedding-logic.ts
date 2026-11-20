import type { GalleryPhoto, Lang, WeddingEvent } from "@/config/wedding";

const IST_OFFSET_MS = 330 * 60 * 1000;

/** An event is shown only when every guest-facing field is really filled in. */
export function isEventComplete(e: Partial<WeddingEvent> | null | undefined): e is WeddingEvent {
  if (!e) return false;
  const filled = (v?: Record<Lang, string>) => !!v && !!v.en?.trim() && !/\[.*\]/.test(v.en);
  return (
    !!e.startIso &&
    !Number.isNaN(Date.parse(e.startIso)) &&
    filled(e.title) &&
    filled(e.dateLabel) &&
    filled(e.timeLabel) &&
    filled(e.venue) &&
    !!e.mapsUrl &&
    /^https:\/\//.test(e.mapsUrl)
  );
}

/** Complete events, earliest first. */
export function visibleEvents(events: Array<Partial<WeddingEvent>>): WeddingEvent[] {
  return events
    .filter(isEventComplete)
    .slice()
    .sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
}

function istDateKey(ms: number) {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

export type CountdownState =
  | { status: "counting"; days: number; hours: number; minutes: number; seconds: number }
  | { status: "today" }
  | { status: "past" };

/** Never negative: once the ceremony starts it's "today" (IST day), afterwards "past". */
export function getCountdownState(nowMs: number, startIso: string): CountdownState {
  const start = Date.parse(startIso);
  const diff = start - nowMs;
  if (diff > 0) {
    const total = Math.floor(diff / 1000);
    return {
      status: "counting",
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  }
  return istDateKey(nowMs) === istDateKey(start) ? { status: "today" } : { status: "past" };
}

const DEFAULT_OPEN_ENDED_HOURS = 3;

function toUtcStamp(ms: number) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function eventTimes(e: WeddingEvent) {
  const start = Date.parse(e.startIso);
  const end = e.endIso ? Date.parse(e.endIso) : start + DEFAULT_OPEN_ENDED_HOURS * 3600 * 1000;
  return { start, end };
}

export interface CalendarText {
  title: string;
  description: string;
  location: string;
}

export function googleCalendarUrl(e: WeddingEvent, text: CalendarText) {
  const { start, end } = eventTimes(e);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: text.title,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: text.description,
    location: text.location,
    ctz: "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(e: WeddingEvent, text: CalendarText, nowMs = Date.now()) {
  const { start, end } = eventTimes(e);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Parthasarathi & Monica//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.id}-20261214@parthasarathi-monica`,
    `DTSTAMP:${toUtcStamp(nowMs)}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${icsEscape(text.title)}`,
    `DESCRIPTION:${icsEscape(text.description)}`,
    `LOCATION:${icsEscape(text.location)}`,
    `URL:${e.mapsUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(text.title)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(text.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function whatsappUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function galleryCategories(photos: GalleryPhoto[]) {
  const order: GalleryPhoto["category"][] = ["couple", "engagement", "family", "preWedding", "memories"];
  return order.filter((c) => photos.some((p) => p.category === c));
}

export function pickLang<T extends Record<Lang, string>>(v: T | undefined, lang: Lang) {
  return v ? v[lang] || v.en : "";
}
