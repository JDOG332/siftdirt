/**
 * Φ DESIGN SYSTEM — Shared Constants
 * Every value derives from φ = 1.618033988749895
 * NO arbitrary numbers allowed.
 */

// ── Typography ──
export const F = {
  display: "'Playfair Display', serif",
  body:    "'Inter', sans-serif",
  accent:  "'Cormorant Garamond', serif",
};

// ── Spacing (PHI scale ONLY) ──
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

// ── Opacity (THREE levels ONLY) ──
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

// ── Display text style ──
export const DISPLAY_STYLE = {
  fontFamily: F.display,
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: "-0.0382em",
};

// ── Body text style ──
export const BODY_STYLE = {
  fontFamily: F.body,
  fontWeight: 300,
  lineHeight: 1.618,
};

// ── Accent text style ──
export const ACCENT_STYLE = {
  fontFamily: F.accent,
  fontStyle: "italic",
  fontWeight: 300,
};
