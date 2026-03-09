/**
 * SIFT ENGINE — Multi-Algorithm Search Across All 1000 Cards + 61 Mirror Nodes
 *
 * Three algorithms run simultaneously and merge:
 *   A. Inverted Index  — every word in every card, pre-indexed at load time
 *   B. Mirror Nodes    — the 61 philosophical Ψ-scored depth nodes
 *   C. Door Classifier — boosts cards from the most relevant door
 *
 * Results include direct navigation routes (goToRoom / goToDoor).
 * Index builds once on import — searches are O(tokens), not O(1000).
 */

import { TOPIC_CARDS } from "./topicCards.js";
import { SUBCATEGORIES, DOOR_META } from "./subcategories.js";
import { reflectTruth, MIRROR_NODES } from "./mirrorIndex.js";
import { classifyContent } from "./tenDoors.js";

// ─── STOP WORDS ──────────────────────────────────────────────────────────────
const STOP = new Set([
  "a","an","the","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","shall","should","may","might","must","can",
  "could","not","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","into","through","during","before","after","above","below",
  "between","out","about","up","down","that","this","these","those","it","its",
  "we","you","they","i","me","my","your","our","their","he","she","him","her",
  "his","hers","what","which","who","when","where","why","how","all","each",
  "every","some","any","so","if","then","than","because","while","just","more",
  "also","very","too","even","only","such","like","there","here","now","still",
  "its","they're","we're","you're","i'm","don't","can't","won't","isn't",
]);

// ─── SYNONYM EXPANSION ────────────────────────────────────────────────────────
const SYNONYMS = {
  // Death / end
  dying:"death", died:"death", dead:"dead", die:"death", mortal:"death",
  // Love / connection
  loving:"love", loved:"love", lover:"love", loves:"love", beloved:"love",
  caring:"care", cares:"care", cared:"care",
  // Fear / anxiety
  afraid:"fear", scared:"fear", frightened:"fear", anxious:"anxiety",
  worry:"anxiety", worried:"anxiety", nervous:"anxiety",
  // God / divine
  god:"god", gods:"god", divine:"divine", holy:"holy", sacred:"sacred",
  spiritual:"spirit", spirit:"spirit", soul:"soul",
  // Mind / consciousness
  mind:"mind", brain:"brain", thinking:"think", thought:"think",
  awareness:"aware", conscious:"conscious", unconscious:"unconscious",
  // Change / growth
  changing:"change", changed:"change", grow:"growth", growing:"growth",
  grew:"growth", transform:"transform", transforming:"transform",
  // Pain / healing
  hurting:"hurt", hurts:"hurt", healed:"heal", healing:"heal",
  suffering:"suffer", suffered:"suffer", grief:"grief", grieving:"grief",
  // Time
  past:"past", future:"future", present:"present", moment:"moment",
  // Nature
  natural:"nature", earth:"earth", planet:"earth",
  // Truth / knowledge
  true:"truth", truths:"truth", knowing:"know", knows:"know", knew:"know",
  knowledge:"knowledge", wisdom:"wisdom", wise:"wisdom",
  // Questions people actually ask
  why:"why", meaning:"meaning", purpose:"purpose", life:"life", alive:"life",
  exist:"exist", existence:"exist", real:"real", reality:"real",
  happy:"happiness", happiness:"happiness", joy:"joy", peace:"peace",
  sad:"sadness", sadness:"sadness", lonely:"lonely", alone:"lonely",
  angry:"anger", anger:"anger", hurt:"hurt",
};

// ─── TOKENIZER ────────────────────────────────────────────────────────────────
function tokenize(text) {
  if (!text) return [];
  const raw = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/);
  const tokens = raw
    .map(w => w.replace(/^[-']+|[-']+$/g, ""))  // strip leading/trailing punctuation
    .filter(w => w.length >= 2)
    .map(w => SYNONYMS[w] || w);

  // Short queries (≤ 3 words): keep everything including stop words
  if (raw.filter(w => w.length >= 2).length <= 3) return [...new Set(tokens)];
  return [...new Set(tokens.filter(w => !STOP.has(w)))];
}

// ─── INVERTED INDEX ───────────────────────────────────────────────────────────
// Built once on module load. Maps every word → all cards containing it.
// { word: [{ doorKey, subId, cardId, boost }] }

