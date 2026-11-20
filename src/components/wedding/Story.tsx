import { useState } from "react";
import { wedding, type StoryChapter } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { pickLang } from "@/lib/wedding-logic";
import { SafeImage } from "./SafeImage";
import { Reveal, SectionHeading } from "./ui";

/** Hidden entirely until real story chapters are added to the config. */
export function Story() {
  const { t, lang } = useI18n();
  const chapters = wedding.story.filter((c) => c.text.en.trim());
  if (chapters.length === 0) return null;
  return (
    <section aria-labelledby="story-title" className="bg-ivory px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="story-title" eyebrow={t.storyEyebrow} title={t.storyTitle} />
        <ol className="space-y-12">
          {chapters.map((c) => (
            <ChapterItem key={c.key} chapter={c} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A chapter whose photo is dropped (not shown broken) if the file can't be loaded. */
function ChapterItem({ chapter: c }: { chapter: StoryChapter }) {
  const { t, lang } = useI18n();
  const [photoFailed, setPhotoFailed] = useState(false);
  const hasPhoto = Boolean(c.photo) && !photoFailed;
  return (
    <li>
      <Reveal className="grid items-center gap-6 sm:grid-cols-2">
        {hasPhoto && (
          <SafeImage
            src={c.photo}
            alt=""
            loading="lazy"
            className="w-full rounded-2xl border border-gold/60 shadow-card"
            fallback={null}
            onFail={() => setPhotoFailed(true)}
          />
        )}
        <div className={hasPhoto ? "" : "text-center sm:col-span-2"}>
          <h3 className="font-display text-3xl font-semibold text-maroon">{t.story[c.key]}</h3>
          <p className="mt-3 text-lg leading-relaxed text-brown">{pickLang(c.text, lang)}</p>
        </div>
      </Reveal>
    </li>
  );
}
