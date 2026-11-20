import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Hand } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { OrnamentDivider, usePrefersReducedMotion, weddingButton } from "./ui";

const REVEAL_THRESHOLD = 0.55;

const DATE_TEXT = {
  en: { day: "14", month: "December", year: "2026", weekday: "Monday", event: "Wedding Ceremony" },
  ta: { day: "14", month: "டிசம்பர்", year: "2026", weekday: "திங்கட்கிழமை", event: "திருமண விழா" },
};

function readCssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function paintFoil(canvas: HTMLCanvasElement, label: string, isTamil: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = canvas;
  const dpr = window.devicePixelRatio || 1;
  const gold = readCssVar("--gold", "#D4AF37");
  const goldLight = readCssVar("--gold-light", "#F3DE9A");
  const goldDeep = readCssVar("--gold-deep", "#8A6A12");
  const maroon = readCssVar("--maroon", "#800020");

  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, goldLight);
  g.addColorStop(0.3, gold);
  g.addColorStop(0.55, goldDeep);
  g.addColorStop(0.75, gold);
  g.addColorStop(1, goldLight);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Lattice pattern
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = maroon;
  ctx.lineWidth = 1 * dpr;
  const step = 26 * dpr;
  for (let x = -h; x < w + h; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + h, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.restore();

  // Sheen streaks
  ctx.save();
  ctx.globalAlpha = 0.35;
  const sheen = ctx.createLinearGradient(0, 0, w, 0);
  sheen.addColorStop(0.2, "rgba(255,255,255,0)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0.9)");
  sheen.addColorStop(0.6, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Double ornamental border
  ctx.strokeStyle = maroon;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 2 * dpr;
  ctx.strokeRect(12 * dpr, 12 * dpr, w - 24 * dpr, h - 24 * dpr);
  ctx.lineWidth = 1 * dpr;
  ctx.strokeRect(18 * dpr, 18 * dpr, w - 36 * dpr, h - 36 * dpr);
  ctx.globalAlpha = 1;

  // Centre medallion + label
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = maroon;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.min(w * 0.36, 170 * dpr), 38 * dpr, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = goldLight;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = (isTamil ? 17 : 19) * dpr;
  ctx.font = `600 ${size}px ${isTamil ? '"Noto Serif Tamil"' : "Cinzel"}, serif`;
  ctx.fillText(isTamil ? label : label.toUpperCase(), cx, cy);

  // Corner diamonds
  ctx.fillStyle = maroon;
  const corners: Array<[number, number]> = [
    [30, 30],
    [w / dpr - 30, 30],
    [30, h / dpr - 30],
    [w / dpr - 30, h / dpr - 30],
  ];
  for (const [x, y] of corners) {
    ctx.beginPath();
    ctx.moveTo(x * dpr, (y - 7) * dpr);
    ctx.lineTo((x + 7) * dpr, y * dpr);
    ctx.lineTo(x * dpr, (y + 7) * dpr);
    ctx.lineTo((x - 7) * dpr, y * dpr);
    ctx.closePath();
    ctx.fill();
  }
}

function Celebration() {
  const petals = Array.from({ length: 16 }, (_, i) => i);
  const sparkles = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((i) => (
        <span
          key={`p${i}`}
          className="petal"
          style={
            {
              left: `${(i * 61) % 100}%`,
              animationDelay: `${(i % 6) * 0.12}s`,
              "--drift": `${((i * 37) % 80) - 40}px`,
              "--spin": `${180 + ((i * 53) % 220)}deg`,
              transform: "translateY(-20px)",
            } as CSSProperties
          }
        />
      ))}
      {sparkles.map((i) => (
        <span
          key={`s${i}`}
          className="sparkle-dot"
          style={{ left: `${10 + ((i * 47) % 80)}%`, top: `${10 + ((i * 29) % 75)}%`, animationDelay: `${i * 0.09}s` }}
        />
      ))}
    </div>
  );
}

export function ScratchCard({ revealed, onReveal }: { revealed: boolean; onReveal: () => void }) {
  const { t, lang } = useI18n();
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const [canvasGone, setCanvasGone] = useState(revealed);
  const [celebrate, setCelebrate] = useState(false);
  const d = DATE_TEXT[lang];

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    paintFoil(canvas, t.scratchHere, lang === "ta");
  }, [t.scratchHere, lang]);

  useEffect(() => {
    if (revealed) return;
    setup();
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && setup());
    const ro = new ResizeObserver(() => setup());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [setup, revealed]);

  useEffect(() => {
    if (!revealed) return;
    if (!reduced) setCelebrate(true);
    const tm = window.setTimeout(() => setCanvasGone(true), reduced ? 0 : 600);
    const tm2 = window.setTimeout(() => setCelebrate(false), 3200);
    return () => {
      window.clearTimeout(tm);
      window.clearTimeout(tm2);
    };
  }, [revealed, reduced]);

  const pointFor = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const scratchTo = (canvas: HTMLCanvasElement, p: { x: number; y: number }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 46 * dpr;
    ctx.beginPath();
    const from = last.current ?? p;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x + 0.01, p.y);
    ctx.stroke();
    last.current = p;
    moves.current += 1;
    if (moves.current % 6 === 0) checkProgress(canvas);
  };

  const checkProgress = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if ((data[i] ?? 255) < 40) clear++;
    }
    if (total && clear / total >= REVEAL_THRESHOLD) onReveal();
  };

  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = null;
    scratchTo(e.currentTarget, pointFor(e));
  };
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return;
    scratchTo(e.currentTarget, pointFor(e));
  };
  const onUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    last.current = null;
    checkProgress(e.currentTarget);
  };

  return (
    <section aria-labelledby="scratch-title" className="relative bg-ivory px-5 py-20 sm:py-24">
      <div className="kolam-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="font-display text-2xl italic text-maroon sm:text-3xl">{t.specialDate}</p>
        <h2 id="scratch-title" className="mt-3 font-label text-sm font-bold uppercase tracking-[0.2em] text-gold-deep sm:text-base">
          ✨ {revealed ? t.dateRevealed : t.scratchToReveal} ✨
        </h2>

        <div
          ref={wrapRef}
          className="gold-frame relative mx-auto mt-8 aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl bg-warm-white shadow-card"
        >
          <div
            className={cn("flex h-full flex-col items-center justify-center px-6 text-center", revealed && !reduced && "animate-date-in")}
            aria-live="polite"
          >
            <span className="font-display text-7xl font-bold leading-none text-maroon sm:text-8xl">{d.day}</span>
            <span className="mt-1 font-label text-2xl font-semibold uppercase tracking-[0.2em] text-maroon sm:text-3xl">{d.month}</span>
            <span className="font-label text-lg font-semibold tracking-[0.35em] text-gold-deep">{d.year}</span>
            <OrnamentDivider className="my-2 h-4 w-40" />
            <span className="font-label text-sm font-bold uppercase tracking-[0.25em] text-brown">{d.weekday}</span>
            <span className="mt-1 font-display text-xl italic text-temple-red">{d.event}</span>
          </div>

          {!canvasGone && (
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              className={cn(
                "absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-500 active:cursor-grabbing",
                revealed && "pointer-events-none opacity-0",
              )}
            />
          )}
          {celebrate && <Celebration />}
        </div>

        {!revealed && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hand className="size-4" aria-hidden="true" />
              {t.scratchHere}
            </p>
            <button type="button" onClick={onReveal} className={weddingButton({ variant: "outline", size: "sm" })}>
              {t.revealWithout}
            </button>
          </div>
        )}
        <p className="sr-only">{t.scratchAria}</p>
      </div>
    </section>
  );
}
