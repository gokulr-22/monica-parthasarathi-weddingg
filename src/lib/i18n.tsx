import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/config/wedding";

const en = {
  langToggleLabel: "Choose language",
  blessingsOfFamilies: "With the blessings of our families",
  joyfullyInvite: "We joyfully invite you to celebrate our wedding",
  openInvitation: "Open Our Wedding Invitation",
  skipIntro: "Skip Intro",
  specialDate: "A special date awaits you…",
  scratchToReveal: "Scratch to reveal our wedding date",
  scratchHere: "Scratch here",
  revealWithout: "Reveal date without scratching",
  scratchAria: "Scratch card. Our wedding date is: Monday, 14 December 2026, Wedding Ceremony.",
  dateRevealed: "Save the date",
  countdownTitle: "Counting down to our wedding",
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
  todayIsTheDay: "Today is the day!",
  thankYou: "Thank you for celebrating with us",
  inviteHeading: "An Invitation",
  invitePara1:
    "With immense joy and the blessings of our families, we invite you to join us in celebrating the sacred union of Parthasarathi and Monica.",
  invitePara2: "Your presence and blessings will make this special occasion even more memorable.",
  eventsEyebrow: "Wedding celebrations",
  eventsTitle: "Join Us",
  date: "Date",
  time: "Time",
  venue: "Venue",
  muhurtham: "Muhurtham",
  getDirections: "Get Directions",
  opensNewTab: "(opens in a new tab)",
  addToGoogle: { wedding: "Add Wedding to Google Calendar", reception: "Add Reception to Google Calendar" },
  downloadIcs: { wedding: "Download Wedding Calendar Event", reception: "Download Reception Calendar Event" },
  calendarTitle: { wedding: "Parthasarathi & Monica Wedding Ceremony", reception: "Parthasarathi & Monica Wedding Reception" },
  calendarDescription:
    "With the blessings of our families, we joyfully invite you to celebrate the wedding of Parthasarathi & Monica.",
  galleryEyebrow: "Cherished moments",
  galleryTitle: "Our Gallery",
  galleryAll: "All",
  galleryEmpty: "Our photographs will be shared here soon.",
  galleryCategory: {
    couple: "Couple",
    engagement: "Engagement",
    family: "Family",
    preWedding: "Pre-Wedding",
    memories: "Special Memories",
  },
  openPhoto: "Open photo",
  photoUnavailable: "Photo unavailable",
  lightboxLabel: "Photo viewer",
  prev: "Previous photo",
  next: "Next photo",
  close: "Close photo viewer",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  photoOf: "Photo {n} of {total}",
  storyEyebrow: "Our journey",
  storyTitle: "Our Story",
  story: {
    beginning: "The Beginning",
    firstMemories: "First Memories",
    engagement: "Engagement",
    newJourney: "A New Journey",
    weddingDay: "The Wedding Day",
  },
  blessingsTitle: "Your blessings mean the world to us",
  blessingsMessageLabel: "Your message — feel free to edit it",
  blessingsDefault:
    "Congratulations Parthasarathi and Monica! Wishing you both a lifetime of happiness, love, and togetherness.",
  sendBlessings: "Send Your Blessings",
  sendBlessingsHint: "Opens WhatsApp with your message",
  finalLine: "Your presence and blessings mean the world to us.",
  withLove: "With love and happiness,",
  musicOn: "Play music",
  musicOff: "Pause music",
};

type Dict = typeof en;

