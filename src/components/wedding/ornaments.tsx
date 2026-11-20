import { useId, type SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Inline SVG ornaments for the invitation. Everything here is drawn in code, so the site
 * never depends on an image file for its look. Colours are literal hex values (not CSS
 * variables) so the art renders identically inside <svg> in every browser.
 */
const C = {
  maroon: "#800020",
  maroonDeep: "#4f0014",
  maroonMid: "#a3112f",
  gold: "#D4AF37",
  goldDeep: "#A8841F",
  goldLight: "#F3E2A0",
  ivory: "#FFF8E7",
  leaf: "#2F5D32",
  leafLight: "#4C8A3F",
  marigold: "#F29A1F",
  marigoldDeep: "#D9650B",
  marigoldLight: "#FFC24B",
  jasmine: "#FFFDF3",
};

/** Round computed geometry so server and browser print identical attribute text (avoids hydration mismatch). */
const r2 = (n: number) => Math.round(n * 100) / 100;

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, "");

/* ------------------------------------------------------------------ */
/* Small building blocks (all return <g>, so they nest in any <svg>)   */
/* ------------------------------------------------------------------ */

function Marigold({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const outer = Array.from({ length: 14 }, (_, i) => i * (360 / 14));
  const inner = Array.from({ length: 10 }, (_, i) => i * 36 + 18);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {outer.map((a) => (
        <ellipse
          key={`o${a}`}
          cx={0}
          cy={-r * 0.62}
          rx={r * 0.2}
          ry={r * 0.42}
          fill={C.marigold}
          stroke={C.marigoldDeep}
          strokeWidth={r * 0.03}
          transform={`rotate(${a})`}
        />
      ))}
      {inner.map((a) => (
        <ellipse key={`i${a}`} cx={0} cy={-r * 0.4} rx={r * 0.16} ry={r * 0.3} fill={C.marigoldLight} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.2} fill={C.marigoldDeep} />
      <circle r={r * 0.09} fill="#8A3B05" />
    </g>
  );
}

function Jasmine({ cx, cy, r = 4 }: { cx: number; cy: number; r?: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.9} rx={r * 0.5} ry={r * 0.95} fill={C.jasmine} stroke={C.goldDeep} strokeWidth={0.6} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.32} fill={C.gold} />
    </g>
  );
}

/** Pointed leaf lying along +x, starting at (x, y). */
function Leaf({ x, y, rot, len, fill }: { x: number; y: number; rot: number; len: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path
        d={`M0 0 C ${len * 0.25} ${-len * 0.3} ${len * 0.7} ${-len * 0.22} ${len} 0 C ${len * 0.7} ${len * 0.22} ${len * 0.25} ${len * 0.3} 0 0Z`}
        fill={fill}
        stroke={C.leaf}
        strokeWidth={0.8}
      />
      <path d={`M0 0 L${len * 0.93} 0`} stroke={C.goldLight} strokeWidth={0.8} opacity={0.7} />
    </g>
  );
}

/** One corner of florals, drawn for the top-left of a 200x200 box. Flip it for other corners. */
export function FloralCornerShape() {
  const fan = [
    { a: 6, len: 128, f: C.leaf },
    { a: 22, len: 104, f: C.leafLight },
    { a: 40, len: 136, f: C.leaf },
    { a: 58, len: 104, f: C.leafLight },
    { a: 74, len: 94, f: C.leaf },
    { a: 87, len: 118, f: C.leafLight },
  ];
  return (
    <g>
      <path d="M6 168 C 8 78 62 12 168 6" stroke={C.gold} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d="M6 124 C 14 66 62 22 124 12" stroke={C.goldDeep} strokeWidth={1.1} fill="none" strokeLinecap="round" opacity={0.8} />
      {fan.map((l) => (
        <Leaf key={l.a} x={38} y={38} rot={l.a} len={l.len} fill={l.f} />
      ))}
      <Marigold cx={110} cy={26} r={18} />
      <Marigold cx={26} cy={110} r={18} />
      <Marigold cx={168} cy={15} r={10} />
      <Marigold cx={15} cy={168} r={10} />
      <Marigold cx={40} cy={40} r={32} />
      {[
        [76, 20],
        [20, 76],
        [142, 16],
        [16, 142],
        [66, 62],
        [62, 66],
        [92, 52],
        [52, 92],
      ].map(([x, y]) => (
        <Jasmine key={`${x}-${y}`} cx={x!} cy={y!} r={4.5} />
      ))}
      {[
        [96, 8],
        [8, 96],
        [124, 40],
        [40, 124],
      ].map(([x, y]) => (
        <circle key={`d${x}-${y}`} cx={x} cy={y} r={2} fill={C.gold} />
      ))}
    </g>
  );
}

