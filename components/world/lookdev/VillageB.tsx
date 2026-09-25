'use client';

// Look-development frame B: the village with the inn, 2.5D painted. Layered illustrated planes with parallax on
// pointer/touch; the inn is clickable; clouds drift, lanterns flicker, smoke rises, water shimmers, petals fall,
// fireflies at night. No WebGL.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cloudsSvg, forestSvg, foregroundSvg, mountainsSvg, paint, skySvg } from './painted';

type M = {
  grassFar: string;
  grass: string;
  grassDark: string;
  shadow: string;
  shadowOp: number;
  paddyTop: string;
  paddyBottom: string;
  shoot: string;
  bank: string;
  wood: string;
  woodDark: string;
  woodLit: string;
  plaster: string;
  plasterShade: string;
  kawara: string;
  kawaraLit: string;
  kawaraLine: string;
  shoji: string;
  shojiGlow: number;
  interior: string;
  noren: string;
  norenMark: string;
  lantern: string;
  lanternRib: string;
  glow: string;
  glowOp: number;
  vending: string;
  vendingPanel: string;
  vendingOp: number;
  stone: string;
  stoneLit: string;
  stoneShade: string;
  path: string;
  waterLight: string;
  water: string;
  waterDeep: string;
  pole: string;
  wire: string;
  laundry: [string, string, string];
  bike: string;
  smoke: string;
  sunStreak: string;
};

const mid: Record<'day' | 'night', M> = {
  day: {
    grassFar: '#a6c860',
    grass: '#8fc052',
    grassDark: '#6ea046',
    shadow: '#5a4a3a',
    shadowOp: 0.22,
    paddyTop: '#ffd8a4',
    paddyBottom: '#9fcbe6',
    shoot: '#5f9e3e',
    bank: '#8e7a4e',
    wood: '#7a5236',
    woodDark: '#4a3122',
    woodLit: '#a36e45',
    plaster: '#f6eedc',
    plasterShade: '#dccdb0',
    kawara: '#48556b',
    kawaraLit: '#6c7d96',
    kawaraLine: '#2f3845',
    shoji: '#fff1d2',
    shojiGlow: 0.15,
    interior: '#5a3a28',
    noren: '#2f4f86',
    norenMark: '#f6eedc',
    lantern: '#e2472a',
    lanternRib: '#a8301a',
    glow: '#ffc27a',
    glowOp: 0.22,
    vending: '#e8e9f0',
    vendingPanel: '#dff0ff',
    vendingOp: 0.18,
    stone: '#bdb4a6',
    stoneLit: '#e2d9c8',
    stoneShade: '#8f877c',
    path: '#d4bb95',
    waterLight: '#fff0d4',
    water: '#79b8dc',
    waterDeep: '#4f8fbc',
    pole: '#6a5a4c',
    wire: '#3a3430',
    laundry: ['#f6f2e8', '#9ac2e2', '#eaa4a4'],
    bike: '#2f6fb8',
    smoke: '#f4efe6',
    sunStreak: '#fff4d8',
  },
  night: {
    grassFar: '#2c5a72',
    grass: '#24506a',
    grassDark: '#1a3e56',
    shadow: '#0a1830',
    shadowOp: 0.3,
    paddyTop: '#3a6fb6',
    paddyBottom: '#1f4a86',
    shoot: '#1e4a4a',
    bank: '#2a3452',
    wood: '#34405e',
    woodDark: '#1a1f36',
    woodLit: '#4a5a80',
    plaster: '#8facdc',
    plasterShade: '#6a86b8',
    kawara: '#26304a',
    kawaraLit: '#3a4a6e',
    kawaraLine: '#121828',
    shoji: '#ffd290',
    shojiGlow: 0.9,
    interior: '#3a2a2a',
    noren: '#1c2c5a',
    norenMark: '#c8d8f6',
    lantern: '#ff6a3a',
    lanternRib: '#c2401e',
    glow: '#ffb45a',
    glowOp: 0.8,
    vending: '#c8d4f0',
    vendingPanel: '#eaf4ff',
    vendingOp: 0.75,
    stone: '#56709e',
    stoneLit: '#7a94c2',
    stoneShade: '#3a5078',
    path: '#4c6a9c',
    waterLight: '#cfe0ff',
    water: '#2a5a9a',
    waterDeep: '#173a70',
    pole: '#2a3048',
    wire: '#10142a',
    laundry: ['#9fb4dc', '#5a7ab0', '#8a6a90'],
    bike: '#2a4f8a',
    smoke: '#6a82b0',
    sunStreak: '#e8f0ff',
  },
};

