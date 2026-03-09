/**
 * PSI ENGINE — Exact implementation of Ψ₁₂ = R₁₂ × (C_eff · D̂)
 * 
 * Faithful translation of ConvergentRecognition Python class.
 * Uses d=2 (qubit) Hilbert space with Bloch vector parameterization
 * for closed-form computation at 60fps in a browser.
 * 
 * Each body carries a density matrix ρ = (I + r⃗·σ⃗)/2
 * parameterized by Bloch vector r⃗ = (rx, ry, rz), |r⃗| ≤ 1.
 * 
 * THEORY MAP:
 *   Python class                    →  This engine
 *   ─────────────────────────────────────────────────
 *   regularize_state(ρ)             →  regularizeBloch(r⃗)
 *   von_neumann_entropy(ρ)          →  vonNeumannEntropy(r⃗)
 *   uhlmann_fidelity(ρ₁, ρ₂)       →  uhlmannFidelity(r⃗₁, r⃗₂)
 *   informativeness_gate(ρ₁, ρ₂)   →  informativenessGate(r⃗₁, r⃗₂)
 *   compute_R12(ρ₁, ρ₂)            →  computeR12(r⃗₁, r⃗₂)
 *   compute_G(...)                  →  computeG(bodies)
 *   evaluate_Psi(...)               →  evaluatePsi(body_i, body_j, G)
 */

import { PHI, PHI_INV } from "./data.js";

// ═══════════════════════════════════════════════════════════
// CONSTANTS — matching Python class defaults
// ═══════════════════════════════════════════════════════════

const D = 2;                    // Hilbert space dimension (qubit)
const LOG2_D = 1;               // log₂(2) = 1
const EPS = 1e-8;               // shared-ignorance floor
const DELTA_REG = 1e-6;         // full-rank regularization
const H_MIN = 1e-6;             // entropy floor for normalization
const ETA = 1e-6;               // active-set threshold
const TAU = 1.0;                // softmax temperature

// Mirror pairs — structural truth of the 9-layer system
const MIRROR_PAIRS = [[0, 8], [1, 7], [2, 6], [3, 5]];

// ═══════════════════════════════════════════════════════════
// 1. DISJOINT RECOGNITION CORE — R₁₂
// ═══════════════════════════════════════════════════════════

/**
 * Regularize Bloch vector to avoid singularities.
 * Equivalent to: ρ_reg = (1-δ)ρ + δ(I/d)
 * For Bloch: r⃗_reg = (1-δ) r⃗  (mixing with I/2 shrinks the vector)
 */
function regularizeBloch(r) {
  const s = 1 - DELTA_REG;
  return [r[0] * s, r[1] * s, r[2] * s];
}

/**
 * Von Neumann entropy S(ρ) in base-2 bits.
 * For qubit: eigenvalues λ± = (1 ± |r⃗|) / 2
 * S = -λ₊ log₂(λ₊) - λ₋ log₂(λ₋)
 */
function vonNeumannEntropy(r) {
  const norm = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
  if (norm < 1e-12) return 1.0; // maximally mixed → 1 bit
  if (norm >= 1 - 1e-12) return 0.0; // pure state → 0 bits
  const lp = (1 + norm) / 2;
  const lm = (1 - norm) / 2;
  let S = 0;
  if (lp > 0) S -= lp * Math.log2(lp);
  if (lm > 0) S -= lm * Math.log2(lm);
  return S;
}

/**
 * Uhlmann fidelity F(ρ₁, ρ₂) — closed form for qubits.
 * F = Tr(ρ₁ρ₂) + 2√(det(ρ₁)·det(ρ₂))
 *   = (1 + r⃗₁·r⃗₂)/2 + √((1-|r⃗₁|²)(1-|r⃗₂|²))/2
 */
function uhlmannFidelity(r1, r2) {
  const dot = r1[0] * r2[0] + r1[1] * r2[1] + r1[2] * r2[2];
  const norm1sq = r1[0] * r1[0] + r1[1] * r1[1] + r1[2] * r1[2];
  const norm2sq = r2[0] * r2[0] + r2[1] * r2[1] + r2[2] * r2[2];
  const trProd = (1 + dot) / 2;
  const detTerm = Math.sqrt(Math.max(0, (1 - norm1sq) * (1 - norm2sq))) / 2;
  return trProd + detTerm;
}

