/**
 * WIKI ENGINE — 3 Algorithms Working Together
 *
 * SOURCE:  Wikipedia.org free API
 * OUTPUT:  Bullet points with small words & emojis, ranked by truth
 *
 * ALGORITHM 1: Ψ TRUTH SCORING
 *   R₁₂ = Fidelity × Informativeness Gate
 *   G   = Convergence × Detection Quality
 *   Ψ   = R₁₂ × G
 *   → Finds which sentences carry the most truth
 *
 * ALGORITHM 2: READABILITY SCORING
 *   Flesch-style simplicity: shorter words, shorter sentences
 *   Penalizes jargon, rewards plain language
 *   → Ensures output is accessible at ~3rd grade level
 *
 * ALGORITHM 3: TEXT SIMPLIFICATION
 *   Strips parentheticals, Latin abbreviations, academic hedging
 *   Removes "which is known as", "referred to as", etc.
 *   Truncates to ~20 words max
 *   → Cleans raw Wikipedia into plain human language
 *
 * INTERNAL: Math is used for scoring. NEVER shown to user.
 * OUTPUT:   Emoji + simplified sentence. Ordered high truth → low.
 */

import { tokenize } from "./mirrorIndex.js";

// ── Stop words ──
const STOP = new Set([
  "the","a","an","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","shall","should","may","might","can","could",
  "to","of","in","for","on","with","at","by","from","as","into","through","during",
  "before","after","above","below","between","under","again","further","then","once",
  "that","this","these","those","it","its","he","she","they","them","his","her",
  "their","we","our","you","your","which","who","whom","what","where","when","how",
  "all","each","every","both","few","more","most","other","some","such","no","not",
  "only","own","same","so","than","too","very","also","just","about","up","out",
  "if","or","and","but","nor","yet","because","while","although","since","until",
  "one","two","first","second","new","used","many","may","also","often","called",
  "known","however","since","well","much","made","over","between","three","four",
]);

function stripStop(tokens) {
  return tokens.filter(t => !STOP.has(t) && t.length > 2);
}

// ── Topic-appropriate emoji selection ──
const TOPIC_EMOJIS = [
  ["science","physics","atom","quantum","energy","force","light","wave"],
  ["life","biology","cell","organism","animal","plant","species","evolution"],
  ["earth","planet","rock","ocean","mountain","water","climate","geology"],
  ["history","war","king","empire","ancient","century","civilization","dynasty"],
  ["math","number","equation","formula","theorem","geometry","algebra","calculus"],
  ["mind","brain","consciousness","thought","memory","dream","psychology","perception"],
  ["art","music","paint","dance","song","beauty","create","expression"],
  ["love","heart","family","bond","connection","relationship","care","trust"],
  ["god","spirit","sacred","divine","prayer","faith","holy","soul"],
  ["star","space","universe","cosmos","galaxy","moon","sun","telescope"],
];
const TOPIC_EMOJI_MAP = [
  "⚡","🌱","🌍","📜","🔢","🧠","🎨","💛","✨","🌌",
];
const FALLBACK_EMOJIS = ["🔑","💡","✦","🌟","🎯"];

function pickEmoji(text, index) {
  const lower = text.toLowerCase();
  for (let t = 0; t < TOPIC_EMOJIS.length; t++) {
    for (const kw of TOPIC_EMOJIS[t]) {
      if (lower.includes(kw)) return TOPIC_EMOJI_MAP[t];
    }
  }
  return FALLBACK_EMOJIS[index] || "•";
}

// ═══════════════════════════════════════════════════════════
// ALGORITHM 3: TEXT SIMPLIFICATION
// Strip academic cruft, parentheticals, jargon markers
// ═══════════════════════════════════════════════════════════

