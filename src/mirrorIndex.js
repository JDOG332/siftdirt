/**
 * MIRROR INDEX — The Content Map for the Truth Engine
 * 
 * Every concept on the site becomes a searchable node.
 * Each node carries:
 *   - keywords: for matching user input
 *   - truth: the pre-written answer (25 words max)
 *   - dare: the question that leads deeper
 *   - path: exact location on the site
 *   - depth: which layer (1-9)
 *   - weight: importance multiplier
 */

import { PHI } from "./data.js";

// ═══════════════════════════════════════════════════════════
// THE INDEX — every seed in the garden, tagged and mapped
// ═══════════════════════════════════════════════════════════

export const MIRROR_NODES = [
  // ── LAYER 1: THE SEED ──
  {
    id: "seed-core",
    keywords: ["seed", "nothing", "beginning", "start", "origin", "empty", "void", "dark", "darkness", "buried", "dirt", "love", "emptiness", "potential", "zero"],
    truth: "Everything begins buried. Not in light. In dirt. The seed eats the dirt. The nothing loved — and emptied itself so the beloved could fill.",
    dare: "What if the beginning isn't above you — but beneath you?",
    path: "Layer 1 → The Seed → The Nothing",
    depth: 1,
    weight: PHI,
    route: { convergence: "pillars" },
  },
  {
    id: "seed-sense",
    keywords: ["glass", "empty", "silence", "weightless", "hunger", "air", "breath", "possibility", "before"],
    truth: "An empty glass holds all possibility. Silence before sound. Hunger before the first meal. The void is not absence — it's invitation.",
    dare: "Can you name something that is more powerful empty than full?",
    path: "Layer 1 → The Seed → Senses",
    depth: 1,
    weight: 1,
    route: { convergence: "pillars" },
  },

  // ── LAYER 2: THE ROOT ──
  {
    id: "root-core",
    keywords: ["root", "opposite", "mirror", "binary", "zero", "one", "heart", "beat", "law", "invisible", "architecture", "foundation"],
    truth: "Roots seek truth, not light — always down. Everything has an opposite. 0 and 1 complete each other. Your heart beats it right now.",
    dare: "Why do roots grow toward darkness instead of light?",
    path: "Layer 2 → The Root → The Law",
    depth: 2,
    weight: PHI,
    route: { convergence: "rock" },
  },
  {
    id: "root-sense",
    keywords: ["reflection", "echo", "push", "pull", "sweet", "rot", "salt", "wound", "reversed"],
    truth: "Your reflection is you — same but reversed. Echo is sound that comes back. Sweet and rot are the same molecule. Salt heals and stings.",
    dare: "What in your life looks identical but means the opposite?",
    path: "Layer 2 → The Root → Senses",
    depth: 2,
    weight: 1,
    route: { convergence: "rock" },
  },

  // ── LAYER 3: THE SPINE ──
  {
    id: "spine-core",
    keywords: ["spine", "body", "map", "vertical", "axis", "mother", "father", "matter", "pattern", "energy", "marriage", "oscillate", "child", "male", "female", "glass", "water"],
    truth: "The body IS the map. Mother is matter (MATER). Father is pattern (PATER). Together they oscillate. The child is energy. E = MC².",
    dare: "What happens when the glass and the water become one thing?",
    path: "Layer 3 → The Spine → The Marriage",
    depth: 3,
    weight: PHI,
    route: { convergence: "promise" },
  },
  {
    id: "spine-sense",
    keywords: ["petrichor", "rain", "earth", "bread", "flour", "heat", "stillness", "motion"],
    truth: "Earth + rain = petrichor — the child of two parents. Flour + heat = bread. Stillness holding motion. Creation requires marriage.",
    dare: "Can you name a creation that didn't require two opposites meeting?",
    path: "Layer 3 → The Spine → Senses",
    depth: 3,
    weight: 1,
    route: { convergence: "promise" },
  },

  // ── LAYER 4: THE MIRROR ──
  {
    id: "mirror-core",
    keywords: ["mirror", "signal", "reflection", "mama", "dada", "language", "lips", "nursing", "word", "first", "baby", "sound", "universal", "crescent", "moon", "eye", "eyelid", "pupil"],
    truth: "Signal goes out, comes back same. MAMA — lips open, close — nursing IS naming. It means mother in every language. The mirror proves itself.",
    dare: "If a baby's first word is the same in every language — who taught them?",
    path: "Layer 4 → The Mirror → The Door",
    depth: 4,
    weight: PHI,
    route: { convergence: "ancient" },
  },
  {
    id: "mirror-sense",
    keywords: ["lips", "tongue", "milk", "syllable", "need", "nursing", "naming"],
    truth: "Lips forming M — shut, open, shut. The first syllable tastes like need. The body already knows everything before the mind catches up.",
    dare: "What does your body know that your mind hasn't figured out yet?",
    path: "Layer 4 → The Mirror → Senses",
    depth: 4,
    weight: 1,
    route: { convergence: "ancient" },
  },

  // ── LAYER 5: THE MOON (CENTER) ──
  {
    id: "moon-core",
    keywords: ["moon", "center", "still", "observer", "hologram", "original", "arrangement", "orbit", "time", "space", "meaning", "clock"],
    truth: "The still point. Everything orbits the center. Nothing here is original — the originality is in the arrangement. The moon doesn't orbit. Everything orbits it.",
    dare: "What if you are the center of something you haven't recognized yet?",
    path: "Layer 5 → The Moon → The Center",
    depth: 5,
    weight: PHI * PHI,
    route: { convergence: "pillars", subcategory: "sky" },
  },
  {
    id: "moon-sense",
    keywords: ["hologram", "flat", "depth", "voice", "head", "memory", "scent", "dream", "food"],
    truth: "A hologram — flat surface projecting depth. A memory triggered by scent. The voice inside your head. Something there with no mass.",
    dare: "Have you ever felt something real that you couldn't weigh or measure?",
    path: "Layer 5 → The Moon → Senses",
    depth: 5,
    weight: 1,
    route: { convergence: "pillars", subcategory: "sky" },
  },

  // ── LAYER 6: THE SKIN ──
  {
    id: "skin-core",
    keywords: ["skin", "tattoo", "language", "english", "etymology", "mater", "materia", "matrix", "connect", "con", "neck", "her", "throat", "voice", "plain", "sight"],
    truth: "The map was never paper — always skin. CONNECT = CON + NECK + HER. The throat. The voice. Truth written on flesh in plain sight.",
    dare: "What word do you use every day whose true meaning you've never seen?",
    path: "Layer 6 → The Skin → The Proof in Language",
    depth: 6,
    weight: PHI,
    route: { convergence: "ancient", subcategory: "identity" },
  },
  {
    id: "skin-sense",
    keywords: ["live", "evil", "letters", "rearrange", "books", "old", "ancient", "tongue", "tip", "word"],
    truth: "LIVE rearranged is EVIL. Old books — truth preserved in pulp. Etymology: ancient mouths still speaking through us right now.",
    dare: "What if every word is a fossil — and the bones spell something you missed?",
    path: "Layer 6 → The Skin → Senses",
    depth: 6,
    weight: 1,
    route: { convergence: "ancient", subcategory: "identity" },
  },

  // ── LAYER 7: THE LOOP ──
  {
    id: "loop-core",
    keywords: ["loop", "infinity", "output", "input", "return", "cycle", "width", "depth", "time", "direction", "euler", "heisenberg", "uncertainty", "math", "proof", "position", "momentum"],
    truth: "Every output returns as input. The seed becomes the dirt. Width + depth = loop. e^(iπ) + 1 = 0 — it all comes back to the nothing.",
    dare: "What in your life keeps ending where it started?",
    path: "Layer 7 → The Loop → The Proof in Math",
    depth: 7,
    weight: PHI,
    route: { convergence: "promise", subcategory: "patterns" },
  },
  {
    id: "loop-sense",
    keywords: ["magnet", "gravity", "pull", "ache", "frequency", "want", "desire", "pheromone", "hunger", "body", "oldest"],
    truth: "A magnet pulling filings into alignment. Gravity — the pull you never see. Hunger — the body's oldest truth. The ache IS the signal.",
    dare: "What is pulling you right now that you can't name?",
    path: "Layer 7 → The Loop → Senses",
    depth: 7,
    weight: 1,
    route: { convergence: "filter", subcategory: "loneliness" },
  },

  // ── LAYER 8: THE EYE ──
  {
    id: "eye-core",
    keywords: ["eye", "observer", "observed", "rotate", "mandala", "crescent", "eyelid", "pupil", "lashes", "atom", "bond", "cell", "divide", "multiply", "connection", "disconnect", "death", "neural", "cosmic", "web", "circus"],
    truth: "The eye that sees IS the eye that is seen. Atom bonds. Cell divides to multiply. The cosmic web is a neural network. Disconnection is death.",
    dare: "What if the thing watching and the thing being watched are the same?",
    path: "Layer 8 → The Eye → The Universal Law",
    depth: 8,
    weight: PHI,
    route: { convergence: "filter", subcategory: "community" },
  },
  {
    id: "eye-sense",
    keywords: ["galaxy", "neuron", "campfire", "shared", "meal", "hand", "holding", "circuit", "dark", "voice", "answering"],
    truth: "Galaxies shaped like neurons. A campfire — humans gathered. A hand holding yours — circuit completed. A shared meal. Connection you swallow.",
    dare: "When was the last time you felt a circuit complete between you and another person?",
    path: "Layer 8 → The Eye → Senses",
    depth: 8,
    weight: 1,
    route: { convergence: "filter", subcategory: "community" },
  },

  // ── LAYER 9: THE ARROW ──
  {
    id: "arrow-core",
    keywords: ["arrow", "down", "return", "finish", "start", "hinge", "door", "nine", "home", "ground", "real", "planted", "hung", "six", "feet", "deep"],
    truth: "The arrow points down. Always. Truth is planted, not hung. FINISH I START — the I is the hinge on the door. Nine always comes home.",
    dare: "What truth are you hanging up that should be planted down?",
    path: "Layer 9 → The Arrow → The Return",
    depth: 9,
    weight: PHI,
    route: { convergence: "plain" },
  },
  {
    id: "arrow-sense",
    keywords: ["circle", "heartbeat", "rhythm", "drummer", "newborn", "holding", "sourdough", "starter", "baker", "bread", "craving", "first", "bite"],
    truth: "A circle — no start, no end. Rhythm creates the drummer. Sourdough starter — bread makes the baker. The first bite creates the craving.",
    dare: "Did the rhythm come first, or the drummer?",
    path: "Layer 9 → The Arrow → Senses",
    depth: 9,
    weight: 1,
    route: { convergence: "plain" },
  },

  // ── MIRROR PAIRS ──
  {
    id: "pair-seed-arrow",
    keywords: ["marriage", "connection", "signal", "overlap", "safe", "space", "bloom", "energy", "soul", "regularize", "fidelity", "trust", "relationship", "love", "partner"],
    truth: "True marriage: two signals overlap so perfectly they stop flickering and start glowing. The safe space lets trapped energy bloom.",
    dare: "What would happen if you stopped protecting yourself long enough to overlap with someone?",
    path: "Mirror Pair → Seed ↔ Arrow",
    depth: 4,
    weight: PHI,
    route: { convergence: "filter" },
  },
  {
    id: "pair-spine-loop",
    keywords: ["senses", "intuition", "sixth", "sense", "convergence", "recognition", "resonance", "tuning", "fork", "click", "spirit", "bumps", "goosebumps", "gut", "feeling", "know"],
    truth: "When your five senses marry your sixth sense — that's convergent recognition. The tuning fork moment. The click. Spirit bumps. You just KNOW.",
    dare: "When was the last time you knew something before you could prove it?",
    path: "Mirror Pair → Spine ↔ Loop",
    depth: 4,
    weight: PHI,
    route: { convergence: "sameness" },
  },
  {
    id: "pair-mirror-skin",
    keywords: ["proof", "bridge", "spark", "match", "arch", "keystone", "archimedes", "eureka", "water", "gold", "weight", "intersection", "overlap", "truth", "evidence"],
    truth: "Truth is a living bridge — the spark where two signals prove they're talking about the same thing. The arch holds because two sides lean into each other.",
    dare: "What two separate things in your life are secretly leaning on each other?",
    path: "Mirror Pair → Mirror ↔ Skin",
    depth: 4,
    weight: PHI,
    route: { convergence: "plain" },
  },
  {
    id: "pair-root-eye",
    keywords: ["backpack", "blind", "spot", "truman", "show", "fake", "world", "studio", "wall", "uncovering", "hidden", "mycelium", "fungal", "network", "tree", "forest"],
    truth: "The hardest things to find are the things you're currently using to look. Like Truman hitting the studio wall — truth hides in plain sight.",
    dare: "What are you so used to looking through that you forgot to look AT it?",
    path: "Mirror Pair → Root ↔ Eye",
    depth: 4,
    weight: PHI,
    route: { convergence: "ancient", subcategory: "observer" },
  },

  // ── BURIED TRUTHS ──
  {
    id: "buried-1",
    keywords: ["seed", "dirt", "eat", "becomes", "everything", "transform", "grow"],
    truth: "The seed eats the dirt and becomes everything.",
    dare: "What's the dirt in your life that might actually be food?",
    path: "Buried Truth #1",
    depth: 1,
    weight: 1,
    route: { convergence: "rock", subcategory: "evolution" },
  },
  {
    id: "buried-2",
    keywords: ["wound", "mouth", "pain", "speak", "voice", "hurt"],
    truth: "The wound is the mouth. Where you were cut is where you speak.",
    dare: "What wound taught you something you couldn't have learned any other way?",
    path: "Buried Truth #4",
    depth: 4,
    weight: PHI,
    route: { convergence: "ancient" },
  },
  {
    id: "buried-3",
    keywords: ["center", "reflection", "is", "itself", "moon"],
    truth: "The center has no reflection because it IS reflection.",
    dare: "If the mirror IS the center — who is looking?",
    path: "Buried Truth #5 → The Moon",
    depth: 5,
    weight: PHI,
    route: { convergence: "pillars", subcategory: "sky" },
  },
  {
    id: "buried-4",
    keywords: ["frame", "painting", "border", "edge", "contain", "art"],
    truth: "The frame is the painting. The container shapes the contained.",
    dare: "What frame are you inside that you've mistaken for the picture?",
    path: "Buried Truth #7",
    depth: 7,
    weight: 1,
    route: { convergence: "layers" },
  },
  {
    id: "buried-5",
    keywords: ["question", "answer", "same", "door", "opening", "ask"],
    truth: "The question and the answer are the same door seen from two sides.",
    dare: "What if the question you're asking IS the answer you're looking for?",
    path: "Buried Truth #8",
    depth: 8,
    weight: PHI,
    route: { convergence: "plain" },
  },

  // ── GOLDEN FILTER: THE BIG QUESTIONS ──
  {
    id: "gf-consciousness",
    keywords: ["consciousness", "aware", "awareness", "mind", "experience", "qualia", "red", "feel", "brain", "self", "recursive", "loop", "phi", "integrated", "information", "observer"],
    truth: "You are conscious because you make a model of yourself making a model. A mirror reflecting a mirror. The loop IS the experience.",
    dare: "If the eye can't see itself — how do you know you're conscious?",
    path: "Golden Filter → What is Consciousness?",
    depth: 5,
    weight: PHI,
    route: { convergence: "filter" },
  },
  {
    id: "gf-something-nothing",
    keywords: ["something", "nothing", "exist", "existence", "why", "universe", "vacuum", "energy", "fluctuation", "creation", "cause"],
    truth: "True emptiness can't hold still. Even empty space fizzes with energy. Nothing is a ball on a needle — it must fall into something.",
    dare: "What if 'nothing' is harder to achieve than 'everything'?",
    path: "Golden Filter → Why Something Rather Than Nothing?",
    depth: 1,
    weight: PHI,
    route: { convergence: "filter" },
  },
  {
    id: "gf-life",
    keywords: ["life", "alive", "living", "rna", "dna", "origin", "abiogenesis", "evolution", "cell", "replicate", "biology", "chemistry", "organic"],
    truth: "A rock can't remember yesterday. An RNA molecule can copy and change. Life = memory + mutation. The dirt became alive and asked 'why?'",
    dare: "At what exact moment does something dead become alive?",
    path: "Golden Filter → How Did Life Start?",
    depth: 1,
    weight: PHI,
    route: { convergence: "filter" },
  },
  {
    id: "gf-gravity-quantum",
    keywords: ["gravity", "quantum", "unification", "spacetime", "string", "theory", "loop", "entanglement", "holographic", "information", "bit", "atom"],
    truth: "Space isn't the stage — it's the play. Quantum entanglement may WEAVE spacetime into existence. Two wires that power everything — but don't connect. Yet.",
    dare: "What if the two forces aren't separate — just the same thing seen from two angles?",
    path: "Golden Filter → Gravity & Quantum Mechanics",
    depth: 7,
    weight: PHI,
    route: { convergence: "filter" },
  },
  {
    id: "gf-time",
    keywords: ["time", "clock", "past", "future", "present", "arrow", "entropy", "moment", "duration", "eternity", "now", "illusion"],
    truth: "Time is what entropy looks like from the inside. The past is where patterns broke. The future is where they might converge. Only NOW is real.",
    dare: "If you couldn't remember yesterday, would time still exist?",
    path: "Golden Filter → What is Time?",
    depth: 5,
    weight: PHI,
    route: { convergence: "filter" },
  },
  {
    id: "gf-dark-energy",
    keywords: ["dark", "energy", "expand", "expansion", "universe", "accelerate", "cosmological", "constant", "vacuum", "push", "invisible"],
    truth: "73% of the universe is a push with no hand. Dark energy is the nothing insisting on becoming more nothing. The void breathes outward.",
    dare: "What if the emptiest parts of the universe are actually the most powerful?",
    path: "Golden Filter → What is Dark Energy?",
    depth: 7,
    weight: 1,
    route: { convergence: "filter" },
  },
  {
    id: "gf-dark-matter",
    keywords: ["dark", "matter", "invisible", "mass", "galaxy", "rotation", "wimp", "axion", "lensing", "gravitational", "hidden", "unseen"],
    truth: "95% of the universe is dark. 95% of the mind is unconscious. A small visible portion organized by a vast invisible foundation. The root system is dark.",
    dare: "What if the things you can't see are holding together everything you can?",
    path: "Golden Filter → What is Dark Matter?",
    depth: 2,
    weight: 1,
    route: { convergence: "filter" },
  },

  // ── THE EQUATION ──
  {
    id: "equation-psi",
    keywords: ["psi", "equation", "fidelity", "recognition", "convergence", "reliability", "formula", "math", "proof", "theory", "R12", "G", "modulator"],
    truth: "Ψ = R₁₂ × G. Recognition times Reliability. When two things truly see each other AND the signal is clean — truth locks in.",
    dare: "What in your life has both recognition AND reliability — and what has only one?",
    path: "The Equation → Ψ = R₁₂ × (C_eff · D̂)",
    depth: 7,
    weight: PHI * PHI,
    route: { convergence: "plain" },
  },

  // ── CONNECT / DISCONNECT ──
  {
    id: "connect-theme",
    keywords: ["connect", "connection", "disconnect", "alone", "together", "bond", "love", "relationship", "friend", "family", "loneliness", "isolation", "together", "apart"],
    truth: "Atom bonds. Cell divides to multiply connection. Species survive by connecting. The cosmic web IS a neural network. Disconnection is the only true death.",
    dare: "What connection in your life have you let go that still has a signal?",
    path: "Layer 8 → Connection is the Universal Law",
    depth: 8,
    weight: PHI * PHI,
    route: { convergence: "filter", subcategory: "community" },
  },

  // ── LANGUAGE / ETYMOLOGY ──
  {
    id: "etymology-theme",
    keywords: ["word", "words", "language", "etymology", "latin", "greek", "english", "meaning", "hidden", "letter", "alphabet", "speak", "write", "read"],
    truth: "English is an archaeological site. Every word is a fossil. MATER > MATERIA > MATTER. MATRIX from MATER. Dig and the bones spell truth.",
    dare: "What common word do you use daily that might be hiding a deeper truth in its letters?",
    path: "Layer 6 → Etymology → The Proof in Language",
    depth: 6,
    weight: PHI,
    route: { convergence: "ancient", subcategory: "identity" },
  },

  // ── GOD / SPIRIT / FAITH ──
  {
    id: "spirit-theme",
    keywords: ["god", "spirit", "faith", "religion", "prayer", "divine", "sacred", "holy", "believe", "belief", "soul", "heaven", "hell", "afterlife", "church", "bible", "jesus", "allah", "buddha"],
    truth: "The universe made eyes so it could see itself. Made ears so it could hear itself. You are the cosmos knowing itself locally. That's sacred enough.",
    dare: "What if the sacred isn't somewhere else — but inside the mechanism of your own looking?",
    path: "Golden Filter → Consciousness + Layer 5 → The Moon",
    depth: 5,
    weight: PHI,
    route: { convergence: "sameness" },
  },

  // ── DEATH / ENDING ──
  {
    id: "death-theme",
    keywords: ["death", "die", "dying", "end", "ending", "gone", "loss", "grief", "mourn", "funeral", "afterlife", "immortal"],
    truth: "Nothing that existed truly disappears. Energy transforms. Information persists. Nine always returns to itself — no matter how far it travels, it comes home.",
    dare: "If energy can't be destroyed — where does a person go?",
    path: "Layer 9 → The Arrow → The Return",
    depth: 9,
    weight: PHI,
    route: { convergence: "filter", subcategory: "grief" },
  },

  // ── TRUTH / REALITY ──
  {
    id: "truth-theme",
    keywords: ["truth", "real", "reality", "fake", "illusion", "lie", "honest", "honesty", "genuine", "authentic", "trust"],
    truth: "Truth is the Click — the spark where two signals prove they're talking about the same thing. You can't tell someone truth. You can only place them in the same light.",
    dare: "When was the last time truth clicked for you — not taught, but felt?",
    path: "Mirror Pair → Mirror ↔ Skin → The Archway",
    depth: 4,
    weight: PHI,
    route: { convergence: "plain" },
  },

  // ── IDENTITY / SELF ──
  {
    id: "self-theme",
    keywords: ["self", "identity", "who", "am", "i", "me", "myself", "person", "personality", "ego", "name"],
    truth: "FINISH I START — the I is in the middle. The hinge on the door. You are not the room — you are what swings between rooms.",
    dare: "Are you the door, or the hinge?",
    path: "Layer 9 → FINISH I START",
    depth: 9,
    weight: PHI,
    route: { convergence: "ancient", subcategory: "langthought" },
  },

  // ── FEAR ──
  {
    id: "fear-theme",
    keywords: ["fear", "afraid", "scared", "anxiety", "worry", "panic", "terror", "brave", "courage"],
    truth: "The seed doesn't rise — it eats the dirt. Growth isn't escape from darkness. It's the conversion of darkness into structure.",
    dare: "What if the thing scaring you is the same material you need to grow?",
    path: "Layer 1 → The Seed eats the dirt",
    depth: 1,
    weight: 1,
    route: { convergence: "rock", subcategory: "evolution" },
  },

  // ── LEARNING / EDUCATION ──
  {
    id: "learning-theme",
    keywords: ["learn", "learning", "teach", "teaching", "education", "school", "study", "student", "teacher", "knowledge", "wisdom", "understand"],
    truth: "The question and the answer are the same door. You don't learn truth — you recognize it. The tuning fork was already tuned. You just finally struck it.",
    dare: "What do you already know that you haven't given yourself permission to believe?",
    path: "Mirror Pair → Spine ↔ Loop → The Tuning Fork",
    depth: 3,
    weight: PHI,
    route: { convergence: "sameness" },
  },

  // ── JOY / HAPPINESS / GRATITUDE ──
  {
    id: "joy-theme",
    keywords: ["happy", "happiness", "joy", "joyful", "glad", "delight", "elated", "bliss", "blissful", "cheerful", "ecstatic", "excited", "pleasure", "laugh", "laughter", "smile", "celebrate", "celebration", "grateful", "gratitude", "thankful", "content", "satisfied", "peace", "peaceful", "serene"],
    truth: "Joy is not the absence of pain — it's the presence of meaning. You can be broken and grateful at the same time. That's not contradiction. That's being alive.",
    dare: "What are you grateful for that you've never said out loud?",
    path: "Golden Filter → Joy & Gratitude",
    depth: 8,
    weight: PHI,
    route: { convergence: "filter" },
  },

  // ── ANGER / RAGE ──
  {
    id: "anger-theme",
    keywords: ["anger", "angry", "rage", "furious", "mad", "frustration", "frustrated", "irritated", "annoyed", "hatred", "hate", "resentment", "bitter", "outrage", "hostile", "aggression", "aggressive", "violent", "violence", "revenge", "injustice"],
    truth: "Anger is a signal, not a verdict. It tells you something matters. The question is never 'why are you angry?' The question is: what is the anger protecting?",
    dare: "What would you stop being angry about if the wound underneath it healed?",
    path: "Golden Filter → Anger & What It Guards",
    depth: 2,
    weight: PHI,
    route: { convergence: "layers" },
  },

  // ── LONELINESS ──
  {
    id: "lonely-theme",
    keywords: ["lonely", "loneliness", "alone", "isolated", "isolation", "abandoned", "disconnected", "invisible", "unseen", "unheard", "hollow", "missing", "solitude", "forgotten", "excluded", "outsider"],
    truth: "Loneliness is the signal, not the destination. You only ache for connection because connection is real. The hunger proves the food exists.",
    dare: "What if your loneliness is proof of how deeply you're capable of connecting?",
    path: "Layer 8 → The Eye → Connection",
    depth: 8,
    weight: PHI,
    route: { convergence: "filter" },
  },

  // ── REGRET / GUILT ──
  {
    id: "regret-theme",
    keywords: ["regret", "guilt", "guilty", "shame", "ashamed", "mistake", "mistakes", "wrong", "fault", "blame", "apology", "sorry", "forgive", "forgiveness", "shouldve", "couldve", "wouldve", "undo", "wish"],
    truth: "Guilt is the conscience proving it's still alive. Regret means you had values — you just couldn't see the fork in the road until you were past it. The wound is the mouth.",
    dare: "What would you say to the version of yourself who made the choice you regret?",
    path: "Buried Truth → The Wound is the Mouth",
    depth: 4,
    weight: PHI,
    route: { convergence: "filter" },
  },

  // ── HOPE / DESPAIR ──
  {
    id: "hope-theme",
    keywords: ["hope", "hopeful", "hopeless", "despair", "desperate", "lost", "stuck", "trapped", "broken", "giving", "surrender", "better", "possible", "impossible", "wish", "pray", "future"],
    truth: "The seed is most buried right before it breaks the surface. Darkness isn't the opposite of hope — it's where hope grows from. Dirt is not the enemy.",
    dare: "What if the place you feel most stuck is the exact ground you need to push through?",
    path: "Layer 1 → The Seed eats the dirt",
    depth: 1,
    weight: PHI,
    route: { convergence: "sameness" },
  },

  // ── PURPOSE / CALLING ──
  {
    id: "purpose-theme",
    keywords: ["purpose", "calling", "vocation", "mission", "destiny", "direction", "point", "reason", "fulfillment", "passion", "legacy", "impact", "matter", "significance", "goal", "goals"],
    truth: "Purpose is not found — it's grown. A seed doesn't discover its purpose in the seed. It discovers it in the becoming. The calling is in the growing, not the finding.",
    dare: "What if your purpose isn't a destination but the thing that's been pulling you all along?",
    path: "Layer 1–9 → The Full Depth",
    depth: 5,
    weight: PHI * PHI,
    route: { convergence: "plain" },
  },

  // ── BEAUTY ──
  {
    id: "beauty-theme",
    keywords: ["beauty", "beautiful", "gorgeous", "stunning", "aesthetic", "sublime", "wonder", "awe", "breathtaking", "magnificent", "exquisite", "elegant", "graceful", "lovely", "radiant", "glorious"],
    truth: "Beauty is not decoration — it's recognition. When you call something beautiful, you're saying: I see what this is. Beauty is the eye saying I know you.",
    dare: "What is the most beautiful thing you've ever witnessed that you've never told anyone?",
    path: "Layer 5 → The Moon → Recognition",
    depth: 5,
    weight: PHI,
    route: { convergence: "depths" },
  },

  // ── MUSIC ──
  {
    id: "music-theme",
    keywords: ["music", "song", "songs", "melody", "rhythm", "beat", "sound", "listen", "concert", "sing", "singing", "singer", "guitar", "piano", "drums", "voice", "lyrics", "harmony", "tune"],
    truth: "Music is the only art that lives entirely in time — you can't hold it, step back from it, or see it whole. It exists only while it's happening. Like consciousness. Like you.",
    dare: "Why does a song you haven't heard in years hit you exactly where it left you?",
    path: "Layer 7 → The Loop → Rhythm",
    depth: 7,
    weight: PHI,
    route: { convergence: "depths" },
  },

  // ── NATURE / EARTH ──
  {
    id: "nature-theme",
    keywords: ["nature", "earth", "trees", "forest", "ocean", "mountain", "river", "sky", "stars", "seasons", "weather", "rain", "wind", "wild", "wilderness", "soil", "flower", "plant", "animal", "bird"],
    truth: "You are not IN nature. You ARE nature — temporarily arranged into a shape that can look at the rest of nature and say wow. The dirt is your ancestor.",
    dare: "When is the last time you stood in something larger than yourself and let it be larger?",
    path: "Layer 3 → The Spine → The Earth",
    depth: 3,
    weight: PHI,
    route: { convergence: "pillars" },
  },

  // ── SUFFERING / PAIN ──
  {
    id: "suffering-theme",
    keywords: ["suffering", "suffer", "painful", "hurt", "ache", "aching", "sadness", "sad", "sorrow", "grief", "trauma", "traumatic", "wound", "wounded", "heartbreak", "heartbroken"],
    truth: "Pain carves out capacity. Every wound you carry is a space that wasn't there before. The question is what you'll pour into that shape once it stops bleeding.",
    dare: "What capacity do you have now that you didn't have before a specific pain?",
    path: "Buried Truth → The Wound is the Mouth",
    depth: 4,
    weight: PHI,
    route: { convergence: "filter" },
  },

  // ── WORK / CAREER ──
  {
    id: "work-theme",
    keywords: ["work", "job", "career", "profession", "business", "money", "income", "salary", "success", "failure", "ambition", "hustle", "productivity", "busy", "stressed", "overwhelmed", "deadline", "boss", "company"],
    truth: "Work is not what you do. It's what you build. And what you build while you work on other things — that's the real architecture of your life.",
    dare: "What are you quietly building in the background of your official life?",
    path: "Layer 6 → The Skin → What the Work Reveals",
    depth: 6,
    weight: 1,
    route: { convergence: "layers" },
  },

  // ── MEMORY / CHILDHOOD ──
  {
    id: "memory-theme",
    keywords: ["memory", "memories", "remember", "childhood", "child", "kid", "young", "youth", "nostalgia", "nostalgic", "home", "parents", "parent", "mother", "father", "sibling", "brother", "sister"],
    truth: "Memory is not a recording — it's a living story you retell. Every time you remember something, you change it slightly. You are the author of your own history.",
    dare: "What memory do you carry that might be more about who you are now than who you were then?",
    path: "Layer 4 → The Mirror → Memory as Reconstruction",
    depth: 4,
    weight: PHI,
    route: { convergence: "ancient" },
  },

  // ── FREEDOM / CHOICE ──
  {
    id: "freedom-theme",
    keywords: ["freedom", "free", "choice", "choose", "control", "power", "liberation", "escape", "trapped", "cage", "limits", "boundaries", "rules", "permission", "autonomy", "independent", "independence"],
    truth: "Total freedom is an empty room with no doors. The frame makes the picture possible. Constraints are not the enemy of freedom — they're the shape freedom takes.",
    dare: "What constraint in your life might secretly be what's giving it form?",
    path: "Buried Truth → The Frame is the Painting",
    depth: 7,
    weight: PHI,
    route: { convergence: "layers" },
  },

  // ── SLEEP / DREAMS ──
  {
    id: "sleep-theme",
    keywords: ["sleep", "sleeping", "tired", "exhausted", "rest", "dream", "dreaming", "nightmare", "insomnia", "awake", "waking", "unconscious", "subconscious", "night"],
    truth: "Dreams are the mind talking to itself without the censor. Sleep is not unconsciousness — it's a different kind of consciousness. Your brain is never more honest than at 3am.",
    dare: "What does your mind work on while you sleep that your waking mind avoids?",
    path: "Layer 5 → The Moon → The Unconscious",
    depth: 5,
    weight: 1,
    route: { convergence: "ancient" },
  },

  // ── EXISTENTIAL SAFETY NET ──
  {
    id: "existential-phrases",
    keywords: ["here", "point", "matters", "alive", "living", "exist", "existence", "worthwhile", "real", "anyway", "why"],
    truth: "The question 'why am I here?' is the universe examining itself through your eyes. You didn't ask the question — the universe asked it through you. That already answers something.",
    dare: "What if the fact that you're asking means something you haven't fully heard yet?",
    path: "Golden Filter → The Big Question",
    depth: 5,
    weight: PHI * PHI,
    route: { convergence: "plain" },
  },

  // ── CHANGE / TRANSFORMATION ──
  {
    id: "change-theme",
    keywords: ["change", "transform", "transformation", "different", "evolve", "evolution", "growth", "becoming", "transition", "shift", "leaving", "moving", "letting", "release", "restart", "new", "old"],
    truth: "You can't step into the same river twice — the river changed and so did you. Transformation is not becoming someone else. It's becoming more thoroughly yourself.",
    dare: "What version of yourself are you currently in the process of leaving behind?",
    path: "Layer 9 → The Arrow → The Return",
    depth: 9,
    weight: PHI,
    route: { convergence: "rock" },
  },

  // ── BODY / HEALTH ──
  {
    id: "body-theme",
    keywords: ["body", "health", "healthy", "sick", "illness", "disease", "healing", "physical", "exercise", "eat", "eating", "breath", "breathing", "heart", "mental", "strong", "weak", "energy"],
    truth: "The body keeps the score — and it's always honest. Before the mind knows what's wrong, the stomach already knotted. Before the logic catches up, the chest already tightened.",
    dare: "What is your body telling you right now that your mind is still negotiating with?",
    path: "Layer 3 → The Spine → Body as Map",
    depth: 3,
    weight: PHI,
    route: { convergence: "rock" },
  },

  // ── SILENCE / STILLNESS ──
  {
    id: "silence-theme",
    keywords: ["silence", "silent", "quiet", "still", "stillness", "pause", "calm", "meditate", "meditation", "present", "moment", "mindful", "mindfulness", "breathe"],
    truth: "Silence is not the absence of sound. It's sound that has returned to the source. The deepest note the universe plays is the one between the notes.",
    dare: "What would you hear if you stopped filling the silence?",
    path: "Layer 1 → The Seed → The Nothing",
    depth: 1,
    weight: PHI,
    route: { convergence: "plain" },
  },
];// ═══════════════════════════════════════════════════════════
// STOP WORDS — filtered out during tokenization
// ═══════════════════════════════════════════════════════════