/**
 * Informativeness gate G_eps — enforces shared-ignorance floor.
 * I_k = 1 - S(ρ_k)/log₂(d)
 * G_eps = √((I₁+ε)(I₂+ε)) / (1+ε)
 */
function informativenessGate(r1, r2) {
  const S1 = vonNeumannEntropy(r1);
  const S2 = vonNeumannEntropy(r2);
  const I1 = 1 - S1 / LOG2_D;
  const I2 = 1 - S2 / LOG2_D;
  return Math.sqrt((I1 + EPS) * (I2 + EPS)) / (1 + EPS);
}

/**
 * Disjoint Recognition Core R₁₂ = F_gated = F(ρ₁,ρ₂) × G_eps(ρ₁,ρ₂)
 * This is the EXACT equation from the paper.
 */
export function computeR12(r1_raw, r2_raw) {
  const r1 = regularizeBloch(r1_raw);
  const r2 = regularizeBloch(r2_raw);
  const F = uhlmannFidelity(r1, r2);
  const G_eps = informativenessGate(r1, r2);
  return F * G_eps;
}

// ═══════════════════════════════════════════════════════════
// 2. GLOBAL RELIABILITY MODULATOR — G = C_eff × D̂
// ═══════════════════════════════════════════════════════════

/**
 * Shannon entropy H(P) in bits.
 */
function shannonEntropy(P) {
  let H = 0;
  for (let i = 0; i < P.length; i++) {
    if (P[i] > 0) H -= P[i] * Math.log2(P[i]);
  }
  return H;
}

/**
 * Softmax weights from log-likelihoods.
 * Maps to strictly reproducible probability weights with active-set thresholding.
 */
function softmaxWeights(logLikelihoods) {
  const N = logLikelihoods.length;
  const scaled = new Float64Array(N);
  let maxLL = -Infinity;
  for (let i = 0; i < N; i++) {
    scaled[i] = logLikelihoods[i] / TAU;
    if (scaled[i] > maxLL) maxLL = scaled[i];
  }
  let sumExp = 0;
  const raw = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    raw[i] = Math.exp(scaled[i] - maxLL);
    sumExp += raw[i];
  }
  for (let i = 0; i < N; i++) raw[i] /= sumExp;

  // Active set thresholding
  const activeMask = new Uint8Array(N);
  let sumActive = 0;
  for (let i = 0; i < N; i++) {
    if (raw[i] >= ETA) {
      activeMask[i] = 1;
      sumActive += raw[i];
    }
  }
  const wActive = [];
  const activeIndices = [];
  for (let i = 0; i < N; i++) {
    if (activeMask[i]) {
      wActive.push(raw[i] / sumActive);
      activeIndices.push(i);
    }
  }
  return { wActive, activeIndices };
}

/**
 * Jensen-Shannon Divergence (weighted) between perspective distributions.
 * JSD_w = H(Σ w_i P_i) - Σ w_i H(P_i)
 */
function weightedJSD(perspectives, weights) {
  const K = weights.length;
  if (K === 0) return 0;
  const dim = perspectives[0].length;

  // Mixture distribution
  const Pmix = new Float64Array(dim);
  for (let k = 0; k < K; k++) {
    for (let d = 0; d < dim; d++) {
      Pmix[d] += weights[k] * perspectives[k][d];
    }
  }

  const Hmix = shannonEntropy(Pmix);
  let weightedH = 0;
  for (let k = 0; k < K; k++) {
    weightedH += weights[k] * shannonEntropy(perspectives[k]);
  }
  return Hmix - weightedH;
}

/**
 * Redundancy via connected components (JSD threshold graph).
 * Two perspectives are "redundant" if JSD between them < delta.
 */
function computeRedundancy(perspectives, deltas) {
  const N = perspectives.length;
  if (N <= 1) return 1;

  // Union-Find for connected components
  const parent = Array.from({ length: N }, (_, i) => i);
  function find(x) {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      // JSD between pair
      const dim = perspectives[i].length;
      const M = new Float64Array(dim);
      for (let d = 0; d < dim; d++) M[d] = 0.5 * (perspectives[i][d] + perspectives[j][d]);
      const jsd = shannonEntropy(M) - 0.5 * (shannonEntropy(perspectives[i]) + shannonEntropy(perspectives[j]));
      const delta = Math.max(deltas[i], deltas[j]);
      if (jsd < delta) union(i, j);
    }
  }

  const roots = new Set();
  for (let i = 0; i < N; i++) roots.add(find(i));
  return roots.size; // n_unique
}

