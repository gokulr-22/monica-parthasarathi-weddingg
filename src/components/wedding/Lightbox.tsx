import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { GalleryPhoto } from "@/config/wedding";
import { format, useI18n } from "@/lib/i18n";
import { pickLang } from "@/lib/wedding-logic";
import { cn } from "@/lib/utils";
import { PhotoPlaceholder, SafeImage } from "./SafeImage";

const iconBtn =
  "flex size-12 items-center justify-center rounded-full border border-gold-light/60 bg-maroon-deep/70 text-gold-light transition hover:bg-maroon focus-visible:outline-gold-light";

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const { t, lang } = useI18n();
  const [zoom, setZoom] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[index];
  const count = photos.length;
  const go = (d: number) => {
    setZoom(false);
    onIndex((index + d + count) % count);
  };

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!photo) return null;
  const caption = pickLang(photo.caption, lang);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.lightboxLabel}
      className="fixed inset-0 z-50 flex flex-col bg-maroon-deep/95 animate-in fade-in duration-300"
      onTouchStart={(e) => {
        const t0 = e.touches[0];
        if (t0) touch.current = { x: t0.clientX, y: t0.clientY };
      }}
      onTouchEnd={(e) => {
        const t1 = e.changedTouches[0];
        if (!touch.current || zoom || !t1) return;
        const dx = t1.clientX - touch.current.x;
        const dy = t1.clientY - touch.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-2 p-3 sm:p-5">
        <p className="font-label text-sm text-gold-light" aria-live="polite">
          {format(t.photoOf, { n: index + 1, total: count })}
        </p>
        <div className="flex gap-2">
          <button type="button" className={iconBtn} onClick={() => setZoom((z) => !z)} aria-label={zoom ? t.zoomOut : t.zoomIn}>
            {zoom ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </button>
          <button ref={closeRef} type="button" className={iconBtn} onClick={onClose} aria-label={t.close}>
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-2">
        <SafeImage
          key={photo.src}
          src={photo.src}
          alt={pickLang(photo.alt, lang)}
          width={photo.width}
          height={photo.height}
          onClick={() => setZoom((z) => !z)}
          className={cn(
            "max-h-full max-w-full rounded-lg object-contain shadow-card transition-transform duration-300 animate-in zoom-in-95",
            zoom ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
          )}
          fallback={<PhotoPlaceholder label={pickLang(photo.alt, lang)} width={photo.width} height={photo.height} className="max-h-full max-w-sm rounded-lg" />}
        />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t.prev} className={cn(iconBtn, "absolute left-2 top-1/2 -translate-y-1/2 sm:left-5")}>
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.next} className={cn(iconBtn, "absolute right-2 top-1/2 -translate-y-1/2 sm:right-5")}>
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
      <p className="min-h-14 px-4 py-4 text-center font-display text-lg italic text-ivory">{caption}</p>
    </div>
  );
}