const STOP_WORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
  "yours", "yourself", "he", "him", "his", "she", "her", "hers", "it", "its",
  "they", "them", "their", "theirs", "what", "which", "who", "whom", "this",
  "that", "these", "those", "am", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "having", "do", "does", "did", "doing",
  "a", "an", "the", "and", "but", "if", "or", "because", "as", "until",
  "while", "of", "at", "by", "for", "with", "about", "against", "between",
  "through", "during", "before", "after", "above", "below", "to", "from",
  "up", "down", "in", "out", "on", "off", "over", "under", "again",
  "further", "then", "once", "here", "there", "when", "where", "why", "how",
  "all", "both", "each", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "can", "will", "just", "don", "should", "now", "also", "like", "think",
  "know", "really", "thing", "things", "way", "much", "many", "would",
  "could", "get", "got", "go", "going", "went", "make", "made", "say",
  "said", "tell", "told", "see", "seen", "look", "looking", "come", "came",
  "take", "took", "want", "need", "feel", "believe", "im", "dont", "cant",
  "ive", "thats", "its", "doesnt", "isnt", "arent", "wont", "theres",
]);

// ═══════════════════════════════════════════════════════════
// TOKENIZER — split input into meaningful words
// ═══════════════════════════════════════════════════════════

// SYNONYM EXPANSION — maps common variants to canonical keywords
const SYNONYMS = {
  // Death/endings
  "dying": "death", "died": "death", "die": "death", "dead": "death", "killing": "death",
  // Love/connection
  "loving": "love", "loved": "love", "loved": "love", "lover": "love",
  "connected": "connection", "connecting": "connect",
  // Fear
  "afraid": "fear", "scared": "fear", "frightened": "fear", "terrified": "fear",
  "fearful": "fear", "anxious": "anxiety", "worrying": "worry", "worried": "worry",
  // Change
  "changing": "change", "changed": "change", "growing": "growth", "grew": "growth",
  "transforming": "transform", "evolving": "evolution",
  // Pain/healing
  "hurting": "hurt", "hurts": "hurt", "healing": "heal", "healed": "heal",
  "suffering": "suffer", "grieving": "grief", "grieved": "grief",
  // Joy
  "joyful": "joy", "joyous": "joy", "joyfully": "joy",
  "thankful": "gratitude", "grateful": "gratitude",
  "happily": "happy", "happiness": "happy",
  // Searching/meaning
  "searching": "search", "seeking": "seek", "finding": "find",
  "wondering": "wonder", "questioning": "question",
  // Life
  "living": "alive", "lives": "life", "lived": "life",
  "existing": "existence", "exists": "exist",
  // Forgiveness
  "forgiving": "forgive", "forgiven": "forgive",
  // Memory
  "remembering": "remember", "remembered": "memory",
  // Freedom
  "freely": "free", "freed": "freedom",
  // Silence
  "quietly": "quiet", "silence": "silent",
  // Dreams
  "dreamed": "dream", "dreamt": "dream", "dreams": "dream", "dreaming": "dream",
};

