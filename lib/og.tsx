import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { Chip } from '@/content/types';

// Shared layout for every sharing image: the Paper theme and the log-entry frame.
export const ogSize = { width: 1200, height: 630 };

const c = { bg: '#f3eee4', ink: '#1e1a15', muted: '#5e564b', line: '#d6ccbb', accent: '#a63a1b', ok: '#2f6b3a' };

async function fonts() {
  const dir = join(process.cwd(), 'assets/fonts');
  const [sans4, sans6, mono5] = await Promise.all([
    readFile(join(dir, 'ibm-plex-sans-latin-400-normal.woff')),
    readFile(join(dir, 'ibm-plex-sans-latin-600-normal.woff')),
    readFile(join(dir, 'ibm-plex-mono-latin-500-normal.woff')),
  ]);
  return [
    { name: 'Plex Sans', data: sans4, weight: 400 as const, style: 'normal' as const },
    { name: 'Plex Sans', data: sans6, weight: 600 as const, style: 'normal' as const },
    { name: 'Plex Mono', data: mono5, weight: 500 as const, style: 'normal' as const },
  ];
}

export async function ogImage({
  marker,
  eyebrow,
  title,
  accentLine,
  subtitle,
  chips = [],
}: {
  marker: string;
  eyebrow: string;
  title: string;
  accentLine?: string;
  subtitle?: string;
  chips?: Chip[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: c.bg,
          color: c.ink,
          fontFamily: 'Plex Sans',
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Plex Mono', fontSize: 24, letterSpacing: 2, textTransform: 'uppercase' }}>
          <span style={{ color: c.accent }}>{marker}</span>
          <span style={{ color: c.muted, marginLeft: 14 }}>· {eyebrow}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `6px solid ${c.accent}`, paddingLeft: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: accentLine ? 60 : 84, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5 }}>
            <span>{title}</span>
            {accentLine && <span style={{ color: c.accent }}>{accentLine}</span>}
          </div>
          {subtitle && <div style={{ display: 'flex', marginTop: 24, fontSize: 34, color: c.muted, lineHeight: 1.3 }}>{subtitle}</div>}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${c.line}`,
            paddingTop: 28,
            fontFamily: 'Plex Mono',
            fontSize: 22,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: c.ink }}>Priyanshu Vats · Field log</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {chips.slice(0, 2).map((chip) => {
              const color = chip.tone === 'ok' ? c.ok : chip.tone === 'accent' ? c.accent : c.muted;
              return (
                <span key={chip.label} style={{ display: 'flex', border: `2px solid ${chip.tone ? color : c.line}`, color, padding: '6px 12px' }}>
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