const ta: Dict = {
  langToggleLabel: "மொழியைத் தேர்ந்தெடுக்கவும்",
  blessingsOfFamilies: "எங்கள் குடும்பத்தினரின் ஆசீர்வாதத்துடன்",
  joyfullyInvite: "எங்கள் திருமண விழாவில் கலந்துகொள்ள உங்களை அன்புடன் அழைக்கிறோம்",
  openInvitation: "எங்கள் திருமண அழைப்பிதழைத் திறக்கவும்",
  skipIntro: "அறிமுகத்தைத் தவிர்க்கவும்",
  specialDate: "ஒரு சிறப்பு நாள் உங்களுக்காகக் காத்திருக்கிறது…",
  scratchToReveal: "எங்கள் திருமண நாளை அறிய சுரண்டவும்",
  scratchHere: "இங்கே சுரண்டவும்",
  revealWithout: "சுரண்டாமல் தேதியைக் காண்க",
  scratchAria: "சுரண்டும் அட்டை. எங்கள் திருமண நாள்: திங்கட்கிழமை, 14 டிசம்பர் 2026, திருமண விழா.",
  dateRevealed: "இந்த நாளை நினைவில் கொள்ளுங்கள்",
  countdownTitle: "எங்கள் திருமணத்திற்கு இன்னும்",
  days: "நாட்கள்",
  hours: "மணி",
  minutes: "நிமிடங்கள்",
  seconds: "வினாடிகள்",
  todayIsTheDay: "இன்றுதான் அந்த இனிய நாள்!",
  thankYou: "எங்களுடன் கொண்டாடியதற்கு நன்றி",
  inviteHeading: "அன்பான அழைப்பு",
  invitePara1:
    "பெருமகிழ்ச்சியுடனும் எங்கள் குடும்பத்தினரின் ஆசீர்வாதத்துடனும், பார்த்தசாரதி – மோனிகா ஆகியோரின் புனிதத் திருமண விழாவில் கலந்துகொண்டு கொண்டாட உங்களை அன்புடன் அழைக்கிறோம்.",
  invitePara2: "உங்கள் வருகையும் ஆசீர்வாதமும் இந்தச் சிறப்பான நிகழ்வை மேலும் மறக்க முடியாததாக்கும்.",
  eventsEyebrow: "திருமண நிகழ்வுகள்",
  eventsTitle: "அன்புடன் வருக",
  date: "தேதி",
  time: "நேரம்",
  venue: "இடம்",
  muhurtham: "முகூர்த்தம்",
  getDirections: "வழி காண்க",
  opensNewTab: "(புதிய தாவலில் திறக்கும்)",
  addToGoogle: { wedding: "திருமணத்தை Google நாட்காட்டியில் சேர்க்கவும்", reception: "வரவேற்பை Google நாட்காட்டியில் சேர்க்கவும்" },
  downloadIcs: { wedding: "திருமண நாட்காட்டி நிகழ்வைப் பதிவிறக்கவும்", reception: "வரவேற்பு நாட்காட்டி நிகழ்வைப் பதிவிறக்கவும்" },
  calendarTitle: { wedding: "பார்த்தசாரதி & மோனிகா திருமண விழா", reception: "பார்த்தசாரதி & மோனிகா திருமண வரவேற்பு" },
  calendarDescription:
    "எங்கள் குடும்பத்தினரின் ஆசீர்வாதத்துடன், பார்த்தசாரதி & மோனிகா திருமண விழாவில் கலந்துகொள்ள உங்களை அன்புடன் அழைக்கிறோம்.",
  galleryEyebrow: "இனிய தருணங்கள்",
  galleryTitle: "புகைப்படத் தொகுப்பு",
  galleryAll: "அனைத்தும்",
  galleryEmpty: "எங்கள் புகைப்படங்கள் விரைவில் இங்கே பகிரப்படும்.",
  galleryCategory: {
    couple: "தம்பதியர்",
    engagement: "நிச்சயதார்த்தம்",
    family: "குடும்பம்",
    preWedding: "திருமணத்திற்கு முன்",
    memories: "சிறப்பு நினைவுகள்",
  },
  openPhoto: "புகைப்படத்தைத் திறக்கவும்",
  photoUnavailable: "புகைப்படம் கிடைக்கவில்லை",
  lightboxLabel: "புகைப்படக் காட்சி",
  prev: "முந்தைய புகைப்படம்",
  next: "அடுத்த புகைப்படம்",
  close: "புகைப்படக் காட்சியை மூடவும்",
  zoomIn: "பெரிதாக்கவும்",
  zoomOut: "சிறிதாக்கவும்",
  photoOf: "புகைப்படம் {n} / {total}",
  storyEyebrow: "எங்கள் பயணம்",
  storyTitle: "எங்கள் கதை",
  story: {
    beginning: "தொடக்கம்",
    firstMemories: "முதல் நினைவுகள்",
    engagement: "நிச்சயதார்த்தம்",
    newJourney: "புதிய பயணம்",
    weddingDay: "திருமண நாள்",
  },
  blessingsTitle: "உங்கள் ஆசீர்வாதங்கள் எங்களுக்கு விலைமதிப்பற்றவை",
  blessingsMessageLabel: "உங்கள் செய்தி — விருப்பம்போல் மாற்றலாம்",
  blessingsDefault:
    "பார்த்தசாரதி மற்றும் மோனிகாவுக்கு இனிய திருமண வாழ்த்துகள்! நீங்கள் இருவரும் வாழ்நாள் முழுவதும் மகிழ்ச்சியுடனும் அன்புடனும் ஒற்றுமையுடனும் வாழ வாழ்த்துகிறேன்.",
  sendBlessings: "உங்கள் வாழ்த்துகளை அனுப்புங்கள்",
  sendBlessingsHint: "உங்கள் செய்தியுடன் WhatsApp திறக்கும்",
  finalLine: "உங்கள் வருகையும் ஆசீர்வாதமும் எங்களுக்கு மிகவும் முக்கியமானவை.",
  withLove: "அன்புடனும் மகிழ்ச்சியுடனும்,",
  musicOn: "இசையை இயக்கவும்",
  musicOff: "இசையை நிறுத்தவும்",
};

export const dictionaries: Record<Lang, Dict> = { en, ta };

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("wedding-lang");
    if (saved === "ta" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("wedding-lang", lang);
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function format(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
