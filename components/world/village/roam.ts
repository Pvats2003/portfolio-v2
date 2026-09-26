// Walking on the painted paths: the network is a handful of points on the dirt paths joined by straight edges
// (content/world-scene.ts), in plate fractions. Clicks project onto the nearest edge; routes follow the edges.
import type { Pt } from '@/content/world-scene';

export type WalkNet = { nodes: Record<string, Pt>; edges: [string, string][] };
/** A point on the network: which edge it lies on, and where. */
export type OnNet = { edge: number; pt: Pt };

// The plate is 16:9, so one unit across is 16/9 as long as one unit down.
const AX = 16 / 9;
export const netDist = (a: Pt, b: Pt) => Math.hypot((a[0] - b[0]) * AX, a[1] - b[1]);

/** The nearest point on the network to p. */
export function project(net: WalkNet, p: Pt): OnNet {
  let best: OnNet = { edge: 0, pt: net.nodes[net.edges[0][0]] };
  let bestD = Infinity;
  net.edges.forEach(([a, b], i) => {
    const [ax, ay] = net.nodes[a];
    const [bx, by] = net.nodes[b];
    const dx = (bx - ax) * AX;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1;
    const t = Math.min(1, Math.max(0, (((p[0] - ax) * AX) * dx + (p[1] - ay) * dy) / len2));
    const q: Pt = [ax + (bx - ax) * t, ay + (by - ay) * t];
    const d = netDist(p, q);
    if (d < bestD) {
      bestD = d;
      best = { edge: i, pt: q };
    }
  });
  return best;
}

/** The shortest route along the network between two points on it, as the points to walk through (excluding `from`). */
export function route(net: WalkNet, from: OnNet, to: OnNet): Pt[] {
  if (from.edge === to.edge) return [to.pt];
  const pos: Record<string, Pt> = { ...net.nodes, $from: from.pt, $to: to.pt };
  const adj: Record<string, string[]> = {};
  const link = (a: string, b: string) => {
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  };
  net.edges.forEach(([a, b]) => link(a, b));
  for (const [end, on] of [['$from', from], ['$to', to]] as const) {
    const [a, b] = net.edges[on.edge];
    link(end, a);
    link(end, b);
  }
  // Dijkstra over a few dozen nodes: the simple O(n²) version is plenty.
  const dist: Record<string, number> = { $from: 0 };
  const prev: Record<string, string> = {};
  const done = new Set<string>();
  for (;;) {
    let cur: string | null = null;
    for (const k of Object.keys(dist)) if (!done.has(k) && (cur === null || dist[k] < dist[cur])) cur = k;
    if (cur === null || cur === '$to') break;
    done.add(cur);
    for (const n of adj[cur] ?? []) {
      const d = dist[cur] + netDist(pos[cur], pos[n]);
      if (d < (dist[n] ?? Infinity)) {
        dist[n] = d;
        prev[n] = cur;
      }
    }
  }
  const out: Pt[] = [];
  for (let k: string | undefined = '$to'; k && k !== '$from'; k = prev[k]) out.unshift(pos[k]);
  return out;
}
