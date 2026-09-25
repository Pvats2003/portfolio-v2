// Where things are on the painted plates, as fractions of the 3840 × 2160 canvas (0–1, from the top left).
// Hand-tuned once the real plates arrive; until then these match the framing asked for in art/plates/CHECKLIST.md.

export type Pt = [number, number];

export const plateScene = {
  /** Which point stays in view when the plate is cropped (phones crop the sides heavily). */
  focus: { x: 0.5, y: 0.72 } as { x: number; y: number },
  /** The inn: the clickable area (a polygon) and where its label sits. */
  inn: {
    polygon: [
      [0.4, 0.4],
      [0.6, 0.4],
      [0.62, 0.8],
      [0.38, 0.8],
    ] as Pt[],
    label: [0.5, 0.37] as Pt,
  },
  /** Warm glows that flicker (paper lanterns) — radius as a fraction of the plate width. */
  lanterns: [] as { at: Pt; r: number }[],
  /** Windows that glow at night when no night plates are supplied. */
  windows: [] as { at: Pt; w: number; h: number }[],
  /** Chimney: where smoke rises from, if there is one. */
  smoke: null as Pt | null,
  /** Where fireflies drift at night: [left, top, right, bottom]. */
  fireflies: [0.55, 0.62, 0.95, 0.85] as [number, number, number, number],
};