function simplifyText(text, maxWords = 20) {
  let s = text;

  // Strip parenthetical content: "(also known as foo)" "(Latin: bar)" "(c. 1450)"
  s = s.replace(/\s*\([^)]*\)/g, "");

  // Strip Wikipedia section headers: === Title === or == Title ==
  s = s.replace(/={2,}\s*[^=]+\s*={2,}\s*/g, "");

  // Strip square bracket references: [1] [citation needed]
  s = s.replace(/\s*\[[^\]]*\]/g, "");

  // Strip academic hedging phrases
  const hedges = [
    /\b(?:it is|it was|it has been) (?:widely |generally |commonly )?(?:believed|thought|considered|regarded|known|accepted|understood|recognized) (?:that |to be )?/gi,
    /\b(?:which is|that is|who is|who was|which was|that was) (?:also |often |sometimes |commonly |generally )?(?:known|referred to|called|described|defined) as /gi,
    /\bin (?:the )?(?:field|area|domain|discipline|study|context) of /gi,
    /\baccording to (?:many |most |some )?(?:scholars|scientists|researchers|experts|historians|studies)/gi,
  ];
  for (const h of hedges) s = s.replace(h, "");

  // Strip leading conjunctions/transitions
  s = s.replace(/^(?:however|moreover|furthermore|additionally|consequently|therefore|nevertheless|thus|hence|indeed|specifically|essentially|basically|fundamentally)[,;]?\s*/i, "");

  // Clean up double spaces, leading/trailing whitespace
  s = s.replace(/\s+/g, " ").trim();

  // Truncate to maxWords
  const words = s.split(/\s+/);
  if (words.length > maxWords) {
    s = words.slice(0, maxWords).join(" ");
    // End cleanly — at last sentence boundary or add ...
    const lastPeriod = s.lastIndexOf(".");
    if (lastPeriod > s.length * 0.5) {
      s = s.slice(0, lastPeriod + 1);
    } else {
      s += "...";
    }
  }

  // Capitalize first letter
  if (s.length > 0) s = s[0].toUpperCase() + s.slice(1);

  return s;
}

// ═══════════════════════════════════════════════════════════
// ALGORITHM 2: READABILITY SCORING
// Flesch-style: shorter words + shorter sentences = higher score
// ═══════════════════════════════════════════════════════════

function readabilityScore(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;

  // Average word length — shorter = more readable
  const avgWordLen = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length, 0) / words.length;
  // Ideal: 4-5 chars. Penalize long words heavily.
  const wordScore = Math.max(0, 1 - Math.max(0, avgWordLen - 4) / 6);

  // Sentence length — 8-15 words is sweet spot
  const lenScore = words.length <= 15
    ? Math.min(1, words.length / 6)
    : Math.max(0.2, 1 - (words.length - 15) / 25);

  // Jargon penalty — count words > 10 chars (likely jargon)
  const longWords = words.filter(w => w.replace(/[^a-zA-Z]/g, "").length > 10).length;
  const jargonPenalty = Math.max(0, 1 - longWords / Math.max(1, words.length) * 3);

  // Comma density — too many clauses = complex
  const commas = (text.match(/,/g) || []).length;
  const commaPenalty = Math.max(0.3, 1 - commas / Math.max(1, words.length) * 4);

  return wordScore * lenScore * jargonPenalty * commaPenalty;
}

// ═══════════════════════════════════════════════════════════
// ALGORITHM 1: Ψ TRUTH SCORING
// R₁₂ = Fidelity × Informativeness Gate
// G   = Convergence × Detection Quality
// Ψ   = R₁₂ × G
// ═══════════════════════════════════════════════════════════