const INDEX = Object.create(null);

function addToIndex(word, entry) {
  const w = SYNONYMS[word] || word;
  if (!INDEX[w]) INDEX[w] = [];
  INDEX[w].push(entry);
}

function indexText(text, doorKey, subId, cardId, boost) {
  if (!text) return;
  const tokens = tokenize(text);
  for (const token of tokens) {
    addToIndex(token, { doorKey, subId, cardId, boost });
  }
  // Also index 2-word phrases from titles for better phrase matching
  const words = tokens.filter(t => t.length >= 3);
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = words[i] + " " + words[i + 1];
    addToIndex(phrase, { doorKey, subId, cardId, boost: boost * 1.5 });
  }
}

// Build the index
(function buildIndex() {
  for (const [doorKey, subs] of Object.entries(TOPIC_CARDS)) {
    for (const [subId, cards] of Object.entries(subs)) {
      for (const card of cards) {
        const base = { doorKey, subId, cardId: card.id };
        indexText(card.title,     doorKey, subId, card.id, 3.0);
        indexText(card.subtitle,  doorKey, subId, card.id, 2.0);
        indexText(card.simple,    doorKey, subId, card.id, 1.5);
        indexText(card.intuition, doorKey, subId, card.id, 1.2);
        indexText(card.advanced,  doorKey, subId, card.id, 0.8);
        // Index sense texts too
        if (card.senses) {
          for (const s of card.senses) {
            indexText(s.text, doorKey, subId, card.id, 0.7);
          }
        }
      }
    }
  }
})();

// Pre-sorted index keys for prefix matching
const INDEX_KEYS = Object.keys(INDEX).sort();

// ─── ALGORITHM A: INVERTED INDEX SEARCH ──────────────────────────────────────
function searchIndex(tokens) {
  if (tokens.length === 0) return {};

  const cardScores = Object.create(null); // "doorKey/subId/cardId" → score

  for (const token of tokens) {
    const hits = new Map(); // cardKey → best boost for this token

    // 1. Exact match
    if (INDEX[token]) {
      for (const h of INDEX[token]) {
        const key = `${h.doorKey}/${h.subId}/${h.cardId}`;
        const cur = hits.get(key) || 0;
        hits.set(key, Math.max(cur, h.boost * 1.0));
      }
    }

    // 2. Prefix match (token is prefix of indexed word, 4+ chars)
    if (token.length >= 4) {
      for (const k of INDEX_KEYS) {
        if (k.startsWith(token) && k !== token) {
          for (const h of INDEX[k]) {
            const key = `${h.doorKey}/${h.subId}/${h.cardId}`;
            const cur = hits.get(key) || 0;
            hits.set(key, Math.max(cur, h.boost * 0.75));
          }
        } else if (k > token + "zzz") break; // sorted — past prefix range
      }
    }

    // 3. Suffix match (indexed word is prefix of token, 4+ chars)
    if (token.length >= 5) {
      const stem = token.slice(0, 4);
      for (const k of INDEX_KEYS) {
        if (k.startsWith(stem) && k !== token && token.startsWith(k)) {
          for (const h of INDEX[k]) {
            const key = `${h.doorKey}/${h.subId}/${h.cardId}`;
            const cur = hits.get(key) || 0;
            hits.set(key, Math.max(cur, h.boost * 0.6));
          }
        } else if (k > stem + "zzz") break;
      }
    }

    // Accumulate into cardScores
    for (const [key, score] of hits) {
      cardScores[key] = (cardScores[key] || 0) + score;
    }
  }

  return cardScores;
}

// ─── ALGORITHM B: MIRROR NODE SEARCH (existing Ψ engine) ─────────────────────
// Returns top mirror node results, normalized to 0-1

function searchMirror(query) {
  const { matched } = reflectTruth(query);
  if (!matched || matched.length === 0) return [];

  const maxScore = matched[0]?.score || 1;
  return matched.slice(0, 3).map((node, i) => ({
    type: "mirror",
    node,
    score: maxScore > 0 ? (matched[i]?.score || 0) / maxScore : 0.5,
    navDoorKey: node.route?.convergence || null,
  }));
}