export function tokenize(text) {
  const raw = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1);

  // For very short queries (1-3 words), skip stop word filtering
  // so "why am i here" still produces tokens
  const words = raw.length <= 3
    ? raw
    : raw.filter(w => !STOP_WORDS.has(w));

  // Expand synonyms
  return words.map(w => SYNONYMS[w] || w);
}

// ═══════════════════════════════════════════════════════════
// MATCHING ENGINE — Ψ-scored similarity
// ═══════════════════════════════════════════════════════════

/**
 * Score how well user tokens match a node's keywords.
 * Uses weighted Jaccard similarity with partial matching.
 * Returns 0–1 (mapped to Psi framing).
 */
function scoreNode(userTokens, node) {
  if (userTokens.length === 0) return 0;

  let matchScore = 0;
  let matchCount = 0;

  for (const token of userTokens) {
    let bestMatch = 0;
    for (const keyword of node.keywords) {
      // Exact match
      if (token === keyword) {
        bestMatch = 1;
        break;
      }
      // Partial: token contains keyword or keyword contains token (3+ chars)
      if (token.length >= 3 && keyword.length >= 3) {
        if (keyword.includes(token) || token.includes(keyword)) {
          bestMatch = Math.max(bestMatch, 0.7);
        }
      }
      // Stem match: first 4 chars match
      if (token.length >= 4 && keyword.length >= 4 && token.slice(0, 4) === keyword.slice(0, 4)) {
        bestMatch = Math.max(bestMatch, 0.5);
      }
    }
    matchScore += bestMatch;
    if (bestMatch > 0) matchCount++;
  }

  // R₁₂ = fidelity between user input and node content
  const fidelity = matchScore / Math.max(userTokens.length, 1);

  // G_eps = informativeness gate — reward when multiple keywords match
  const coverage = matchCount / Math.max(node.keywords.length, 1);
  const informativeness = Math.sqrt(fidelity * coverage);

  // Ψ = R₁₂ × G, weighted by node importance
  return fidelity * informativeness * node.weight;
}