function scoreSentences(sentences) {
  const processed = sentences.map(s => {
    const tokens = stripStop(tokenize(s));
    return { text: s, tokens, tokenSet: new Set(tokens) };
  });

  // Document frequency
  const df = new Map();
  for (const p of processed) {
    for (const t of p.tokenSet) {
      df.set(t, (df.get(t) || 0) + 1);
    }
  }
  const N = processed.length;

  const scored = [];

  for (let i = 0; i < processed.length; i++) {
    const sent = processed[i];
    if (sent.tokens.length < 3) continue;

    // ── R₁₂ = Fidelity × Informativeness ──
    let echoSum = 0;
    for (let j = 0; j < processed.length; j++) {
      if (i === j) continue;
      const other = processed[j];
      if (other.tokens.length < 2) continue;
      let shared = 0;
      for (const t of sent.tokens) {
        if (other.tokenSet.has(t)) shared++;
      }
      echoSum += shared / sent.tokens.length;
    }
    const fidelity = N > 1 ? echoSum / (N - 1) : 0;

    let idfSum = 0;
    for (const t of sent.tokens) {
      const freq = df.get(t) || 1;
      idfSum += Math.log(N / freq);
    }
    const G_eps = Math.min(1, (idfSum / sent.tokens.length) / Math.log(N || 2));
    const R12 = fidelity * G_eps;

    // ── G = Convergence × Detection ──
    const topTokens = [...df.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(e => e[0]);
    let coreHits = 0;
    for (const t of topTokens) {
      if (sent.tokenSet.has(t)) coreHits++;
    }
    const C_eff = topTokens.length > 0 ? coreHits / topTokens.length : 0;

    const len = sent.tokens.length;
    const D_hat = len <= 20
      ? Math.min(1, len / 8)
      : Math.max(0.3, 1 - (len - 20) / 40);

    const G = C_eff * D_hat;

    // ── Ψ = R₁₂ × G ──
    const psi = R12 * G;

    // ── COMBINE: Truth × Readability ──
    // Weight truth at 0.618 (φ⁻¹), readability at 0.382 (φ⁻²)
    // This ensures we prefer SIMPLE truths over complex ones
    const readability = readabilityScore(sent.text);
    const combined = psi * 0.618 + readability * psi * 0.382;

    scored.push({
      originalText: sent.text,
      simplified: simplifyText(sent.text, 30),
      score: combined,
    });
  }

  return scored;
}

// ═══════════════════════════════════════════════════════════
// MAIN: FETCH → SCORE → SIMPLIFY → RETURN
//
// THE HACK: Wikipedia already built our "LLM."
// simple.wikipedia.org = entire encyclopedia rewritten by
// humans at ~3rd grade reading level. Same API. Same structure.
// We try SIMPLE first. If no article exists, fall back to
// regular English Wikipedia + our algorithmic simplification.
// ═══════════════════════════════════════════════════════════

const SIMPLE_API = "https://simple.wikipedia.org/w/api.php";
const FULL_API   = "https://en.wikipedia.org/w/api.php";

// Fetch article extract from a specific Wikipedia API endpoint
async function fetchFromWiki(apiBase, searchTerm) {
  // Step 1: Search
  const searchUrl = new URL(apiBase);
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", searchTerm);
  searchUrl.searchParams.set("srlimit", "1");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("origin", "*");

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return null;
  const searchData = await searchRes.json();
  const title = searchData.query?.search?.[0]?.title;
  if (!title) return null;

  // Step 2: Fetch full article extract
  const extractUrl = new URL(apiBase);
  extractUrl.searchParams.set("action", "query");
  extractUrl.searchParams.set("titles", title);
  extractUrl.searchParams.set("prop", "extracts");
  extractUrl.searchParams.set("explaintext", "1");
  extractUrl.searchParams.set("redirects", "1");
  extractUrl.searchParams.set("format", "json");
  extractUrl.searchParams.set("origin", "*");

  const extractRes = await fetch(extractUrl);
  if (!extractRes.ok) return null;
  const extractData = await extractRes.json();
  const pages = extractData.query?.pages || {};
  const page = Object.values(pages)[0];
  const extract = page?.extract || "";
  const pageId = page?.pageid;

  if (!extract || extract.length < 100) return null;

  const isSimple = apiBase.includes("simple.");
  const url = pageId
    ? `https://${isSimple ? "simple" : "en"}.wikipedia.org/?curid=${pageId}`
    : `https://${isSimple ? "simple" : "en"}.wikipedia.org/wiki/${encodeURIComponent(title)}`;

  return { title, extract, url, isSimple };
}

export async function fetchWiki(query) {
  if (!query || query.trim().length < 2) return null;

  const keywords = stripStop(tokenize(query));
  const searchTerm = keywords.length > 0 ? keywords.join(" ") : query.trim();

  // ── TRY SIMPLE ENGLISH WIKIPEDIA FIRST ──
  // This is the key insight: simple.wikipedia.org is an entire
  // encyclopedia already written at 3rd-5th grade level by humans.
  // No AI needed. The simplification already happened.
  let result = await fetchFromWiki(SIMPLE_API, searchTerm);
  let usedSimple = true;

  // ── FALL BACK TO REGULAR ENGLISH ──
  if (!result) {
    result = await fetchFromWiki(FULL_API, searchTerm);
    usedSimple = false;
  }

  if (!result) return { title: query, url: null, points: [] };

  const { title, extract, url } = result;
  // Step 3: Split into sentences
  const sentences = extract
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.split(/\s+/).length >= 4);

  // Step 4: Run all 3 algorithms
  const scored = scoreSentences(sentences);

  // Step 5: Sort by combined score (truth × readability), take top 5
  scored.sort((a, b) => b.score - a.score);

  // De-duplicate similar points
  const seen = new Set();
  const unique = [];
  for (const s of scored) {
    // Skip if too similar to an already-picked point
    const key = s.simplified.slice(0, 30).toLowerCase();
    const isDupe = [...seen].some(k => {
      let overlap = 0;
      for (const w of key.split(/\s+/)) {
        if (k.includes(w)) overlap++;
      }
      return overlap > 3;
    });
    if (isDupe) continue;
    seen.add(key);
    unique.push(s);
    if (unique.length >= 5) break;
  }

  // Step 6: Format output — NO scores shown, just emoji + simple text
  const points = unique.map((s, i) => ({
    text: s.simplified,
    emoji: pickEmoji(s.simplified, i),
  }));

  return { title, url, points, source: usedSimple ? "simple" : "full" };
}
