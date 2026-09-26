// Where things are on the painted plates, as fractions of the 3840 × 2160 canvas (0–1, from the top left).
// Tuned on the first land-day draft (Sep 26): the two-storey inn at the centre, roof peak ~30% down, base ~65%.
// If the land plate is regenerated with a different layout, these need re-measuring.

export type Pt = [number, number];

export const plateScene = {
  /** Which point stays in view when the plate is cropped (phones crop the sides heavily). */
  focus: { x: 0.5, y: 0.55 } as { x: number; y: number },
  /** The inn: the clickable area (a polygon following its outline) and where its label sits. */
  inn: {
    polygon: [
      [0.5015, 0.302],
      [0.601, 0.414],
      [0.629, 0.536],
      [0.6246, 0.646],
      [0.3828, 0.646],
      [0.374, 0.536],
      [0.4026, 0.414],
    ] as Pt[],
    label: [0.5015, 0.29] as Pt,
  },
  /** Warm glows that flicker (paper lanterns) — radius as a fraction of the plate width. None painted on this draft. */
  lanterns: [] as { at: Pt; r: number }[],
  /** Windows that glow at night when no night plates are supplied (top-left corner, width, height). */
  windows: [
    { at: [0.4517, 0.4258], w: 0.101, h: 0.043 },
    { at: [0.4356, 0.549], w: 0.033, h: 0.056 },
    { at: [0.4803, 0.556], w: 0.0447, h: 0.078 },
    { at: [0.3917, 0.553], w: 0.027, h: 0.029 },
  ] as { at: Pt; w: number; h: number }[],
  /** Chimney: where smoke rises from, if there is one. (This draft has painted smoke, so none is added.) */
  smoke: null as Pt | null,
  /** Where fireflies drift at night: [left, top, right, bottom] — over the rice paddies on the right. */
  fireflies: [0.66, 0.52, 0.95, 0.78] as [number, number, number, number],
};