// ─── ALGORITHM C: DOOR CLASSIFIER BOOST ──────────────────────────────────────
// Boosts card scores from the top-matching door

function getDoorBoosts(query) {
  try {
    const classified = classifyContent(query);
    if (!classified || classified.length === 0) return null;
    return {
      topDoor: classified[0].key,
      boost: classified[0].pct / 100, // 0-1
    };
  } catch {
    return null;
  }
}

// ─── CARD LOOKUP ──────────────────────────────────────────────────────────────
function getCard(doorKey, subId, cardId) {
  try {
    const cards = TOPIC_CARDS[doorKey]?.[subId];
    return cards?.find(c => c.id === cardId) || null;
  } catch {
    return null;
  }
}

function getSubName(doorKey, subId) {
  try {
    const subs = SUBCATEGORIES[doorKey];
    return subs?.find(s => s.id === subId)?.name || subId;
  } catch {
    return subId;
  }
}

// ─── MAIN ENGINE ─────────────────────────────────────────────────────────────
/**
 * siftSearch(query)
 * Runs all 3 algorithms simultaneously, merges results.
 *
 * Returns array of result objects:
 *   { type: "card"|"mirror", score, ... }
 *
 * Card result: { type, score, doorKey, subId, cardId, card, doorName, doorEmoji, subName }
 * Mirror result: { type, score, node, navDoorKey, doorName }
 */
export function siftSearch(query) {
  if (!query || query.trim().length === 0) return [];

  const tokens = tokenize(query);

  // Run all 3 algorithms
  const cardScores = searchIndex(tokens);          // A: inverted index
  const mirrorResults = searchMirror(query);        // B: mirror nodes
  const doorBoost = getDoorBoosts(query);           // C: door classifier

  // ── Build card results ──
  let cardResults = Object.entries(cardScores)
    .map(([key, score]) => {
      const [doorKey, subId, cardId] = key.split("/");
      const card = getCard(doorKey, subId, cardId);
      if (!card) return null;

      // Apply door boost (Algorithm C)
      let finalScore = score;
      if (doorBoost && doorKey === doorBoost.topDoor) {
        finalScore += score * doorBoost.boost * 0.4;
      }

      const meta = DOOR_META[doorKey] || {};
      return {
        type: "card",
        score: finalScore,
        doorKey,
        subId,
        cardId,
        card,
        doorName: meta.name || doorKey.toUpperCase(),
        doorEmoji: meta.emoji || "🚪",
        subName: getSubName(doorKey, subId),
      };
    })
    .filter(Boolean);

  // Normalize card scores to 0-1
  if (cardResults.length > 0) {
    const maxCard = Math.max(...cardResults.map(r => r.score));
    if (maxCard > 0) cardResults = cardResults.map(r => ({ ...r, score: r.score / maxCard }));
  }

  // Sort cards, take top candidates
  cardResults.sort((a, b) => b.score - a.score);
  const topCards = cardResults.slice(0, 8);

  // ── Merge mirror + cards ──
  // Strategy: show best card result first, then weave in mirrors, then more cards
  const merged = [];

  // Always include top card if score is good
  if (topCards[0]?.score > 0.1) merged.push(topCards[0]);

  // Add mirror results (philosophical depth)
  for (const m of mirrorResults) {
    merged.push({
      ...m,
      doorName: m.navDoorKey ? (DOOR_META[m.navDoorKey]?.name || m.navDoorKey) : "TRUTH",
    });
  }

  // Add more card results (avoid door duplicates at top)
  const seenDoors = new Set(merged.filter(r => r.type === "card").map(r => r.doorKey));
  for (const card of topCards.slice(1)) {
    if (merged.length >= 5) break;
    // Prefer cards from different doors first, but don't exclude same door
    if (!seenDoors.has(card.doorKey) || merged.length < 4) {
      merged.push(card);
      seenDoors.add(card.doorKey);
    }
  }

  // Final sort: weight cards at 0.6, mirrors at 0.4 of their score
  // (cards are more specific, mirrors add depth)
  return merged
    .slice(0, 5)
    .sort((a, b) => b.score - a.score);
}

// ─── DOOR SCORES (for pyramid lighting) ──────────────────────────────────────
// Re-export classifyContent for ProofPage pyramid
export { classifyContent } from "./tenDoors.js";
