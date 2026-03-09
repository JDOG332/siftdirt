/**
 * WIKI ENGINE — Fetch Wikipedia, score sentences against each other
 *
 * The article scores ITSELF. Sentences that echo concepts found
 * across the rest of the article are core truths.
 *
 * fetchWiki(query) → { title, url, points: [{ text, emoji, truthScore }] }
 */

import { tokenize } from "./mirrorIndex.js";

// Stop words — zero signal
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

// Emoji assigned by rank
const RANK_EMOJI = ["🔑", "💡", "✨", "🌟", "🎯"];

// ═══════════════════════════════════════════════════════════
// TRUNCATE — cap at ~25 words
// ═══════════════════════════════════════════════════════════

function truncate(text, maxWords = 25) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ") + "...";
}

// ═══════════════════════════════════════════════════════════
// SCORE SENTENCES — article scores itself
// ═══════════════════════════════════════════════════════════

function scoreSentences(sentences) {
  // Tokenize and strip all sentences
  const processed = sentences.map(s => {
    const tokens = stripStop(tokenize(s));
    return { text: s, tokens, tokenSet: new Set(tokens) };
  });

  // Build document frequency: how many sentences contain each token
  const df = new Map();
  for (const p of processed) {
    for (const t of p.tokenSet) {
      df.set(t, (df.get(t) || 0) + 1);
    }
  }
  const N = processed.length;

  // Score each sentence
  const scored = [];

  for (let i = 0; i < processed.length; i++) {
    const sent = processed[i];
    if (sent.tokens.length < 3) continue;

    // ── R₁₂ = Fidelity × Informativeness ──

    // Fidelity: how many OTHER sentences share tokens with this one
    // (bidirectional recognition across the article)
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

    // Informativeness gate: unique tokens, weighted by inverse doc frequency
    // Rare words in the article = more informative
    let idfSum = 0;
    for (const t of sent.tokens) {
      const freq = df.get(t) || 1;
      idfSum += Math.log(N / freq);
    }
    const G_eps = Math.min(1, (idfSum / sent.tokens.length) / Math.log(N || 2));

    const R12 = fidelity * G_eps;

    // ── G = Convergence × Detection ──

    // C_eff: what fraction of the article's key tokens appear in this sentence
    // (does this sentence touch the article's core themes?)
    const topTokens = [...df.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(e => e[0]);
    let coreHits = 0;
    for (const t of topTokens) {
      if (sent.tokenSet.has(t)) coreHits++;
    }
    const C_eff = topTokens.length > 0 ? coreHits / topTokens.length : 0;

    // D_hat: detection quality — sentence length sweet spot
    // Too short = fragment, too long = rambling. Peak at ~12-20 tokens.
    const len = sent.tokens.length;
    const D_hat = len <= 20
      ? Math.min(1, len / 8)
      : Math.max(0.3, 1 - (len - 20) / 40);

    const G = C_eff * D_hat;

    // ── Ψ = R₁₂ × G ──
    const psi = R12 * G;

    scored.push({
      text: truncate(sent.text),
      psi,
    });
  }

  return scored;
}

// ═══════════════════════════════════════════════════════════
// FETCH WIKIPEDIA — search → extract → score → return top 5
// ═══════════════════════════════════════════════════════════

const API = "https://en.wikipedia.org/w/api.php";

export async function fetchWiki(query) {
  if (!query || query.trim().length < 2) return null;

  // Extract keywords — strip stop words so full sentences find the right article
  const keywords = stripStop(tokenize(query));
  const searchTerm = keywords.length > 0 ? keywords.join(" ") : query.trim();

  // Step 1: Full-text search — handles natural language far better than OpenSearch
  const searchUrl = new URL(API);
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", searchTerm);
  searchUrl.searchParams.set("srlimit", "1");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("origin", "*");

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return { title: query, url: null, points: [] };
  const searchData = await searchRes.json();
  const title = searchData.query?.search?.[0]?.title;
  if (!title) return { title: query, url: null, points: [] };

  // Step 2: Fetch full article extract
  const extractUrl = new URL(API);
  extractUrl.searchParams.set("action", "query");
  extractUrl.searchParams.set("titles", title);
  extractUrl.searchParams.set("prop", "extracts");
  extractUrl.searchParams.set("explaintext", "1");
  extractUrl.searchParams.set("redirects", "1");
  extractUrl.searchParams.set("format", "json");
  extractUrl.searchParams.set("origin", "*");

  const extractRes = await fetch(extractUrl);
  if (!extractRes.ok) return { title, url: null, points: [] };
  const extractData = await extractRes.json();
  const pages = extractData.query?.pages || {};
  const page = Object.values(pages)[0];
  const extract = page?.extract || "";
  const pageId = page?.pageid;

  if (!extract) return { title, url: null, points: [] };

  const url = pageId
    ? `https://en.wikipedia.org/?curid=${pageId}`
    : `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;

  // Step 3: Split into sentences
  const sentences = extract
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.split(/\s+/).length >= 4);

  // Step 4: Score — article scores itself
  const scored = scoreSentences(sentences);

  // Step 5: Top 5, scaled to %, ranked high to low
  scored.sort((a, b) => b.psi - a.psi);
  const maxPsi = scored[0]?.psi || 1;
  const top5 = scored.slice(0, 5).map((s, i) => ({
    text: s.text,
    emoji: RANK_EMOJI[i],
    truthScore: Math.max(1, Math.min(99, Math.round((s.psi / maxPsi) * 95))),
  }));

  return { title, url, points: top5 };
}