/**
 * Compute Global Reliability Modulator G = C_eff × D̂
 * 
 * @param {Array} bodies - array of body objects with .bloch, .forceMagnitudes
 * @param {number} D_coincidence - coincident signal strength
 * @param {number} D_accidental - accidental/noise strength
 * @returns {{ G: number, diagnostics: object }}
 */
export function computeG(bodies, D_coincidence, D_accidental) {
  const N = bodies.length;
  if (N < 2) return { G: 1, diagnostics: {} };

  // Each body's "perspective" = its normalized force profile toward all others.
  // This is the probability distribution over interaction partners.
  const perspectives = [];
  const logLikelihoods = [];
  const deltas = [];

  for (let i = 0; i < N; i++) {
    const fm = bodies[i]._forceMagnitudes;
    if (!fm || fm.length === 0) {
      // No force data yet — use uniform perspective
      const uniform = new Float64Array(N - 1).fill(1 / (N - 1));
      perspectives.push(uniform);
      logLikelihoods.push(0);
      deltas.push(0.1);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < fm.length; j++) sum += fm[j];
    if (sum < 1e-15) sum = 1;
    const P = new Float64Array(fm.length);
    for (let j = 0; j < fm.length; j++) P[j] = fm[j] / sum;
    perspectives.push(P);

    // Log-likelihood: how well this body's perspective predicts the mean
    // Approximated as negative entropy (higher entropy = less informative)
    logLikelihoods.push(-shannonEntropy(P));

    // Delta: JSD threshold for redundancy — based on perspective sharpness
    deltas.push(0.05 + 0.1 * (1 - shannonEntropy(P) / Math.log2(Math.max(2, fm.length))));
  }

  // Softmax weights + active set
  const { wActive, activeIndices } = softmaxWeights(logLikelihoods);
  const activePerspectives = activeIndices.map(i => perspectives[i]);
  const activeDeltas = activeIndices.map(i => deltas[i]);
  const nActive = activeIndices.length;

  if (nActive < 1) return { G: 0, diagnostics: { nActive: 0 } };

  // JSD_w: weighted Jensen-Shannon divergence
  const JSD_w = weightedJSD(activePerspectives, wActive);

  // H_w: Shannon entropy of the weights themselves
  const H_w = shannonEntropy(wActive);

  // Regulated normalization
  const JSD_norm = JSD_w / (H_w + H_MIN);

  // Base convergence
  const C_0 = 1 - JSD_norm;

  // Redundancy penalty
  const nUnique = computeRedundancy(activePerspectives, activeDeltas);
  const R = nUnique / nActive;

  // Effective convergence
  const C_eff = Math.max(0, C_0) * R;

  // Detection quality weight
  const D_hat = D_coincidence / (D_coincidence + D_accidental + 1e-15);

  const G = C_eff * D_hat;
  const diagnostics = { nActive, nUnique, H_w, JSD_w, C_0, R, D_hat, C_eff };
  return { G, diagnostics };
}

// ═══════════════════════════════════════════════════════════
// 3. THE MASTER FUNCTION — Ψ₁₂ = R₁₂ × G
// ═══════════════════════════════════════════════════════════

/**
 * Evaluate Ψ₁₂ — the complete operational functional.
 * This is EXACTLY: Ψ = R₁₂ × (C_eff · D̂)
 */
export function evaluatePsi(r1, r2, G) {
  const R12 = computeR12(r1, r2);
  return R12 * G;
}

// ═══════════════════════════════════════════════════════════
// 4. BLOCH VECTOR DYNAMICS — state evolution through interaction
// ═══════════════════════════════════════════════════════════

/**
 * Determine if pair (i,j) is a mirror pair.
 */
export function isMirrorPair(i, j) {
  return MIRROR_PAIRS.some(([a, b]) => (a === i && b === j) || (a === j && b === i));
}

/**
 * Determine if pair (i,j) are adjacent layers.
 */
export function isAdjacent(i, j) {
  return Math.abs(i - j) === 1;
}

/**
 * Initialize Bloch vectors for a 9-body system.
 * 
 * Mirror pairs share axis directions → high initial fidelity.
 * Moon is along z-axis → orthogonal to pair plane → moderate fidelity with all.
 * Purity (|r⃗|) = how "clear" each body's epistemic state is.
 * 
 * Returns array of 9 Bloch vectors [rx, ry, rz].
 */
