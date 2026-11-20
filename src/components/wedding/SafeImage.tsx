import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { KolamMotif } from "./ui";

/**
 * <img> that swaps to `fallback` if the file is missing or fails to decode.
 * Also catches images that failed before React hydrated (their onError never fires).
 */
export function SafeImage({
  fallback,
  onFail,
  src,
  alt,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { fallback: ReactNode; onFail?: () => void }) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0 && src) setFailed(true);
  }, [src]);

  useEffect(() => {
    if (failed) onFail?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);

  if (failed) return <>{fallback}</>;
  return <img ref={ref} src={src} alt={alt} onError={() => setFailed(true)} {...rest} />;
}

/** Elegant stand-in for a photo that cannot load: ivory tile, gold frame, kolam, and the alt text. */
export function PhotoPlaceholder({
  label,
  width,
  height,
  className = "",
}: {
  label?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const ratio = width && height ? `${width} / ${height}` : "4 / 5";
  return (
    <div
      role="img"
      aria-label={label ? `${label} – ${t.photoUnavailable}` : t.photoUnavailable}
      style={{ aspectRatio: ratio }}
      className={`gold-frame kolam-bg flex w-full flex-col items-center justify-center gap-2 bg-ivory p-4 text-center ${className}`}
    >
      <KolamMotif className="size-12 opacity-80" />
      {label && <p className="line-clamp-3 font-display text-lg italic leading-snug text-maroon">{label}</p>}
      <p className="font-label text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">{t.photoUnavailable}</p>
    </div>
  );
}
