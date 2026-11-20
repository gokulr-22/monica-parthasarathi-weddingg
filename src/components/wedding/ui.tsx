import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const weddingButton = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-label text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        maroon:
          "bg-maroon text-ivory shadow-card hover:bg-maroon-deep hover:-translate-y-0.5 border border-gold/60",
        gold: "bg-gold-foil text-maroon-deep shadow-gold hover:brightness-105 hover:-translate-y-0.5",
        outline:
          "border-2 border-maroon/80 bg-warm-white text-maroon hover:bg-maroon hover:text-ivory",
        ghostLight:
          "border border-gold-light/70 bg-maroon-deep/40 text-gold-light hover:bg-maroon-deep/70",
      },
      size: {
        default: "",
        sm: "min-h-10 px-4 py-2 text-xs",
        lg: "min-h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "maroon", size: "default" },
  },
);

export type WeddingButtonVariants = VariantProps<typeof weddingButton>;

/** Gold ornamental divider with a lotus-diamond centre. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 28"
      className={cn("mx-auto h-6 w-64 max-w-full text-gold-deep", className)}
      aria-hidden="true"
      fill="none"
    >
      <path d="M2 14h110M208 14h110" stroke="currentColor" strokeWidth="1.2" />
      <path d="M40 14h70M210 14h70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".35" />
      <circle cx="118" cy="14" r="2.5" fill="currentColor" />
      <circle cx="202" cy="14" r="2.5" fill="currentColor" />
      <path d="M160 2l10 12-10 12-10-12z" fill="currentColor" />
      <path d="M160 7l5.5 7-5.5 7-5.5-7z" fill="var(--ivory)" />
      <path d="M128 14c8-9 16-9 22 0-6 9-14 9-22 0zM192 14c-8-9-16-9-22 0 6 9 14 9 22 0z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Small kolam-style motif. */
export function KolamMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("text-gold-deep", className)} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="1.4">
        <path d="M32 4c8 8 8 16 0 28-8-12-8-20 0-28zM32 60c-8-8-8-16 0-28 8 12 8 20 0 28zM4 32c8-8 16-8 28 0-12 8-20 8-28 0zM60 32c-8 8-16 8-28 0 12-8 20-8 28 0z" />
        <circle cx="32" cy="32" r="5" />
      </g>
      {[[16, 16], [48, 16], [16, 48], [48, 48]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="currentColor" />
      ))}
    </svg>
  );
}

export function SectionHeading({ eyebrow, title, id }: { eyebrow?: string; title: string; id?: string }) {
  return (
    <div className="mb-10 text-center">
      {eyebrow && (
        <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep sm:text-sm">{eyebrow}</p>
      )}
      <h2 id={id} className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">
        {title}
      </h2>
      <OrnamentDivider className="mt-4" />
    </div>
  );
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Gentle fade-up when the block scrolls into view. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal-on-scroll", visible && "is-visible", className)}>
      {children}
    </div>
  );
}