// Parallax depth per layer (px at 1600 wide for a full pointer swing).
const DEPTH = { sky: 5, clouds: 12, mountains: 20, forest: 30, mid: 46, fore: 96 };

export default function VillageB({ night, still, onOpen }: { night: boolean; still?: boolean; onOpen: () => void }) {
  const mood = night ? 'night' : 'day';
  const layers = useMemo(() => {
    const p = paint[mood];
    return { sky: skySvg(p), clouds: cloudsSvg(p), mountains: mountainsSvg(p), forest: forestSvg(p), fore: foregroundSvg(p) };
  }, [mood]);
  const root = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const calm = still || reduced;

  useEffect(() => {
    if (calm) return;
    const el = root.current!;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dx = tx - x;
      const dy = ty - y;
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return;
      x += dx * 0.08;
      y += dy * 0.08;
      const scale = el.clientWidth / 1600;
      for (const [k, d] of Object.entries(DEPTH)) {
        const node = refs.current[k];
        if (node) node.style.transform = `translate3d(${(-x * d * scale).toFixed(2)}px, ${(-y * d * 0.4 * scale).toFixed(2)}px, 0)`;
      }
    };
    el.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [calm]);

  const layer = (key: keyof typeof DEPTH, html: string, extra = '') => (
    <div
      key={key}
      ref={(n) => {
        refs.current[key] = n;
      }}
      aria-hidden
      className={`pointer-events-none absolute -inset-[6%] ${extra}`}
      // Static markup built from our own palette (no user input).
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  return (
    <div ref={root} className={`lookdev-b absolute inset-0 overflow-hidden ${calm ? 'calm' : ''}`} data-mood={mood}>
      {layer('sky', layers.sky)}
      {layer('clouds', layers.clouds, 'lookdev-drift')}
      {layer('mountains', layers.mountains)}
      {layer('forest', layers.forest)}
      <div
        ref={(n) => {
          refs.current.mid = n;
        }}
        className="absolute -inset-[6%]"
      >
        <Village m={mid[mood]} onOpen={onOpen} night={night} />
      </div>
      {layer('fore', layers.fore)}
      {!calm && <Petals night={night} />}
      {/* light wash: low golden sun from the right by day, cool moonlight at night */}
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${night ? 'lookdev-wash-night' : 'lookdev-wash-day'}`} />
      <div aria-hidden className="lookdev-grain pointer-events-none absolute inset-0" />
    </div>
  );
}

function Village({ m, onOpen, night }: { m: M; onOpen: () => void; night: boolean }) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.grassFar} />
          <stop offset="0.35" stopColor={m.grass} />
          <stop offset="1" stopColor={m.grassDark} />
        </linearGradient>
        <linearGradient id="pd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.paddyTop} />
          <stop offset="1" stopColor={m.paddyBottom} />
        </linearGradient>
        <pattern id="shoots" width="18" height="11" patternUnits="userSpaceOnUse">
          <path d="M4 10 L6 2 M9 10 L9 3 M14 10 L12 2" stroke={m.shoot} strokeWidth="1.8" strokeLinecap="round" />
        </pattern>
        <linearGradient id="kw" x1="0" x2="1">
          <stop offset="0" stopColor={m.kawara} />
          <stop offset="1" stopColor={m.kawaraLit} />
        </linearGradient>
        <pattern id="kawaraTiles" width="14" height="12" patternUnits="userSpaceOnUse">
          <path d="M7 0 V12" stroke={m.kawaraLine} strokeWidth="2.2" opacity="0.65" />
          <path d="M0 11.5 H14" stroke={m.kawaraLine} strokeWidth="1" opacity="0.35" />
        </pattern>
        <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.waterLight} />
          <stop offset="0.35" stopColor={m.water} />
          <stop offset="1" stopColor={m.waterDeep} />
        </linearGradient>
        <radialGradient id="lg" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={m.glow} stopOpacity="1" />
          <stop offset="1" stopColor={m.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vg" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={m.vendingPanel} stopOpacity="1" />
          <stop offset="1" stopColor={m.vendingPanel} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground */}
      <rect x="-100" y="632" width="1800" height="420" fill="url(#gr)" />

      {/* terraced rice paddies reflecting the sky */}
      {[
        '1040,668 1700,652 1700,700 1030,712',
        '1018,724 1700,710 1700,762 1008,774',
        '996,786 1700,772 1700,830 986,842',
      ].map((pts, i) => (
        <g key={i}>
          <polygon points={pts} fill={m.bank} transform="translate(0 7)" />
          <polygon points={pts} fill="url(#pd)" />
          <polygon points={pts} fill="url(#shoots)" opacity="0.9" />
        </g>
      ))}
      <ellipse className="lookdev-shimmer" cx="1300" cy="684" rx="90" ry="3" fill={m.sunStreak} opacity="0.7" />
      <ellipse className="lookdev-shimmer" cx="1320" cy="742" rx="120" ry="3.5" fill={m.sunStreak} opacity="0.55" />

      {/* utility pole and wires: very much a lived-in countryside */}
      <path d="M1084 434 Q 600 540 -60 420 M1126 434 Q 1400 480 1660 440 M1088 464 Q 560 580 -60 478 M1122 464 Q 1380 510 1660 486" fill="none" stroke={m.wire} strokeWidth="2" />
      <rect x="1100" y="410" width="10" height="372" fill={m.pole} />
      <rect x="1078" y="430" width="54" height="6" fill={m.pole} />
      <rect x="1084" y="460" width="42" height="5" fill={m.pole} />

      {/* the neighbour's house: laundry out, a bicycle against the wall */}
      <g>
        <rect x="142" y="762" width="286" height="12" fill={m.stone} />
        <rect x="160" y="672" width="250" height="90" fill={m.wood} />
        <rect x="180" y="684" width="92" height="46" fill={m.plaster} />
        <rect x="298" y="684" width="92" height="46" fill={m.plasterShade} />
        <rect x="160" y="672" width="6" height="90" fill={m.woodDark} />
        <rect x="286" y="672" width="6" height="90" fill={m.woodDark} />
        <rect x="404" y="672" width="6" height="90" fill={m.woodDark} />
        <polygon points="128,678 442,678 410,612 160,612" fill="url(#kw)" />
        <polygon points="128,678 442,678 410,612 160,612" fill="url(#kawaraTiles)" />
        <rect x="156" y="604" width="258" height="10" fill={m.kawaraLine} />
        <rect x="124" y="676" width="322" height="5" fill={m.kawaraLine} />
        {/* laundry */}
        <line x1="420" y1="700" x2="530" y2="706" stroke={m.woodDark} strokeWidth="3" />
        <rect x="526" y="700" width="6" height="80" fill={m.woodDark} />
        <rect x="432" y="703" width="20" height="36" fill={m.laundry[0]} />
        <rect x="458" y="704" width="18" height="30" fill={m.laundry[1]} />
        <rect x="482" y="705" width="24" height="40" fill={m.laundry[2]} />
        {/* bicycle */}
        <g fill="none" stroke={m.bike} strokeWidth="3">
          <circle cx="222" cy="758" r="15" stroke={m.woodDark} />
          <circle cx="278" cy="758" r="15" stroke={m.woodDark} />
          <path d="M222 758 L244 738 L270 738 L278 758 M244 738 L252 758 L270 738 M252 758 L222 758 M266 732 L272 732 M240 734 L250 734" />
        </g>
        {/* small vegetable patch */}
        {[100, 116, 132].map((x) => (
          <ellipse key={x} cx={x} cy="770" rx="9" ry="6" fill={m.shoot} />
        ))}
      </g>

      {/* the inn — the projects hub */}
      <g
        role="button"
        tabIndex={0}
        aria-label="The inn: projects"
        className="lookdev-hit cursor-pointer"
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        {/* cast shadow, long and to the left (sun low on the right) */}
        <polygon points="548,774 1012,774 890,806 400,806" fill={m.shadow} opacity={m.shadowOp} />
        {/* path up to the door */}
        <polygon points="752,774 808,774 850,806 712,806" fill={m.path} />
        <rect x="548" y="762" width="464" height="12" fill={m.stone} />
        {/* ground floor */}
        <rect x="572" y="668" width="416" height="94" fill={m.wood} />
        {[
          [580, 646],
          [654, 720],
          [848, 914],
          [922, 988],
        ].map(([a, b]) => (
          <g key={a}>
            <rect x={a} y="680" width={b - a - 4} height="72" fill={m.shoji} />
            <rect x={a} y="680" width={b - a - 4} height="72" fill="url(#lg)" opacity={m.shojiGlow} />
            <path d={`M${a + (b - a) / 3} 680 V752 M${a + ((b - a) * 2) / 3 - 2} 680 V752 M${a} 704 H${b - 4} M${a} 728 H${b - 4}`} stroke={m.woodDark} strokeWidth="1.6" opacity="0.7" />
          </g>
        ))}
        {[572, 646, 720, 840, 914, 984].map((x) => (
          <rect key={x} x={x} y="668" width="7" height="94" fill={m.woodDark} />
        ))}
        {/* doorway, warm inside, noren curtain */}
        <rect x="727" y="676" width="113" height="86" fill={m.interior} />
        <ellipse cx="783" cy="730" rx="60" ry="40" fill="url(#lg)" opacity={m.glowOp} />
        <rect x="731" y="690" width="105" height="36" fill={m.noren} />
        <path d="M757 690 V726 M783 690 V726 M809 690 V726" stroke={m.interior} strokeWidth="2.5" />
        <circle cx="783" cy="703" r="6" fill="none" stroke={m.norenMark} strokeWidth="2" />
        <rect x="700" y="756" width="166" height="7" fill={m.woodLit} />
        {/* sign */}
        <rect x="738" y="668" width="90" height="17" fill={m.woodDark} />
        <text x="783" y="680.5" textAnchor="middle" fill={m.plaster} fontFamily="var(--font-plex-mono), monospace" fontSize="10.5" fontWeight="500" letterSpacing="2.2">
          PROJECTS
        </text>
        {/* paper lanterns */}
        {[704, 862].map((x) => (
          <g key={x}>
            <line x1={x} y1="668" x2={x} y2="678" stroke={m.woodDark} strokeWidth="1.5" />
            <g className="lookdev-flicker">
              <circle cx={x} cy="694" r="46" fill="url(#lg)" opacity={m.glowOp} />
            </g>
            <ellipse cx={x} cy="694" rx="12" ry="16" fill={m.lantern} />
            <path d={`M${x - 11} 688 H${x + 11} M${x - 12} 694 H${x + 12} M${x - 11} 700 H${x + 11}`} stroke={m.lanternRib} strokeWidth="1" />
            <rect x={x - 7} y="677" width="14" height="4" fill={m.woodDark} />
            <rect x={x - 7} y="708" width="14" height="4" fill={m.woodDark} />
          </g>
        ))}
        {/* pent roof between the floors */}
        <polygon points="538,670 1022,670 1000,640 560,640" fill="url(#kw)" />
        <polygon points="538,670 1022,670 1000,640 560,640" fill="url(#kawaraTiles)" />
        <rect x="534" y="668" width="492" height="5" fill={m.kawaraLine} />
        {/* first floor: plaster and timber, shoji windows, a balcony rail */}
        <rect x="600" y="568" width="360" height="72" fill={m.plaster} />
        <rect x="780" y="568" width="180" height="72" fill={m.plasterShade} opacity="0.35" />
        {[
          [612, 684],
          [876, 948],
        ].map(([a, b]) => (
          <g key={a}>
            <rect x={a} y="580" width={b - a} height="44" fill={m.shoji} />
            <rect x={a} y="580" width={b - a} height="44" fill="url(#lg)" opacity={m.shojiGlow} />
            <path d={`M${a + (b - a) / 2} 580 V624 M${a} 602 H${b}`} stroke={m.woodDark} strokeWidth="1.6" opacity="0.7" />
          </g>
        ))}
        {[600, 690, 780, 870, 953].map((x) => (
          <rect key={x} x={x} y="568" width="7" height="72" fill={m.woodDark} />
        ))}
        <rect x="596" y="626" width="368" height="5" fill={m.woodDark} />
        {Array.from({ length: 23 }, (_, i) => (
          <rect key={i} x={604 + i * 16} y="631" width="3" height="9" fill={m.woodDark} />
        ))}
        {/* main hip roof with a small gable on top */}
        <polygon points="556,572 1004,572 940,506 620,506" fill="url(#kw)" />
        <polygon points="556,572 1004,572 940,506 620,506" fill="url(#kawaraTiles)" />
        <rect x="550" y="570" width="460" height="6" fill={m.kawaraLine} />
        <polygon points="700,508 860,508 780,460" fill={m.plaster} />
        <path d="M690 512 L780 454 L870 512" fill="none" stroke={m.woodDark} strokeWidth="6" strokeLinejoin="round" />
        <path d="M760 492 H800 M765 482 H795" stroke={m.woodDark} strokeWidth="2" />
        <rect x="636" y="499" width="288" height="9" fill={m.kawaraLine} />
        <path d="M636 504 q -10 -2 -14 -12 M924 504 q 10 -2 14 -12" fill="none" stroke={m.kawaraLine} strokeWidth="5" strokeLinecap="round" />
        {/* chimney with a thin line of smoke */}
        <rect x="900" y="486" width="16" height="24" fill={m.woodDark} />
        <g className="lookdev-smoke" fill={m.smoke}>
          <circle cx="908" cy="476" r="7" />
          <circle cx="912" cy="460" r="9" />
          <circle cx="906" cy="440" r="11" />
        </g>
        {/* vending machine by the inn */}
        <circle cx="1034" cy="712" r="60" fill="url(#vg)" opacity={m.vendingOp} />
        <rect x="1016" y="690" width="38" height="82" rx="3" fill={m.vending} />
        <rect x="1020" y="694" width="30" height="16" fill={m.vendingPanel} />
        {[0, 1].map((row) =>
          [0, 1, 2, 3].map((i) => (
            <rect key={`${row}${i}`} x={1021 + i * 7.5} y={716 + row * 12} width="5" height="8" rx="1.5" fill={['#e2472a', '#2f6fb8', '#46a04a', '#f0b43a'][(i + row) % 4]} />
          )),
        )}
        <rect x="1022" y="752" width="26" height="8" fill={m.woodDark} opacity="0.7" />
      </g>

      {/* the stream, its stone banks, and the arched bridge on the path */}
      <path d="M-60 806 Q 400 794 800 812 T 1660 804 L1660 862 Q 1200 870 800 858 T -60 864 Z" fill="url(#wt)" />
      {[
        [180, 826, 70],
        [520, 838, 110],
        [1080, 834, 90],
        [1400, 824, 60],
      ].map(([x, y, w], i) => (
        <ellipse key={i} className="lookdev-shimmer" cx={x} cy={y} rx={w} ry="2.5" fill={m.waterLight} opacity="0.7" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
      <Bank y={806} m={m} seed={3} />
      <Bank y={862} m={m} seed={9} />
      <path d="M672 842 Q 800 794 928 842 L 928 868 L 882 868 Q 800 822 718 868 L 672 868 Z" fill={m.stone} />
      <ellipse cx="800" cy="866" rx="72" ry="8" fill={m.waterDeep} opacity="0.6" />
      <path d="M672 842 Q 800 794 928 842" fill="none" stroke={m.stoneLit} strokeWidth="4" />
      <path d="M684 834 Q 800 788 916 834" fill="none" stroke={m.stoneShade} strokeWidth="6" />
      {[700, 740, 860, 900].map((x) => (
        <line key={x} x1={x} y1={x < 800 ? 846 - (x - 672) * 0.3 : 846 - (928 - x) * 0.3} x2={x} y2="866" stroke={m.stoneShade} strokeWidth="1.6" opacity="0.6" />
      ))}
      {/* stepping stones down to the viewer */}
      {[
        [800, 890, 34, 9],
        [788, 920, 40, 11],
        [812, 954, 48, 13],
        [794, 996, 60, 16],
      ].map(([x, y, rx, ry]) => (
        <g key={y}>
          <ellipse cx={x} cy={y + 3} rx={rx} ry={ry} fill={m.stoneShade} />
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={m.stone} />
          <ellipse cx={x + rx * 0.2} cy={y - ry * 0.25} rx={rx * 0.55} ry={ry * 0.45} fill={m.stoneLit} opacity="0.7" />
        </g>
      ))}
      {night && <Fireflies />}
    </svg>
  );
}

function Bank({ y, m, seed }: { y: number; m: M; seed: number }) {
  const stones = useMemo(() => {
    const r = lcg(seed);
    const out: [number, number, number][] = [];
    for (let x = -60; x < 1660; x += 26 + r() * 26) out.push([x, y + (r() - 0.5) * 6, 9 + r() * 9]);
    return out;
  }, [y, seed]);
  return (
    <g>
      {stones.map(([x, yy, r]) => (
        <g key={x}>
          <ellipse cx={x} cy={yy + 2} rx={r} ry={r * 0.55} fill={m.stoneShade} />
          <ellipse cx={x} cy={yy} rx={r * 0.92} ry={r * 0.5} fill={m.stone} />
        </g>
      ))}
    </g>
  );
}

function Fireflies(): ReactNode {
  const flies = useMemo(() => {
    const r = lcg(11);
    return Array.from({ length: 22 }, () => ({ x: 900 + r() * 700, y: 640 + r() * 220, d: -r() * 6 }));
  }, []);
  return (
    <g>
      {flies.map((q, i) => (
        <circle key={i} className="lookdev-firefly" cx={q.x} cy={q.y} r="2.6" fill="#f4ff9a" style={{ animationDelay: `${q.d}s` }} />
      ))}
    </g>
  );
}

function Petals({ night }: { night: boolean }) {
  const petals = useMemo(() => {
    const r = lcg(7);
    return Array.from({ length: 26 }, () => ({ left: r() * 70, delay: -r() * 14, dur: 9 + r() * 7, size: 6 + r() * 6, sway: 30 + r() * 60 }));
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {petals.map((q, i) => (
        <span
          key={i}
          className="lookdev-petal"
          style={
            {
              left: `${q.left}%`,
              width: q.size,
              height: q.size * 0.62,
              background: night ? '#c9a4c8' : '#f7b8ca',
              animationDuration: `${q.dur}s`,
              animationDelay: `${q.delay}s`,
              '--sway': `${q.sway}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
