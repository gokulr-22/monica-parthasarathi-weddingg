import { useMemo, useState } from "react";
import { Camera } from "lucide-react";
import { wedding, type GalleryPhoto } from "@/config/wedding";
import { useI18n } from "@/lib/i18n";
import { galleryCategories, pickLang } from "@/lib/wedding-logic";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";
import { PhotoPlaceholder, SafeImage } from "./SafeImage";
import { KolamMotif, Reveal, SectionHeading } from "./ui";

export function Gallery({ photos = wedding.gallery }: { photos?: GalleryPhoto[] }) {
  const { t, lang } = useI18n();
  const categories = galleryCategories(photos);
  const [filter, setFilter] = useState<GalleryPhoto["category"] | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const shown = useMemo(() => (filter === "all" ? photos : photos.filter((p) => p.category === filter)), [photos, filter]);

  return (
    <section aria-labelledby="gallery-title" className="bg-warm-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="gallery-title" eyebrow={t.galleryEyebrow} title={t.galleryTitle} />

        {photos.length === 0 ? (
          <Reveal className="gold-frame mx-auto flex max-w-lg flex-col items-center rounded-3xl bg-ivory px-6 py-12 text-center shadow-card">
            <KolamMotif className="size-16" />
            <Camera className="mt-4 size-6 text-gold-deep" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl italic text-maroon">{t.galleryEmpty}</p>
          </Reveal>
        ) : (
          <>
            {categories.length > 1 && (
              <div role="group" aria-label={t.galleryTitle} className="mb-8 flex flex-wrap justify-center gap-2">
                {(["all", ...categories] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={filter === c}
                    onClick={() => setFilter(c)}
                    className={cn(
                      "min-h-10 rounded-full border px-4 font-label text-xs font-semibold uppercase tracking-wider transition",
                      filter === c ? "border-maroon bg-maroon text-ivory" : "border-gold bg-warm-white text-maroon hover:bg-ivory-deep",
                    )}
                  >
                    {c === "all" ? t.galleryAll : t.galleryCategory[c]}
                  </button>
                ))}
              </div>
            )}

            {/* Uniform grid: every photo sits in the same 4:5 frame and is cropped to fit. */}
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {shown.map((p, i) => (
                <li key={p.src} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={`${t.openPhoto}: ${pickLang(p.alt, lang)}`}
                    className="group block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-gold/60 shadow-card"
                  >
                    <SafeImage
                      src={p.src}
                      alt={pickLang(p.alt, lang)}
                      width={p.width}
                      height={p.height}
                      decoding="async"
                      className="block h-full w-full object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-105"
                      fallback={<PhotoPlaceholder label={pickLang(p.alt, lang)} className="h-full" />}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {open !== null && <Lightbox photos={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}