/**
 * THE MIRROR ENGINE
 * 
 * Takes user's truth, returns:
 *   - matched: nodes they touched (sorted by score)
 *   - dares: questions from adjacent unmatched nodes
 *   - depthScore: 0–100 how deep they went
 */
export function reflectTruth(userText) {
  const tokens = tokenize(userText);
  // Universal fallback nodes — always shown when nothing matches
  const UNIVERSAL_FALLBACKS = [
    MIRROR_NODES.find(n => n.id === "purpose-theme"),
    MIRROR_NODES.find(n => n.id === "existential-phrases"),
    MIRROR_NODES.find(n => n.id === "seed-core"),
  ].filter(Boolean);

  if (tokens.length === 0) {
    return { matched: UNIVERSAL_FALLBACKS, dares: [], depthScore: 0, tokens: [] };
  }

  // Score all nodes
  const scored = MIRROR_NODES.map(node => ({
    ...node,
    score: scoreNode(tokens, node),
  })).filter(n => n.score > 0.01);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // If nothing scored, return universal fallbacks
  if (scored.length === 0) {
    return { matched: UNIVERSAL_FALLBACKS, dares: [], depthScore: 0, tokens };
  }

  // Top matches (what they got)
  const matched = scored.slice(0, 5);

  // Find which layers they touched
  const touchedDepths = new Set(matched.map(m => m.depth));

  // Find adjacent untouched nodes for dares
  const untouched = MIRROR_NODES.filter(
    n => !touchedDepths.has(n.depth) && n.weight >= PHI
  );

  // Pick dares from diverse layers
  const dareSet = new Set();
  const dares = [];
  for (const node of untouched) {
    if (!dareSet.has(node.depth) && dares.length < 3) {
      dares.push(node);
      dareSet.add(node.depth);
    }
  }

  // If we don't have 3 dares, fill from scored nodes they partially matched
  if (dares.length < 3) {
    const partial = MIRROR_NODES.filter(
      n => !matched.includes(n) && !dares.includes(n) && n.weight >= 1
    );
    for (const node of partial) {
      if (dares.length >= 3) break;
      if (!dareSet.has(node.depth)) {
        dares.push(node);
        dareSet.add(node.depth);
      }
    }
  }

  // Depth score: how many unique layers touched × score quality
  const maxScore = matched.length > 0 ? matched[0].score : 0;
  const layerCoverage = touchedDepths.size / 9;
  const depthScore = Math.min(100, Math.round(
    (maxScore * 40 + layerCoverage * 60) * (1 + matched.length * 0.1)
  ));

  return { matched, dares, depthScore, tokens };
}
