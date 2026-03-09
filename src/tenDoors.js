// THE 10 DOORS — Universal Human Content Classifier
// Every piece of human content passes through one of these doors

export const TEN_DOORS = [
  {
    num: "I", name: "Religion", emoji: "⛪", color: [201,168,76],
    question: "What has God revealed, and how must we live in response?",
    keywords: ["church","mosque","temple","synagogue","scripture","bible","quran","torah","vedas","gospel","doctrine","dogma","creed","commandment","covenant","prayer","worship","ritual","sacrament","baptism","communion","pilgrimage","fasting","sermon","liturgy","hymn","blessing","confession","god","deity","divine","holy","sacred","sin","salvation","heaven","hell","afterlife","resurrection","redemption","grace","prophet","messiah","angel","miracle","revelation","faith","believer","congregation","christianity","islam","judaism","hinduism","buddhism","catholic","protestant","orthodox","monk","priest","imam","rabbi","pastor","commandments","halal","kosher","sabbath","testament","psalm","parable"],
    signals: ["institutional authority","shared worship","codified belief","scripture as source of truth","afterlife destination","moral law from divine command","community of believers"],
  },
  {
    num: "II", name: "Philosophy", emoji: "🏛️", color: [150,180,220],
    question: "What can we know through reason alone?",
    keywords: ["metaphysics","epistemology","ethics","logic","aesthetics","ontology","phenomenology","truth","knowledge","reason","argument","premise","conclusion","syllogism","fallacy","paradox","dialectic","thesis","antithesis","synthesis","empiricism","rationalism","existentialism","nihilism","stoicism","pragmatism","idealism","materialism","dualism","monism","determinism","free will","socratic","deduction","induction","thought experiment","categorical imperative","utilitarianism","virtue ethics","plato","aristotle","kant","nietzsche","descartes","hume","hegel","wittgenstein","sartre","kierkegaard","spinoza","consciousness","being","essence","existence","causation","morality","justice","virtue","meaning of life","absurd","authentic","transcendental","axiom","proof"],
    signals: ["logical argumentation","systematic doubt","conceptual analysis","thought experiments","reason as primary tool","universal principles through logic","questioning assumptions"],
  },
  {
    num: "III", name: "Science", emoji: "🔬", color: [100,200,150],
    question: "How does the universe work, and what are its laws?",
    keywords: ["hypothesis","experiment","observation","data","evidence","peer review","replication","falsifiable","empirical","theory","law","model","prediction","measurement","physics","chemistry","biology","astronomy","geology","neuroscience","genetics","evolution","quantum","relativity","thermodynamics","cosmology","astrophysics","atom","molecule","cell","gene","dna","organism","species","natural selection","entropy","gravity","light","energy","mass","force","wave","particle","big bang","black hole","dark matter","dark energy","spacetime","electron","proton","quark","photon","laboratory","telescope","accelerator","research","study","technology","medicine"],
    signals: ["empirical evidence required","falsifiability","repeatable results","mathematical models","peer review process","natural mechanisms","measurement and quantification","predictive power"],
  },
  {
    num: "IV", name: "Mysticism", emoji: "✨", color: [190,140,220],
    question: "Can I experience God directly, without mediation?",
    keywords: ["enlightenment","awakening","illumination","union","oneness","ecstasy","transcendence","samadhi","nirvana","satori","moksha","ego death","dissolution","void","nonduality","cosmic consciousness","meditation","contemplation","breathwork","mantra","mandala","visualization","trance","shamanism","vision quest","silence","retreat","asceticism","surrender","sufism","kabbalah","gnosticism","zen","tantra","yoga","vedanta","advaita","inner light","divine spark","kundalini","chakra","altered state","psychedelic","entheogen","rumi","meister eckhart","alan watts","peak experience","ineffable"],
    signals: ["direct experience over doctrine","ego dissolution","union with the absolute","ineffability of experience","altered states of consciousness","no institutional mediation","surrender of self","the path is the destination"],
  },
  {
    num: "V", name: "Art", emoji: "🎨", color: [224,120,100],
    question: "What truth can only be expressed by creating something?",
    keywords: ["painting","sculpture","drawing","mural","portrait","abstract","impressionism","surrealism","expressionism","renaissance","gallery","museum","canvas","music","melody","harmony","rhythm","symphony","opera","jazz","blues","composition","orchestra","poetry","poem","novel","fiction","prose","verse","metaphor","imagery","symbolism","narrative","allegory","dance","theater","drama","performance","ballet","film","cinema","beauty","aesthetic","sublime","inspiration","muse","creative","imagination","expression","emotion","masterpiece","craft","michelangelo","da vinci","beethoven","mozart","shakespeare","picasso","van gogh","bach"],
    signals: ["creation as communication","beauty as truth","emotional resonance","aesthetic experience","imagination over analysis","the work speaks","form and content inseparable","human creative impulse"],
  },
  {
    num: "VI", name: "Mathematics", emoji: "📐", color: [201,168,76],
    question: "What is the hidden structure beneath all things?",
    keywords: ["number","integer","prime","irrational","complex","infinity","zero","set","function","equation","formula","proof","theorem","axiom","conjecture","algorithm","computation","recursion","algebra","geometry","calculus","topology","statistics","trigonometry","number theory","group theory","fibonacci","golden ratio","pi","euler","fractal","symmetry","spiral","sequence","convergence","dimension","manifold","vector","matrix","tensor","deduction","induction","godel","turing","riemann","pythagorean","euclidean","cryptography","optimization","game theory","chaos theory","complexity","emergence","mathematical universe"],
    signals: ["abstract pattern recognition","proof as method of truth","structure independent of physical world","elegance as indicator of truth","universality across cultures","language beneath all languages","the unreasonable effectiveness"],
  },
  {
    num: "VII", name: "Mythology", emoji: "📖", color: [180,160,120],
    question: "What stories keep telling themselves, and why?",
    keywords: ["myth","legend","fable","fairy tale","folklore","oral tradition","epic","saga","parable","allegory","origin story","creation myth","hero's journey","monomyth","archetype","trickster","wise old man","shadow","anima","collective unconscious","flood myth","underworld journey","quest","dragon slayer","rebirth","transformation","initiation","greek mythology","norse mythology","egyptian mythology","zeus","odin","isis","shiva","jung","campbell","joseph campbell","carl jung","mircea eliade","tolkien","symbol","ritual","rite of passage","liminal","sacred narrative","dreamtime","totem","prophecy","oracle","fate","destiny"],
    signals: ["truth encoded in narrative","universal patterns across cultures","archetypal characters","collective unconscious","story as the oldest technology of meaning","not literal but deeply true","symbolic not historical","the story tells you"],
  },
  {
    num: "VIII", name: "Nature", emoji: "🌿", color: [120,180,100],
    question: "What does the Earth itself teach us about existence?",
    keywords: ["earth","water","fire","air","wind","rain","storm","ocean","river","mountain","forest","desert","sky","sun","moon","stars","aurora","eclipse","solstice","tree","flower","seed","root","branch","leaf","bloom","animal","bird","ecosystem","wilderness","wild","season","spring","summer","autumn","winter","harvest","birth","growth","decay","cycle","tide","equinox","gaia","mother earth","pantheism","animism","deep ecology","thoreau","emerson","indigenous wisdom","awe","wonder","sublime","sunrise","sunset","garden","soil","landscape","climate","elemental"],
    signals: ["the natural world as primary teacher","seasons as metaphor","wilderness as cathedral","awe before creation","cycles of life death rebirth","indigenous connection to land","earth-based spirituality","nature as mirror"],
  },
  {
    num: "IX", name: "Love", emoji: "💛", color: [220,160,160],
    question: "Is the deepest truth found in the space between us?",
    keywords: ["love","agape","eros","philia","unconditional love","divine love","compassion","empathy","kindness","tenderness","intimacy","devotion","commitment","bond","attachment","marriage","partnership","family","parent","child","friendship","soulmate","beloved","community","belonging","togetherness","communion","connection","vulnerability","trust","forgiveness","reconciliation","sacrifice","selflessness","altruism","service","presence","listening","seeing","witness","heartbreak","grief","longing","reunion","joy","gratitude","acceptance","healing","nurture","care","cherish","sacred union","mirror","recognition","resonance"],
    signals: ["meaning found through connection","the other as mirror","love as the fundamental force","vulnerability as strength","seeing god in another face","sacrifice born of love","forgiveness as liberation","you cannot find meaning alone"],
  },
  {
    num: "X", name: "Consciousness", emoji: "👁️", color: [200,200,230],
    question: "What is this awareness that makes all experience possible?",
    keywords: ["consciousness","awareness","self","identity","ego","soul","mind","psyche","spirit","atman","brahman","subjective","qualia","sentience","cogito","hard problem","mind body","dualism","physicalism","panpsychism","idealism","phenomenology","intentionality","experience","first person","subjectivity","introspection","self awareness","individuation","shadow work","unconscious","transpersonal","flow state","maslow","self transcendence","freud","jung","neural correlates","integrated information","phi","tononi","chalmers","penrose","quantum consciousness","who am i","purpose","meaning","observer","witness","the one who sees","self inquiry","neti neti","death","mortality","what remains"],
    signals: ["the observer behind all lenses","what is awareness itself","the hard problem","who am i really","the self that cannot be objectified","awareness of awareness","without this door no other door opens","the eye that sees cannot see itself"],
  },
];

