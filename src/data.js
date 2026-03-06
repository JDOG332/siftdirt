export const PHI = 1.618033988749895;
export const PHI_INV = 0.6180339887498949;

// ═══════════════════════════════════════════════
// THE 10 DOORS — every desire passes through one
// ═══════════════════════════════════════════════
export const DOORS = [
  {
    num: "I",
    name: "RELIGION",
    color: [201, 168, 76],
    question: "What has been revealed, and how must I live in response?",
    reflection: ["FAITH", "SACRED", "COVENANT"],
    keywords: ["god","faith","prayer","soul","heaven","spirit","sin","grace","holy","church","divine","worship","believe","salvation","scripture","sacred","blessing","eternal","purpose","meaning","forgiven","loved by god","creator","truth"],
  },
  {
    num: "II",
    name: "PHILOSOPHY",
    color: [150, 180, 220],
    question: "What can I know through reason alone?",
    reflection: ["TRUTH", "REASON", "KNOWING"],
    keywords: ["truth","meaning","reason","understand","know","wisdom","existence","reality","consciousness","free will","justice","good","evil","right","wrong","virtue","logic","proof","certain","real","why","purpose","identity","self"],
  },
  {
    num: "III",
    name: "SCIENCE",
    color: [100, 200, 150],
    question: "How does the universe actually work?",
    reflection: ["EVIDENCE", "DISCOVERY", "LAW"],
    keywords: ["understand","discover","learn","how","why","work","know","explain","prove","study","research","find","solve","cure","build","create","invent","explore","facts","truth","evidence","answers","knowledge"],
  },
  {
    num: "IV",
    name: "MYSTICISM",
    color: [190, 140, 220],
    question: "Can I experience the infinite directly — without mediation?",
    reflection: ["ONENESS", "AWAKENING", "SURRENDER"],
    keywords: ["awaken","enlighten","transcend","oneness","peace","stillness","presence","silence","surrender","dissolve","ego","consciousness","deeper","beyond","infinite","universe","connected","flow","meditate","inner","truth","whole","free"],
  },
  {
    num: "V",
    name: "ART",
    color: [224, 120, 100],
    question: "What truth can only be expressed by making something?",
    reflection: ["BEAUTY", "EXPRESSION", "CREATION"],
    keywords: ["create","make","express","beauty","art","music","write","paint","dance","sing","story","film","design","build","imagine","feel","inspire","move","touch","craft","poem","voice","seen","heard"],
  },
  {
    num: "VI",
    name: "MATHEMATICS",
    color: [201, 168, 76],
    question: "What is the hidden pattern beneath everything?",
    reflection: ["PATTERN", "STRUCTURE", "ELEGANCE"],
    keywords: ["pattern","order","structure","perfect","precise","elegant","balance","symmetry","harmony","formula","equation","solve","number","fibonacci","golden","ratio","geometry","fractal","proof","certain","system","clarity","beautiful"],
  },
  {
    num: "VII",
    name: "MYTHOLOGY",
    color: [180, 160, 120],
    question: "What stories keep telling themselves, and why?",
    reflection: ["STORY", "ARCHETYPE", "DESTINY"],
    keywords: ["story","legend","hero","journey","destiny","fate","quest","myth","dragon","overcome","transform","become","rise","power","strength","courage","face","fight","win","legend","prove","worthy","champion","warrior"],
  },
  {
    num: "VIII",
    name: "NATURE",
    color: [120, 180, 100],
    question: "What does the Earth itself teach about existence?",
    reflection: ["WILDNESS", "CYCLE", "ROOT"],
    keywords: ["peace","freedom","wild","alive","grow","roots","earth","home","simple","real","breathe","space","open","quiet","calm","still","natural","organic","pure","clean","ground","settle","belong","rest"],
  },
  {
    num: "IX",
    name: "LOVE",
    color: [220, 160, 160],
    question: "Is the deepest truth found in the space between us?",
    reflection: ["SEEN", "KNOWN", "BELOVED"],
    keywords: ["love","loved","known","seen","understood","belong","together","someone","close","real","intimate","trust","safe","home","connect","bond","partner","family","friend","heart","deep","feel","matter","cherish","hold"],
  },
  {
    num: "X",
    name: "CONSCIOUSNESS",
    color: [200, 200, 230],
    question: "What is this awareness that makes all experience possible?",
    reflection: ["AWARE", "WITNESS", "PRESENCE"],
    keywords: ["aware","conscious","present","observer","witness","mind","experience","feel","sense","alive","real","exist","waking","deeper","within","true self","notice","perceive","who am i","knowing","clarity","here","now","awake"],
  },
];

export function classifyDesire(text) {
  if (!text || text.trim().length < 2) return null;
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  const scores = DOORS.map((door) => {
    let score = 0;
    for (const kw of door.keywords) {
      if (kw.includes(" ")) {
        if (lower.includes(kw)) score += 2;
      } else {
        if (words.some(w => w.replace(/[^a-z]/g, "") === kw || w.includes(kw))) score += 1;
      }
    }
    return { door, score };
  });

  const best = scores.sort((a, b) => b.score - a.score)[0];

  // If nothing matched, default to LOVE — desire almost always lives there
  if (best.score === 0) return DOORS[8];
  return best.door;
}
