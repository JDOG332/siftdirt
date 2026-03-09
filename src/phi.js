/**
 * Φ DESIGN SYSTEM — Single Source of Truth
 * φ = 1.618033988749895
 *
 * RESPONSIVE TEXT: clamp(min, φ-vmin, max) for fluid scaling
 * ATMOSPHERIC GLOWS: multi-layer text-shadow and box-shadow helpers
 */

export const PHI  = 1.618033988749895;
export const PHIi = 0.618033988749895;

// ── Typography ──
export const F = {
  display: "'Playfair Display', serif",
  body:    "'Inter', sans-serif",
  accent:  "'Cormorant Garamond', serif",
};

// ── Spacing (PHI scale) ──
export const S = {
  _3xs: "0.236rem",
  _2xs: "0.382rem",
  xs:   "0.618rem",
  sm:   "1rem",
  md:   "1.618rem",
  lg:   "2.618rem",
  xl:   "4.236rem",
  _2xl: "6.854rem",
};

// ── Opacity (THREE levels) ──
export const A = {
  full:  1.0,
  phi:   0.618,
  ghost: 0.236,
};

// ── Color helpers ──
export const GOLD  = (a) => `rgba(201,168,76,${a})`;
export const IVORY = (a) => `rgba(232,228,210,${a})`;

// ── Easing ──
export const EASE = "cubic-bezier(0.23,1,0.32,1)";

// ── Responsive Text Sizes (clamp-based, φ-derived vmin midpoints) ──
export const TEXT = {
  hero:    "clamp(28px, 6.854vmin, 48px)",    // φ⁴ vmin — page titles
  title:   "clamp(22px, 4.236vmin, 36px)",    // φ³ vmin — section heads
  heading: "clamp(18px, 2.618vmin, 28px)",    // φ² vmin — sub-headings
  body:    "clamp(15px, 1.618vmin, 22px)",    // φ¹ vmin — body copy
  label:   "clamp(11px, 1.000vmin, 16px)",    // φ⁰ vmin — labels
  caption: "clamp(9px,  0.618vmin, 13px)",    // φ⁻¹ vmin — captions/tags
};

// ── Text Styles (with responsive sizing built in) ──
export const DISPLAY_STYLE = {
  fontFamily: F.display,
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: "-0.0382em",
};

export const BODY_STYLE = {
  fontFamily: F.body,
  fontWeight: 300,
  lineHeight: 1.618,
};

export const ACCENT_STYLE = {
  fontFamily: F.accent,
  fontStyle: "italic",
  fontWeight: 300,
  lineHeight: 1.618,
};

// ── Atmospheric Glow Helpers ──
export function textGlow(rgb, intensity = 1) {
  const a1 = (0.618 * intensity).toFixed(3);
  const a2 = (0.236 * intensity).toFixed(3);
  const a3 = (0.236 * 0.618 * intensity).toFixed(3);
  return `0 0 8px rgba(${rgb},${a1}), 0 0 24px rgba(${rgb},${a2}), 0 0 48px rgba(${rgb},${a3})`;
}

export function boxGlow(rgb, intensity = 1) {
  const a1 = (0.236 * intensity).toFixed(3);
  const a2 = (0.236 * 0.618 * intensity).toFixed(3);
  return `0 0 18px rgba(${rgb},${a1}), 0 0 48px rgba(${rgb},${a2})`;
}

export function innerGlow(rgb, intensity = 1) {
  const a = (0.236 * 0.618 * intensity).toFixed(3);
  return `inset 0 0 24px rgba(${rgb},${a})`;
}