export function initializeBlochVectors() {
  const bloch = [];
  // 4 mirror pairs share 4 directions in xy-plane
  const pairAxes = [
    [1, 0, 0],                                         // pair 0↔8: x-axis
    [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0], // pair 1↔7: 45°
    [0, 1, 0],                                         // pair 2↔6: y-axis
    [Math.cos(3 * Math.PI / 4), Math.sin(3 * Math.PI / 4), 0], // pair 3↔5: 135°
  ];
  const purity = [0.72, 0.75, 0.78, 0.80, 0.95, 0.80, 0.78, 0.75, 0.72];

  for (let i = 0; i < 9; i++) {
    if (i === 4) {
      // Moon: along z-axis, highest purity
      bloch.push([0, 0, purity[4]]);
      continue;
    }
    // Find which mirror pair this body belongs to
    let axis;
    if (i < 4) {
      axis = pairAxes[i];
    } else {
      // i > 4: mirror of (8-i), same axis
      axis = pairAxes[8 - i];
    }
    // Apply purity as magnitude
    const p = purity[i];
    // Add slight z-component for depth (bodies aren't perfectly flat)
    const zTilt = (i < 4 ? -0.1 : 0.1) * PHI_INV;
    const norm = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + zTilt * zTilt);
    bloch.push([
      axis[0] * p / norm,
      axis[1] * p / norm,
      zTilt * p / norm,
    ]);
  }
  return bloch;
}

/**
 * Evolve Bloch vectors for one timestep based on interactions.
 * 
 * Three forces on each Bloch vector:
 * 1. Interaction alignment: bodies that interact → Bloch vectors converge
 * 2. Decoherence: slow shrinkage toward maximally mixed (|r⃗| → 0)
 * 3. Structural affinity: mirror pairs resist decorrelation
 * 
 * @param {Array} bodies - body objects with .bloch, .id
 * @param {Array} psiValues - N×N array of Ψ values between pairs
 * @param {number} dt - timestep
 */