// THE FUNNEL — classify any text against all 10 doors
// Quick synonym map for pyramid classification
const CLASSIFY_SYNONYMS = {
  "dying":"death","died":"death","die":"death","dead":"death",
  "loving":"love","loved":"love","lover":"love",
  "afraid":"fear","scared":"fear","frightened":"fear","anxious":"anxiety",
  "changing":"change","growing":"growth","transforming":"transform",
  "hurting":"hurt","healing":"heal","suffering":"suffer","grieving":"grief",
  "joyful":"joy","thankful":"gratitude","grateful":"gratitude","happiness":"happy",
  "living":"alive","lives":"life","existing":"existence","exists":"exist",
  "dreaming":"dream","dreams":"dream","dreamed":"dream",
};

export function classifyContent(text) {
  const lower = text.toLowerCase();
  // Expand synonyms before matching
  const expanded = lower.split(/\s+/).map(w => CLASSIFY_SYNONYMS[w] || w).join(" ");
  const words = new Set(expanded.split(/\s+/));
  const lowerToUse = expanded;
  const scores = TEN_DOORS.map((door) => {
    let score = 0;
    let matches = [];
    for (const kw of door.keywords) {
      if (kw.includes(" ")) {
        if (lowerToUse.includes(kw)) { score += 1.5; matches.push(kw); }
      } else {
        if (words.has(kw) || lower.includes(kw)) { score += 1; matches.push(kw); }
      }
    }
    for (const sig of door.signals) {
      if (lowerToUse.includes(sig.toLowerCase())) { score += 3; matches.push(`⚡ ${sig}`); }
    }
    const essenceWords = (door.question || "").toLowerCase().split(/\s+/);
    score += essenceWords.filter(w => w.length > 4 && lowerToUse.includes(w)).length * 0.5;
    return { door, score, matches: [...new Set(matches)].slice(0, 12) };
  });
  const total = scores.reduce((s, d) => s + d.score, 0);
  if (total === 0) return scores.map(s => ({ ...s, pct: 0 }));
  return scores.map(s => ({ ...s, pct: (s.score / total) * 100 })).sort((a, b) => b.pct - a.pct);
}
