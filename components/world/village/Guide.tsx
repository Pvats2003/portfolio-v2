// The guide: a small camera-rig robot (WORLD.md §2.4), drawn in code until there's a painted sprite.
// Boxy body, one round lens for an eye, a short antenna with an orange flag, stubby legs. Its feet are at the
// bottom centre of the 40 × 56 box; the scene positions and scales it from there.
export function GuideRobot() {
  return (
    <svg viewBox="0 0 40 56" width="40" height="56" aria-hidden className="block overflow-visible">
      <ellipse cx="20" cy="55" rx="11" ry="2.6" fill="rgba(20, 24, 32, 0.28)" />
      <g className="guide-sway">
        <rect className="guide-leg guide-leg-a" x="12.5" y="41" width="5" height="13" rx="2.2" fill="#2a2f3b" />
        <rect className="guide-leg guide-leg-b" x="22.5" y="41" width="5" height="13" rx="2.2" fill="#2a2f3b" />
        <g className="guide-body">
          <line x1="25" y1="17" x2="28" y2="6" stroke="#2a2f3b" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M28 6 L35 8.2 L28 10.6 Z" fill="#d9622b" stroke="#2a2f3b" strokeWidth="0.8" strokeLinejoin="round" />
          <rect x="6" y="16" width="28" height="27" rx="6" fill="#efe8da" stroke="#2a2f3b" strokeWidth="1.8" />
          <rect x="8.5" y="36.5" width="23" height="3.2" rx="1.6" fill="#d9622b" opacity="0.85" />
          <rect x="3" y="24" width="3.6" height="9" rx="1.6" fill="#2a2f3b" />
          <rect x="33.4" y="24" width="3.6" height="9" rx="1.6" fill="#2a2f3b" />
          <circle cx="22" cy="27.5" r="7.2" fill="#2a2f3b" />
          <circle cx="22" cy="27.5" r="4.4" fill="#3f78c9" />
          <circle cx="22" cy="27.5" r="1.9" fill="#16233c" />
          <circle cx="20.2" cy="25.6" r="1.3" fill="#fff" opacity="0.9" />
          <circle cx="11" cy="21" r="1.2" fill="#e04a3a" />
        </g>
      </g>
    </svg>
  );
}