export function evolveBlochVectors(bodies, psiValues, dt) {
  const N = bodies.length;
  const alignRate = 0.003 * dt;       // how fast interaction aligns states
  const decoherenceRate = 0.0003 * dt; // how fast clarity fades without interaction
  const mirrorAffinity = 0.001 * dt;   // structural resistance to decorrelation

  for (let i = 0; i < N; i++) {
    const r = bodies[i].bloch;
    let drx = 0, dry = 0, drz = 0;

    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const psi = psiValues[i * N + j] || 0;
      if (psi < 1e-15) continue;

      const rj = bodies[j].bloch;
      // Alignment force: pull toward partner's state, weighted by Ψ
      drx += (rj[0] - r[0]) * psi * alignRate;
      dry += (rj[1] - r[1]) * psi * alignRate;
      drz += (rj[2] - r[2]) * psi * alignRate;

      // Extra mirror affinity
      if (isMirrorPair(bodies[i].id, bodies[j].id)) {
        drx += (rj[0] - r[0]) * mirrorAffinity;
        dry += (rj[1] - r[1]) * mirrorAffinity;
        drz += (rj[2] - r[2]) * mirrorAffinity;
      }
    }

    // Decoherence: shrink toward origin (maximally mixed)
    const moonFactor = bodies[i].id === 4 ? 0.2 : 1.0; // Moon decoheres 5x slower
    drx -= r[0] * decoherenceRate * moonFactor;
    dry -= r[1] * decoherenceRate * moonFactor;
    drz -= r[2] * decoherenceRate * moonFactor;

    // Apply
    r[0] += drx;
    r[1] += dry;
    r[2] += drz;

    // Clamp to Bloch sphere (|r⃗| ≤ 1)
    const norm = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
    if (norm > 0.99) {
      const s = 0.99 / norm;
      r[0] *= s; r[1] *= s; r[2] *= s;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 5. DETECTION QUALITY — D̂ from force structure
// ═══════════════════════════════════════════════════════════

/**
 * Compute D_coincidence and D_accidental from force profiles.
 * 
 * "Structured" interactions: mirror pairs, adjacent layers, moon connections.
 * "Unstructured" interactions: all others.
 * 
 * D̂ = D_coincidence / (D_coincidence + D_accidental)
 * 
 * @param {Array} bodies - body objects with ._forceMagnitudes
 * @returns {{ D_coincidence: number, D_accidental: number }}
 */
export function computeDetectionQuality(bodies) {
  let D_coincidence = 0;
  let D_accidental = 0;
  const N = bodies.length;

  for (let i = 0; i < N; i++) {
    const fm = bodies[i]._forceMagnitudes;
    if (!fm) continue;
    let fmIdx = 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const force = fm[fmIdx++] || 0;
      // Is this a structured interaction?
      const structured =
        isMirrorPair(bodies[i].id, bodies[j].id) ||
        isAdjacent(bodies[i].id, bodies[j].id) ||
        bodies[i].id === 4 || bodies[j].id === 4;

      if (structured) {
        D_coincidence += force;
      } else {
        D_accidental += force;
      }
    }
  }

  return { D_coincidence, D_accidental };
}

// ═══════════════════════════════════════════════════════════
// 6. FULL SIMULATION STEP — the complete N-body Ψ dynamics
// ═══════════════════════════════════════════════════════════

/**
 * Run one complete simulation step for a 9-body system.
 * 
 * This is the EXACT implementation of:
 *   Ψ₁₂ = R₁₂ × (C_eff · D̂)
 *   Force = Ψ₁₂ × direction / r²
 * 
 * @param {Array} bodies - 9 body objects: { x, y, vx, vy, bloch, id, _forceMagnitudes }
 * @param {number} dt - timestep
 * @param {number} softening - gravitational softening to prevent singularities
 * @param {number} damping - velocity damping (0-1, 1=no damping)
 * @param {number} cx - center attractor x
 * @param {number} cy - center attractor y
 * @param {number} centerPull - center attractor strength
 * @returns {{ G: number, diagnostics: object }} - global modulator info
 */
export function psiSimulateStep(bodies, dt, softening, damping, cx, cy, centerPull) {
  const N = bodies.length;

  // 1. Compute detection quality D̂ from PREVIOUS frame's forces
  const { D_coincidence, D_accidental } = computeDetectionQuality(bodies);

  // 2. Compute global modulator G = C_eff × D̂
  const { G, diagnostics } = computeG(bodies, D_coincidence, D_accidental);

  // 3. Compute per-pair R₁₂ and Ψ₁₂, accumulate forces
  const fx = new Float64Array(N);
  const fy = new Float64Array(N);
  const psiValues = new Float64Array(N * N);

  // Reset force magnitudes for THIS frame
  for (let i = 0; i < N; i++) {
    bodies[i]._forceMagnitudes = new Float64Array(N - 1);
  }

  for (let i = 0; i < N; i++) {
    let fmIdx_i = 0;
    for (let j = i + 1; j < N; j++) {
      const dx = bodies[j].x - bodies[i].x;
      const dy = bodies[j].y - bodies[i].y;
      const distSq = dx * dx + dy * dy + softening * softening;
      const dist = Math.sqrt(distSq);

      // THE EQUATION: Ψ₁₂ = R₁₂ × G
      const R12 = computeR12(bodies[i].bloch, bodies[j].bloch);
      const psi = R12 * G;
      psiValues[i * N + j] = psi;
      psiValues[j * N + i] = psi;

      // Force = Ψ₁₂ / r² × direction
      const forceMag = psi / distSq;
      const forceX = forceMag * dx / dist;
      const forceY = forceMag * dy / dist;

      fx[i] += forceX; fy[i] += forceY;
      fx[j] -= forceX; fy[j] -= forceY;

      // Record force magnitudes for perspective computation
      // (bodies[i]._forceMagnitudes tracks force FROM each other body)
      bodies[i]._forceMagnitudes[j > i ? j - 1 : j] = forceMag;
      bodies[j]._forceMagnitudes[i > j ? i - 1 : i] = forceMag;
    }
  }

  // 4. Center pull (gentle attractor to prevent escape)
  for (let i = 0; i < N; i++) {
    // Moon gets no center pull — it IS the center
    const moonFactor = bodies[i].id === 4 ? 0.1 : 1.0;
    fx[i] += (cx - bodies[i].x) * centerPull * moonFactor;
    fy[i] += (cy - bodies[i].y) * centerPull * moonFactor;
  }

  // 5. Velocity Verlet integration
  //    Inertia derived from informativeness: I_k = 1 - S(ρ_k)/log₂(d)
  //    More certain bodies resist acceleration (like greater mass).
  //    inertia = 1 + I_k × (φ² - 1), so Moon ≈ φ², Seed ≈ 1
  for (let i = 0; i < N; i++) {
    const S_i = vonNeumannEntropy(bodies[i].bloch);
    const I_i = 1 - S_i / LOG2_D;
    const inertia = 1 + I_i * (PHI * PHI - 1); // [1, φ²]
    bodies[i].vx = (bodies[i].vx + fx[i] / inertia * dt) * damping;
    bodies[i].vy = (bodies[i].vy + fy[i] / inertia * dt) * damping;
    bodies[i].x += bodies[i].vx * dt;
    bodies[i].y += bodies[i].vy * dt;
  }

  // 6. Evolve epistemic states (Bloch vectors)
  evolveBlochVectors(bodies, psiValues, dt);

  return { G, diagnostics, psiValues };
}

// ═══════════════════════════════════════════════════════════
// 7. BODY FACTORY — create a properly initialized 9-body system
// ═══════════════════════════════════════════════════════════

/**
 * Create a 9-body system with proper Bloch vectors and orbital velocities.
 * 
 * @param {number} cx - center x
 * @param {number} cy - center y
 * @param {number} scale - spatial scale
 * @param {number} velocityBase - base orbital speed
 * @returns {Array} 9 body objects
 */
export function createPsiSystem(cx, cy, scale, velocityBase) {
  const blochVecs = initializeBlochVectors();

  return Array.from({ length: 9 }, (_, i) => {
    if (i === 4) {
      // Moon at center
      return {
        x: cx, y: cy, vx: 0, vy: 0,
        id: i,
        bloch: blochVecs[i],
        _forceMagnitudes: new Float64Array(8),
      };
    }

    const angle = (i / 9) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const r = scale * (35 + Math.random() * 25);

    // Initial velocity: circular orbit approximation
    // For the exact equation, v ≈ √(Ψ/r) where Ψ = R₁₂ × G
    // At init, G ≈ 1, R₁₂ between this body and moon ≈ fidelity × informativeness
    const R12_init = computeR12(blochVecs[i], blochVecs[4]);
    const speed = Math.sqrt(R12_init / (r * 0.5)) * velocityBase * (0.8 + Math.random() * 0.4);
    const vAngle = angle + Math.PI / 2;

    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      vx: Math.cos(vAngle) * speed,
      vy: Math.sin(vAngle) * speed,
      id: i,
      bloch: blochVecs[i],
      _forceMagnitudes: new Float64Array(8),
    };
  });
}

