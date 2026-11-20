import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Blessings } from "@/components/wedding/Blessings";
import { Countdown } from "@/components/wedding/Countdown";
import { EventsTimeline } from "@/components/wedding/EventsTimeline";
import { FinalBlessings } from "@/components/wedding/FinalBlessings";
import { Gallery } from "@/components/wedding/Gallery";
import { Hero } from "@/components/wedding/Hero";
import { IntroScreen } from "@/components/wedding/IntroScreen";
import { InvitationMessage } from "@/components/wedding/InvitationMessage";
import { LanguageToggle } from "@/components/wedding/LanguageToggle";
import { MusicToggle } from "@/components/wedding/MusicToggle";
import { ScratchCard } from "@/components/wedding/ScratchCard";
import { Story } from "@/components/wedding/Story";
import { wedding } from "@/config/wedding";
import { I18nProvider } from "@/lib/i18n";
import { getRequestOrigin } from "@/lib/origin.functions";

const TITLE = "Parthasarathi & Monica – Wedding Invitation";
const DESCRIPTION =
  "With the blessings of our families, we invite you to celebrate the wedding of Parthasarathi & Monica.";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return { origin: await getRequestOrigin() };
    } catch {
      return { origin: "" };
    }
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const configured = wedding.shareImage;
    const image = configured ? (/^https?:\/\//.test(configured) ? configured : origin ? `${origin}${configured}` : null) : null;
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: origin ? `${origin}/` : "/" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: DESCRIPTION },
        ...(image
          ? [
              { property: "og:image", content: image },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:image:alt", content: "Parthasarathi & Monica wedding invitation in maroon and gold" },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
  component: Index,
});

function Index() {
  return (
    <I18nProvider>
      <WeddingInvitation />
    </I18nProvider>
  );
}

function WeddingInvitation() {
  const [introDone, setIntroDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const main = wedding.events.find((e) => e.id === wedding.mainEventId)!;

  return (
    <>
      {!introDone && <IntroScreen onDone={() => setIntroDone(true)} />}
      <div className="fixed bottom-4 right-3 z-40 sm:bottom-auto sm:right-5 sm:top-5">
        <LanguageToggle />
      </div>
      <main aria-hidden={!introDone || undefined} inert={!introDone || undefined}>
        <Hero />
        <ScratchCard revealed={revealed} onReveal={() => setRevealed(true)} />
        {revealed && <Countdown startIso={main.startIso} />}
        <InvitationMessage />
        <EventsTimeline />
        <Gallery />
        <Story />
        <Blessings />
      </main>
      <FinalBlessings />
      <MusicToggle />
    </>
  );
}
