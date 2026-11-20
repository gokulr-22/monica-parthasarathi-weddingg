import { FloralCorner } from "./ornaments";
import { useI18n } from "@/lib/i18n";
import { OrnamentDivider, Reveal } from "./ui";

export function InvitationMessage() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="invite-title" className="relative overflow-hidden bg-warm-white px-5 py-20 sm:py-28">
      <FloralCorner className="absolute left-0 top-0 w-40 sm:w-72" />
      <FloralCorner className="absolute bottom-0 right-0 w-40 -scale-100 sm:w-72" />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <h2 id="invite-title" className="font-label text-sm font-bold uppercase tracking-[0.3em] text-gold-deep">
          {t.inviteHeading}
        </h2>
        <OrnamentDivider className="mt-4" />
        <p className="mt-8 font-display text-2xl leading-relaxed text-brown sm:text-3xl">“{t.invitePara1}</p>
        <p className="mt-6 font-display text-xl italic leading-relaxed text-maroon sm:text-2xl">{t.invitePara2}”</p>
        <OrnamentDivider className="mt-10" />
      </Reveal>
    </section>
  );
}