/** Floral corner as a stand-alone decoration. Flip with -scale-x-100 etc. */
export function FloralCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      <FloralCornerShape />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mango leaf toran                                                    */
/* ------------------------------------------------------------------ */

const toranHeight = (drop: number) => Math.round(drop * 1.6 + 20);

/** Swags of hanging mango leaves with marigold beads. Draws from y=0 down. */
export function ToranShape({ width = 1200, swags = 4, drop = 50 }: { width?: number; swags?: number; drop?: number }) {
  const sw = width / swags;
  const sag = drop * 0.55;
  const top = 8;
  const leavesPerSwag = Math.max(5, Math.round(sw / (drop * 0.42)));
  const items: React.ReactNode[] = [];

  for (let s = 0; s < swags; s++) {
    const x0 = s * sw;
    const x1 = x0 + sw;
    const cx = x0 + sw / 2;
    const cy = top + sag * 2;
    const pt = (t: number) => ({
      x: r2((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1),
      y: r2((1 - t) ** 2 * top + 2 * (1 - t) * t * cy + t ** 2 * top),
    });
    const ang = (t: number) => {
      const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
      const dy = 2 * (1 - t) * (cy - top) + 2 * t * (top - cy);
      return r2((Math.atan2(dy, dx) * 180) / Math.PI);
    };

    items.push(
      <path key={`rope${s}`} d={`M${x0} ${top} Q${cx} ${cy} ${x1} ${top}`} stroke={C.goldDeep} strokeWidth={2.4} fill="none" strokeLinecap="round" />,
    );

    for (let k = 0; k < leavesPerSwag; k++) {
      const t = (k + 1) / (leavesPerSwag + 1);
      const p = pt(t);
      const len = r2(drop * (0.78 + 0.22 * Math.sin(Math.PI * t)));
      const w = r2(drop * 0.15);
      items.push(
        <g key={`leaf${s}-${k}`} transform={`translate(${p.x} ${p.y}) rotate(${ang(t)})`}>
          <path
            d={`M0 0 C ${w} ${len * 0.25} ${w} ${len * 0.7} 0 ${len} C ${-w} ${len * 0.7} ${-w} ${len * 0.25} 0 0Z`}
            fill={k % 2 ? C.leafLight : C.leaf}
            stroke={C.leaf}
            strokeWidth={0.8}
          />
          <path d={`M0 2 L0 ${len * 0.9}`} stroke={C.goldLight} strokeWidth={0.8} opacity={0.65} />
        </g>,
      );
      if (k < leavesPerSwag - 1) {
        const mid = pt(t + 0.5 / (leavesPerSwag + 1));
        items.push(<circle key={`bead${s}-${k}`} cx={mid.x} cy={mid.y + drop * 0.05} r={drop * 0.065} fill={C.marigold} stroke={C.marigoldDeep} strokeWidth={0.8} />);
      }
    }
  }

  // Tassels where the swags meet
  for (let s = 0; s <= swags; s++) {
    const x = s * sw;
    items.push(
      <g key={`tassel${s}`}>
        <circle cx={x} cy={top} r={5} fill={C.gold} stroke={C.goldDeep} />
        <path d={`M${x} ${top + 5} V${top + drop * 0.5}`} stroke={C.goldDeep} strokeWidth={1.4} />
        <g transform={`translate(${x} ${top + drop * 0.55})`}>
          <path d={`M0 0 C ${drop * 0.14} ${drop * 0.06} ${drop * 0.12} ${drop * 0.26} 0 ${drop * 0.3} C ${-drop * 0.12} ${drop * 0.26} ${-drop * 0.14} ${drop * 0.06} 0 0Z`} fill={C.gold} stroke={C.goldDeep} strokeWidth={0.9} />
          <circle cy={drop * 0.33} r={drop * 0.04} fill={C.goldDeep} />
        </g>
      </g>,
    );
  }
  return <g>{items}</g>;
}

/** Full-width mango leaf toran. Crops from the middle on narrow screens. */
export function MangoToran({ className, swags = 4 }: { className?: string; swags?: number }) {
  const drop = 50;
  return (
    <svg
      viewBox={`0 0 1200 ${toranHeight(drop)}`}
      preserveAspectRatio="xMidYMin slice"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      <ToranShape width={1200} swags={swags} drop={drop} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Brass kuthu vilakku (five-faced standing lamp)                      */
/* ------------------------------------------------------------------ */

function Flame({ cx, base, h, delay }: { cx: number; base: number; h: number; delay: number }) {
  const w = h * 0.3;
  return (
    <g className="flame-flicker" style={{ animationDelay: `${delay}s` }}>
      <path
        d={`M${cx} ${base - h} C ${cx + w} ${base - h * 0.55} ${cx + w * 1.3} ${base - h * 0.2} ${cx} ${base} C ${cx - w * 1.3} ${base - h * 0.2} ${cx - w} ${base - h * 0.55} ${cx} ${base - h}Z`}
        fill="#F7931E"
      />
      <path
        d={`M${cx} ${base - h * 0.62} C ${cx + w * 0.5} ${base - h * 0.38} ${cx + w * 0.6} ${base - h * 0.12} ${cx} ${base - 1} C ${cx - w * 0.6} ${base - h * 0.12} ${cx - w * 0.5} ${base - h * 0.38} ${cx} ${base - h * 0.62}Z`}
        fill="#FFE27A"
      />
    </g>
  );
}

export function KuthuVilakku({ className, lit = true, ...rest }: SVGProps<SVGSVGElement> & { lit?: boolean }) {
  const id = safeId(useId());
  const brass = `brass${id}`;
  const ball = `ball${id}`;
  const glow = `glow${id}`;
  return (
    <svg
      viewBox="0 0 120 290"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <defs>
        <linearGradient id={brass} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6e500d" />
          <stop offset="0.32" stopColor="#ecca6c" />
          <stop offset="0.6" stopColor="#b88a22" />
          <stop offset="1" stopColor="#6e500d" />
        </linearGradient>
        <radialGradient id={ball} cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fbe9a6" />
          <stop offset="0.55" stopColor="#c99a2a" />
          <stop offset="1" stopColor="#6e500d" />
        </radialGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD56A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD56A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {lit && <circle cx="60" cy="50" r="58" fill={`url(#${glow})`} />}

      {/* five flames */}
      {lit && (
        <g>
          <Flame cx={14} base={70} h={15} delay={0.3} />
          <Flame cx={37} base={70} h={22} delay={0.9} />
          <Flame cx={60} base={70} h={30} delay={0} />
          <Flame cx={83} base={70} h={22} delay={0.6} />
          <Flame cx={106} base={70} h={15} delay={1.2} />
        </g>
      )}

      {/* oil bowl with five wick lips */}
      <path d="M8 72 H112 C 110 94 88 106 60 106 C 32 106 10 94 8 72Z" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="1" />
      <ellipse cx="60" cy="72" rx="52" ry="5" fill="#4a3406" />
      <ellipse cx="60" cy="71" rx="52" ry="4" fill="none" stroke="#f3dc8a" strokeWidth="1" opacity="0.8" />
      {[14, 37, 60, 83, 106].map((x) => (
        <ellipse key={x} cx={x} cy={72} rx="6" ry="2.4" fill="#f3dc8a" opacity="0.9" />
      ))}
      <path d="M20 84 H100" stroke="#f3dc8a" strokeWidth="0.9" opacity="0.6" />

      {/* neck and stem */}
      <ellipse cx="60" cy="110" rx="15" ry="6" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.8" />
      <path d="M53 112 C 52 124 54 134 55 144 H65 C 66 134 68 124 67 112Z" fill={`url(#${brass})`} />
      <ellipse cx="60" cy="128" rx="11" ry="4" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.6" />
      <ellipse cx="60" cy="146" rx="13" ry="5" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.6" />

      {/* brass sphere */}
      <circle cx="60" cy="172" r="19" fill={`url(#${ball})`} stroke="#5a4108" strokeWidth="0.8" />
      <path d="M43 172 H77" stroke="#f3dc8a" strokeWidth="0.8" opacity="0.6" />
      <ellipse cx="60" cy="172" rx="19" ry="5" fill="none" stroke="#5a4108" strokeWidth="0.7" opacity="0.6" />

      {/* lower stem */}
      <ellipse cx="60" cy="193" rx="12" ry="4.5" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.6" />
      <path d="M54 194 C 53 206 54 216 52 226 H68 C 66 216 67 206 66 194Z" fill={`url(#${brass})`} />
      <ellipse cx="60" cy="208" rx="9" ry="3.5" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.5" />

      {/* lotus pedestal */}
      <path d="M52 226 C 52 240 36 246 20 262 H100 C 84 246 68 240 68 226Z" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.8" />
      {[-30, -15, 0, 15, 30].map((dx) => (
        <path key={dx} d={`M${60 + dx} 262 C ${60 + dx - 6} 252 ${60 + dx - 4} 246 ${60 + dx} 242 C ${60 + dx + 4} 246 ${60 + dx + 6} 252 ${60 + dx} 262Z`} fill="none" stroke="#f3dc8a" strokeWidth="0.8" opacity="0.7" />
      ))}
      <ellipse cx="60" cy="264" rx="44" ry="8" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.8" />
      <path d="M16 264 V272 C 16 280 104 280 104 272 V264" fill={`url(#${brass})`} stroke="#5a4108" strokeWidth="0.8" />
      {[26, 40, 54, 68, 82, 96].map((x) => (
        <circle key={x} cx={x} cy={270} r="1.6" fill="#f3dc8a" opacity="0.85" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Kolam                                                               */
/* ------------------------------------------------------------------ */

/** A repeating pulli-kolam border: dots joined by woven diamond loops. */
export function KolamBand({ className, ...rest }: SVGProps<SVGSVGElement>) {
  const id = safeId(useId());
  return (
    <svg
      width="100%"
      height={24}
      className={cn("pointer-events-none select-none text-gold-deep", className)}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <defs>
        <pattern id={`kb${id}`} width="48" height="24" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 12 Q24 -2 36 12 Q24 26 12 12Z" />
            <path d="M17 12 Q24 4 31 12 Q24 20 17 12Z" opacity="0.7" />
          </g>
          <circle cx="24" cy="12" r="1.6" fill="currentColor" />
          <circle cx="6" cy="12" r="1.8" fill="currentColor" />
          <circle cx="42" cy="12" r="1.8" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill={`url(#kb${id})`} />
    </svg>
  );
}

/** Eight-petal lotus with a kolam centre, for emblems and card crests. */
export function LotusEmblemShape() {
  return (
    <g>
      {[-72, -48, -24, 24, 48, 72].map((a) => (
        <path key={a} d="M0 0 C -9 -8 -9 -22 0 -32 C 9 -22 9 -8 0 0Z" fill={C.goldLight} stroke={C.goldDeep} strokeWidth="0.9" transform={`rotate(${a})`} />
      ))}
      <path d="M0 0 C -11 -10 -11 -28 0 -40 C 11 -28 11 -10 0 0Z" fill={C.gold} stroke={C.goldDeep} strokeWidth="1" />
      <path d="M-20 4 H20" stroke={C.goldDeep} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="-26" cy="4" r="1.8" fill={C.gold} />
      <circle cx="26" cy="4" r="1.8" fill={C.gold} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Intro card art (replaces the old invitation-card image)             */
/* ------------------------------------------------------------------ */

/** Full 2:3 maroon-and-gold invitation card background. Text is overlaid by the caller. */
export function InvitationCardArt({ className }: { className?: string }) {
  const id = safeId(useId());
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`silk${id}`} cx="0.5" cy="0.35" r="0.85">
          <stop offset="0" stopColor="#a3112f" />
          <stop offset="0.5" stopColor={C.maroon} />
          <stop offset="1" stopColor={C.maroonDeep} />
        </radialGradient>
        <pattern id={`dots${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.1" fill={C.gold} opacity="0.22" />
          <circle cx="0" cy="0" r="0.9" fill={C.gold} opacity="0.14" />
        </pattern>
      </defs>
      <rect width="400" height="600" fill={`url(#silk${id})`} />
      <rect width="400" height="600" fill={`url(#dots${id})`} />

      {/* double gold frame */}
      <rect x="10" y="10" width="380" height="580" rx="14" fill="none" stroke={C.gold} strokeWidth="2.5" />
      <rect x="20" y="20" width="360" height="560" rx="8" fill="none" stroke={C.gold} strokeWidth="0.9" opacity="0.75" />

      {/* bottom floral corners */}
      <g transform="translate(14 586) scale(0.55 -0.55)">
        <FloralCornerShape />
      </g>
      <g transform="translate(386 586) scale(-0.55 -0.55)">
        <FloralCornerShape />
      </g>

      {/* mango leaf toran across the top */}
      <g transform="translate(0 12)">
        <ToranShape width={400} swags={2} drop={38} />
      </g>

      {/* crest */}
      <g transform="translate(200 146) scale(0.9)">
        <LotusEmblemShape />
      </g>

      {/* lamp and kolam at the foot */}
      <KuthuVilakku x={181} y={494} width={38} height={92} />
      <KolamBand x={118} y={552} width={56} height={24} color={C.gold} />
      <KolamBand x={226} y={552} width={56} height={24} color={C.gold} />
    </svg>
  );
}