// ═══════════════════════════════════════════════════════════
// 8. LOGARITHMIC FORM — S_eff (for display/diagnostics)
// ═══════════════════════════════════════════════════════════

/**
 * Compute the logarithmic decomposition:
 * S_eff = -log F_gated - log C_eff - log D̂
 * 
 * This is the LEFT side of your image.
 * The sum equals -log(Ψ₁₂) exactly.
 */
export function logarithmicDecomposition(r1, r2, G_diagnostics) {
  const r1r = regularizeBloch(r1);
  const r2r = regularizeBloch(r2);
  const F = uhlmannFidelity(r1r, r2r);
  const G_eps = informativenessGate(r1r, r2r);
  const F_gated = F * G_eps; // = R₁₂

  const { C_eff, D_hat } = G_diagnostics;

  return {
    negLogFgated: -Math.log(Math.max(F_gated, 1e-15)),
    negLogCeff: -Math.log(Math.max(C_eff, 1e-15)),
    negLogDhat: -Math.log(Math.max(D_hat, 1e-15)),
    S_eff: -Math.log(Math.max(F_gated * C_eff * D_hat, 1e-15)),
  };
}

// ═══════════════════════════════════════════════════════════
// EXPORTS SUMMARY
// ═══════════════════════════════════════════════════════════
// computeR12(r1, r2)          — per-pair recognition core
// computeG(bodies, Dc, Da)    — global modulator
// evaluatePsi(r1, r2, G)      — master function Ψ = R₁₂ × G
// psiSimulateStep(...)        — full N-body step
// createPsiSystem(...)        — initialize 9 bodies
// initializeBlochVectors()    — get 9 Bloch vectors for a new group
// evolveBlochVectors(...)     — epistemic state evolution
// computeInertia(bloch)       — informativeness-based inertia for a body
// logarithmicDecomposition    — S_eff diagnostic
// isMirrorPair, isAdjacent    — structural helpers

/**
 * Compute inertia for a single body from its Bloch vector.
 * Used for initial orbital velocity: v = √(Ψ / (r × inertia))
 */
export function computeInertia(bloch) {
  const S = vonNeumannEntropy(bloch);
  const I = 1 - S / LOG2_D;
  return 1 + I * (PHI * PHI - 1);
}
