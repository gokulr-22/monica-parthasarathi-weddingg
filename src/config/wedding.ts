/**
 * Wedding configuration — edit this file to update what guests see.
 *
 * Rules the site follows automatically:
 * - Any event missing a date, time, venue or map link is hidden (no placeholders).
 * - Events are shown in date order, whatever order they are listed here.
 * - Gallery categories with no photos are hidden; with no photos at all a gentle
 *   "coming soon" note is shown instead.
 * - Story, music and WhatsApp blessings stay hidden until filled in.
 */

import { ta } from "date-fns/locale/ta";

export type Lang = "en" | "ta";
export type Localized = Record<Lang, string>;

export interface WeddingEvent {
  id: string;
  kind: "wedding" | "reception";
  title: Localized;
  /** ISO 8601 with explicit +05:30 offset */
  startIso: string;
  /** Optional: leave undefined for "onwards" events */
  endIso?: string;
  dateLabel: Localized;
  dayLabel: Localized;
  timeLabel: Localized;
  venue: Localized;
  address?: Localized;
  mapsUrl: string;
  /** Exact auspicious Muhurtham time, only when confirmed by the family */
  muhurtham?: Localized;
}

export interface GalleryPhoto {
  src: string;
  alt: Localized;
  caption?: Localized;
  category: "couple" | "engagement" | "family" | "preWedding" | "memories";
  width: number;
  height: number;
}

export interface StoryChapter {
  key: "beginning" | "firstMemories" | "engagement" | "newJourney" | "weddingDay";
  text: Localized;
  photo?: string;
}

const VENUE: Localized = {
  en: "Bhavani Mahal Thirumana Mandapam",
  ta: "பவானி மஹால் திருமண மண்டபம்",
};
const VENUE_ADDRESS: Localized = {
  en: "Thotti, Thiruvandipuram, Tamil Nadu 607109",
  ta: "தொட்டி, திருவந்திபுரம், தமிழ்நாடு 607109",
};
// Direct Google Maps place link (resolved from the shared links; both point to Bhavani Mahal).
const VENUE_MAPS =
  "https://www.google.com/maps/place/Bhavani+Mahal/@11.7529462,79.7085197,17z/data=!4m6!3m5!1s0x3a54a3fd4d5e57f3:0x47a640ef04b7c4b2!8m2!3d11.7529462!4d79.7085197!16s%2Fg%2F11q41kf2wv";

export const wedding = {
  groom: { en: "Parthasarathi", ta: "பார்த்தசாரதி" } as Localized,
  bride: { en: "Monica", ta: "மோனிகா" } as Localized,
  timezone: "Asia/Kolkata",
  /** The ceremony the scratch card reveals and the countdown targets */
  mainEventId: "wedding",

  events: [
    {
      id: "wedding",
      kind: "wedding",
      title: { en: "Wedding Ceremony", ta: "திருமண விழா" },
      startIso: "2026-12-14T06:00:00+05:30",
      endIso: "2026-12-14T07:30:00+05:30",
      dateLabel: { en: "14 December 2026", ta: "14 டிசம்பர் 2026" },
      dayLabel: { en: "Monday", ta: "திங்கட்கிழமை" },
      timeLabel: { en: "6:00 AM – 7:30 AM", ta: "காலை 6:00 – 7:30" },
      venue: VENUE,
      address: VENUE_ADDRESS,
      mapsUrl: VENUE_MAPS,
    },
    {
      id: "reception",
      kind: "reception",
      title: { en: "Reception", ta: "திருமண வரவேற்பு" },
      startIso: "2026-12-13T18:30:00+05:30",
      dateLabel: { en: "13 December 2026", ta: "13 டிசம்பர் 2026" },
      dayLabel: { en: "Sunday", ta: "ஞாயிற்றுக்கிழமை" },
      timeLabel: { en: "6:30 PM onwards", ta: "மாலை 6:30 மணி முதல்" },
      venue: VENUE,
      address: VENUE_ADDRESS,
      mapsUrl: "https://maps.app.goo.gl/CM1Z3pmLp85TDRk56",
    },
  ] as WeddingEvent[],

  /** Digits only with country code, e.g. "918825479037". Empty string hides the button. */
  whatsappNumber: "918825479037",

  /** Royalty-free/licensed audio URL. null hides the music button. */
  musicUrl: null as string | null,

  /**
   * Optional link-preview image (WhatsApp/Facebook). Put a real JPG in /public and set e.g.
   * "/share.jpg", or a full https URL. null = no preview image is advertised.
   */
  shareImage: null as string | null,

  /** Add photos here (upload them first). Empty = tasteful "coming soon" note. */
  gallery: [
   {
    src: "/gallery/couple4.jpg",
    alt: {
      en: "A memorable couple photograph",
      ta: "மணமக்களின் நினைவுப் புகைப்படம்",
    },
    caption: {
      en: "A memory to cherish",
      ta: "நினைவில் என்றும் நிற்கும் தருணம்",
    },
    category: "memories",
    width: 1200,
    height: 1600,
  },
   {
    src: "/gallery/couple5.jpg",
    alt: {
      en: "A memorable couple photograph",
      ta: "மணமக்களின் நினைவுப் புகைப்படம்",
    },
    caption: {
      en: "A memory to live forever",
      ta: "நினைவில் என்றும் நிற்கும் தருணம்",
    },
    category: "memories",
    width: 1200,
    height: 1600,
  },
  {
    src: "/gallery/couple1.jpg",
    alt: {
      en: "A beautiful moment of the couple",
      ta: "மணமக்களின் அழகான தருணம்",
    },
    caption: {
      en: "A beautiful beginning ❤️",
      ta: "அழகான தொடக்கம் ❤️",
    },
    category: "couple",
    width: 1200,
    height: 1600,
  },
  {
    src: "/gallery/couple2.jpg",
    alt: {
      en: "Parthasarathi and Monica together",
      ta: "பார்த்தசாரதி மற்றும் மோனிகா ஒன்றாக",
    },
    caption: {
      en: "Together, forever",
      ta: "என்றென்றும் ஒன்றாக",
    },
    category: "couple",
    width: 1200,
    height: 1600,
  },
  {
    src: "/gallery/couple3.jpg",
    alt: {
      en: "A lovely moment between the couple",
      ta: "ஜோடியின் அழகான தருணம்",
    },
    caption: {
      en: "Little moments, big love ❤️",
      ta: "சிறிய தருணங்கள், பெரிய அன்பு ❤️",
    },
    category: "couple",
    width: 1200,
    height: 1600,
  },
  {
    src: "/gallery/ringexchange.jpg",
    alt: {
      en: "The ring exchange ceremony",
      ta: "மோதிரம் மாற்றும் நிகழ்ச்சி",
    },
    caption: {
      en: "A promise of forever 💍",
      ta: "என்றென்றும் ஒன்றாக இருப்பதற்கான வாக்குறுதி 💍",
    },
    category: "engagement",
    width: 1200,
    height: 1600,
  },
] as GalleryPhoto[],

  /** Add real story chapters here. Empty = section hidden. */
  story: [] as StoryChapter[],
};

export type WeddingConfig = typeof wedding;
