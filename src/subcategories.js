// ═══════════════════════════════════════════════════════════════
// THE 100 ROOMS — 10 Subcategories × 10 Doors
// CR-validated: Wikipedia-grounded → Convergent Recognition filtered
// Every description: ONE punchy line, max 8 words
// ═══════════════════════════════════════════════════════════════

export const SUBCATEGORIES = {

  sameness: [ // ✝️ RELIGION
    { id: "prayer",      name: "Prayer & Worship",        desc: "Talking to God and showing respect",                icon: "🙏", accent: "201,168,76",  psi: 0.6972 },
    { id: "afterlife",   name: "Death & Afterlife",       desc: "What happens when the body stops",                  icon: "🕊️", accent: "180,170,140", psi: 0.6966 },
    { id: "goodevil",    name: "Good & Evil",             desc: "The battle between right and wrong",                icon: "⚖️", accent: "200,160,100", psi: 0.6917 },
    { id: "divine",      name: "God & The Divine",        desc: "Something bigger than us made everything",          icon: "✨", accent: "220,200,120", psi: 0.6802 },
    { id: "texts",       name: "Sacred Texts",            desc: "The books people believe God helped write",         icon: "📜", accent: "180,160,120", psi: 0.6632 },
    { id: "ritual",      name: "Ritual & Ceremony",       desc: "Sacred actions that carry holy meaning",            icon: "🕯️", accent: "200,170,100", psi: 0.6615 },
    { id: "faith",       name: "Faith & Doubt",           desc: "Believing when you have no proof",                  icon: "🌅", accent: "190,160,130", psi: 0.6504 },
    { id: "salvation",   name: "Salvation & Redemption",  desc: "Being rescued or forgiven after doing wrong",       icon: "🔓", accent: "201,168,76",  psi: 0.6378 },
    { id: "sacredspace", name: "Sacred Space",            desc: "Places built to feel closer to God",                icon: "⛪", accent: "170,150,130", psi: 0.6098 },
    { id: "creation",    name: "Creation",                desc: "Every religion's answer to how it began",           icon: "🌍", accent: "180,170,100", psi: 0.6806 },
  ],

  layers: [ // 🤔 PHILOSOPHY
    { id: "truth",       name: "Truth & Knowledge",       desc: "How do you know what's real?",                      icon: "🔍", accent: "160,180,200", psi: 0.6913 },
    { id: "ethics",      name: "Ethics & Right/Wrong",    desc: "Figuring out the right thing to do",                icon: "⚖️", accent: "150,170,190", psi: 0.6867 },
    { id: "meaning",     name: "Meaning & Purpose",       desc: "What is the point of being alive?",                 icon: "🧭", accent: "170,180,200", psi: 0.6794 },
    { id: "freewill",    name: "Free Will & Fate",        desc: "Do you choose — or was it decided?",                icon: "🔀", accent: "160,180,210", psi: 0.6771 },
    { id: "logic",       name: "Logic & Reason",          desc: "Thinking that can't be fooled",                     icon: "🧩", accent: "140,170,200", psi: 0.6637 },
    { id: "existence",   name: "Existence & Being",       desc: "Why is there something instead of nothing?",        icon: "💫", accent: "170,190,220", psi: 0.6623 },
    { id: "timechange",  name: "Time & Change",           desc: "Is time real, or just something we feel?",          icon: "⏳", accent: "150,170,200", psi: 0.6558 },
    { id: "language",    name: "Language & Meaning",      desc: "How words shape what you can think",                icon: "💬", accent: "160,180,190", psi: 0.6427 },
    { id: "mindbody",    name: "Mind & Body",             desc: "Where does your brain end and you begin?",          icon: "🧠", accent: "170,180,200", psi: 0.6258 },
    { id: "justice",     name: "Justice & Fairness",      desc: "What does it really mean to be fair?",              icon: "🏛️", accent: "150,180,210", psi: 0.6634 },
  ],

  rock: [ // 🔬 SCIENCE
    { id: "biology",     name: "Biology & Life",          desc: "How life works from cells to oceans",               icon: "🧬", accent: "79,195,150",  psi: 0.7044 },
    { id: "physics",     name: "Physics & Forces",        desc: "The forces that hold everything together",           icon: "⚛️", accent: "79,195,247",  psi: 0.6880 },
    { id: "earth",       name: "Earth & Geology",         desc: "Rocks, plates, and the living planet below",        icon: "🌋", accent: "150,180,100", psi: 0.6628 },
    { id: "cosmos",      name: "Astronomy & Cosmos",      desc: "What's out there beyond the sky",                   icon: "🔭", accent: "100,150,220", psi: 0.6567 },
    { id: "medicine",    name: "Medicine & Healing",      desc: "How we fix the body when it breaks",                icon: "💊", accent: "220,100,100", psi: 0.6923 },
    { id: "energy",      name: "Energy & Thermodynamics", desc: "Energy never dies — it just changes form",          icon: "⚡", accent: "240,200,80",  psi: 0.6805 },
    { id: "evolution",   name: "Evolution & Adaptation",  desc: "How life slowly changes to survive",                icon: "🐒", accent: "120,180,100", psi: 0.6785 },
    { id: "chemistry",   name: "Chemistry & Bonds",       desc: "What everything is made of inside",                 icon: "🧪", accent: "180,100,200", psi: 0.6735 },
    { id: "genetics",    name: "Genetics & DNA",          desc: "The instruction book inside every cell",            icon: "🔬", accent: "79,195,180",  psi: 0.6684 },
    { id: "ecology",     name: "Ecology & Systems",       desc: "How everything alive is connected",                 icon: "🌐", accent: "100,200,150", psi: 0.6596 },
  ],

  plain: [ // 🕯️ MYSTICISM
    { id: "meditation",  name: "Meditation & Stillness",  desc: "Getting quiet enough to hear the truth",            icon: "🧘", accent: "200,160,100", psi: 0.6853 },
    { id: "dreams",      name: "Dreams & The Unseen",     desc: "The world you visit with eyes closed",              icon: "🌙", accent: "180,160,220", psi: 0.6797 },
    { id: "oneness",     name: "Oneness & Unity",         desc: "The wall between me and everything disappears",     icon: "☯️", accent: "190,170,200", psi: 0.6718 },
    { id: "awakening",   name: "Enlightenment & Awakening", desc: "Suddenly seeing what was always there",           icon: "💡", accent: "220,200,100", psi: 0.6683 },
    { id: "geometry",    name: "Symbols & Sacred Geometry", desc: "Shapes that hold truth compressed inside",        icon: "🔺", accent: "201,168,76",  psi: 0.6306 },
    { id: "surrender",   name: "Surrender & Letting Go",  desc: "Gaining everything by letting it all go",           icon: "🍃", accent: "170,200,150", psi: 0.6624 },
    { id: "path",        name: "The Path & The Practice", desc: "The daily walk toward something greater",           icon: "🚶", accent: "180,160,140", psi: 0.6603 },
    { id: "intuition",   name: "Inner Sight & Intuition", desc: "Knowing something real without being told",         icon: "👁️", accent: "200,180,220", psi: 0.6578 },
    { id: "lifeforce",   name: "Energy & Life Force",     desc: "The invisible current through all living things",   icon: "🔥", accent: "220,160,80",  psi: 0.6498 },
    { id: "visions",     name: "Visions & Altered States", desc: "When your normal lens shifts completely",          icon: "🌀", accent: "190,140,220", psi: 0.6372 },
  ],

  depths: [ // 🎨 ART
    { id: "music",       name: "Music & Sound",           desc: "Vibrations arranged to make you feel",              icon: "🎵", accent: "190,140,220", psi: 0.7126 },
    { id: "painting",    name: "Painting & Drawing",      desc: "Dragging what's in your head onto a surface",       icon: "🖌️", accent: "224,120,100", psi: 0.6930 },
    { id: "story",       name: "Storytelling & Narrative", desc: "Arranging events so they teach something",         icon: "📖", accent: "200,160,120", psi: 0.6721 },
    { id: "theater",     name: "Theater & Performance",   desc: "Becoming someone else so you find yourself",        icon: "🎭", accent: "220,160,140", psi: 0.6686 },
    { id: "song",        name: "Song & Voice",            desc: "The human voice carrying meaning through melody",   icon: "🎤", accent: "200,140,180", psi: 0.7022 },
    { id: "dance",       name: "Dance & Movement",        desc: "Using your body as the paintbrush",                 icon: "💃", accent: "220,120,160", psi: 0.6906 },
    { id: "architecture",name: "Architecture & Built Space", desc: "Buildings that are ideas you walk inside",       icon: "🏛️", accent: "180,160,140", psi: 0.6723 },
    { id: "craft",       name: "Craft & The Hand",        desc: "When the hands know what the head forgot",          icon: "🤲", accent: "200,180,140", psi: 0.6674 },
    { id: "poetry",      name: "Poetry & The Written Word", desc: "Words squeezed tight until they explode",         icon: "✒️", accent: "190,170,200", psi: 0.6590 },
    { id: "sculpture",   name: "Sculpture & Form",        desc: "Pulling form out of stone or clay",                 icon: "🗿", accent: "180,160,140", psi: 0.6590 },
  ],

  promise: [ // 🔢 MATHEMATICS
    { id: "number",      name: "Arithmetic & Number",     desc: "The first language every human ever shared",        icon: "🔢", accent: "201,168,76",  psi: 0.7115 },
    { id: "patterns",    name: "Patterns & Sequences",    desc: "Numbers repeating in ways that mean something",     icon: "🔄", accent: "200,180,100", psi: 0.6919 },
    { id: "shape",       name: "Geometry & Shape",        desc: "How space is built from lines and circles",         icon: "📐", accent: "180,170,120", psi: 0.6834 },
    { id: "algebra",     name: "Algebra & The Unknown",   desc: "Using letters to find what you don't know",         icon: "❌", accent: "190,160,100", psi: 0.6759 },
    { id: "probability", name: "Probability & Chance",    desc: "How likely is it? The math of maybe",               icon: "🎲", accent: "180,170,140", psi: 0.6685 },
    { id: "zero",        name: "Zero & Nothing",          desc: "The number that changed everything by being nothing", icon: "⭕", accent: "201,168,76",  psi: 0.6241 },
    { id: "fractals",    name: "Fractals & Self-Similarity", desc: "Zoom in and find the same shape forever",        icon: "🌀", accent: "190,140,220", psi: 0.6097 },
    { id: "ratio",       name: "Ratio & Proportion",      desc: "The hidden recipe that makes things beautiful",     icon: "⚖️", accent: "200,170,100", psi: 0.6871 },
    { id: "symmetry",    name: "Symmetry & Balance",      desc: "When both sides mirror each other perfectly",       icon: "🪞", accent: "180,180,200", psi: 0.6656 },
    { id: "proof",       name: "Logic & Proof",           desc: "How to know something is absolutely true",          icon: "✅", accent: "160,180,200", psi: 0.6533 },
  ],

  gravity: [ // 📖 MYTHOLOGY
    { id: "creationmyth",name: "Creation Myths",          desc: "Every culture's answer to how it all began",        icon: "🌅", accent: "200,160,100", psi: 0.7032 },
    { id: "hero",        name: "The Hero's Journey",      desc: "Leave home, face the worst, come back changed",     icon: "⚔️", accent: "220,180,100", psi: 0.6987 },
    { id: "flood",       name: "The Flood & The Reset",   desc: "When the world washes clean and starts over",       icon: "🌊", accent: "100,180,220", psi: 0.6843 },
    { id: "gods",        name: "Gods & Spirits",          desc: "Beings bigger than us that shape the world",        icon: "⚡", accent: "220,200,100", psi: 0.6778 },
    { id: "prophecy",    name: "Prophecy & Fate",         desc: "The story already written before it happened",      icon: "🔮", accent: "190,140,220", psi: 0.6174 },
    { id: "sacrifice",   name: "The Sacrifice",           desc: "Giving up what's precious for the greater good",    icon: "🩸", accent: "200,80,80",   psi: 0.6913 },
    { id: "trickster",   name: "Tricksters & Chaos",      desc: "The rule-breakers who teach the real lesson",       icon: "🦊", accent: "220,160,80",  psi: 0.6760 },
    { id: "rebirth",     name: "Death & Rebirth",         desc: "Something must die for something new to live",      icon: "🔄", accent: "180,160,200", psi: 0.6731 },
    { id: "underworld",  name: "The Underworld & Descent", desc: "You must go down before you come up",              icon: "⬇️", accent: "140,130,160", psi: 0.6672 },
    { id: "garden",      name: "The Garden & Paradise Lost", desc: "The perfect place we had and lost",              icon: "🌳", accent: "120,180,100", psi: 0.6638 },
  ],

  pillars: [ // 🌿 NATURE
    { id: "water",       name: "Water & Flow",            desc: "Takes any shape — and gives everything life",       icon: "💧", accent: "100,180,220", psi: 0.7121 },
    { id: "animals",     name: "Animals & Instinct",      desc: "Creatures that know without thinking",              icon: "🐾", accent: "180,160,120", psi: 0.7090 },
    { id: "sky",         name: "Sky & Weather",           desc: "The planet's mood — sun, storm, and calm",          icon: "🌤️", accent: "140,180,220", psi: 0.7038 },
    { id: "seasons",     name: "Seasons & Cycles",        desc: "Death that always comes back to life",              icon: "🍂", accent: "200,160,80",  psi: 0.6982 },
    { id: "trees",       name: "Trees & Roots",           desc: "The underground network that connects everything",  icon: "🌳", accent: "100,180,100", psi: 0.6966 },
    { id: "seeds",       name: "Seeds & Growth",          desc: "The smallest thing with the biggest plan",          icon: "🌱", accent: "120,200,100", psi: 0.6966 },
    { id: "soil",        name: "Earth & Soil",            desc: "Where the dead feed the living",                    icon: "🌍", accent: "160,140,100", psi: 0.6922 },
    { id: "light",       name: "Light & Darkness",        desc: "You can't have one without the other",              icon: "☀️", accent: "220,200,100", psi: 0.6885 },
    { id: "ocean",       name: "Ocean & Depth",           desc: "Where we came from — the last unknown",             icon: "🌊", accent: "60,140,200",  psi: 0.6853 },
    { id: "fire",        name: "Fire & Transformation",   desc: "Destroys and reveals at the same time",             icon: "🔥", accent: "220,120,60",  psi: 0.6838 },
  ],

  filter: [ // ❤️ LOVE & RELATIONSHIP
    { id: "family",      name: "Family & Blood",          desc: "The bond you were born into",                       icon: "👨‍👩‍👧‍👦", accent: "220,160,160", psi: 0.7079 },
    { id: "mother",      name: "Mother & Child",          desc: "The first bond — before words, before memory",      icon: "🤱", accent: "220,140,160", psi: 0.7027 },
    { id: "community",   name: "Community & Belonging",   desc: "The bigger body you belong to",                     icon: "🤝", accent: "200,160,140", psi: 0.7017 },
    { id: "grief",       name: "Grief & Loss",            desc: "Love with nowhere left to go",                      icon: "🥀", accent: "180,140,160", psi: 0.7009 },
    { id: "romantic",    name: "Romantic Love & The Pair", desc: "Two people choosing each other above everyone",    icon: "💕", accent: "220,100,120", psi: 0.6990 },
    { id: "giving",      name: "Sacrifice & Giving",      desc: "Losing yours so someone else has more",             icon: "🎁", accent: "201,168,76",  psi: 0.6920 },
    { id: "friendship",  name: "Friendship & Chosen Bond", desc: "The family you built yourself",                    icon: "🤙", accent: "180,160,200", psi: 0.6830 },
    { id: "loneliness",  name: "Loneliness & Longing",    desc: "The ache of wanting and not having",                icon: "🌑", accent: "160,150,180", psi: 0.6821 },
    { id: "trust",       name: "Vulnerability & Trust",   desc: "Letting someone see you with no armor on",          icon: "🛡️", accent: "180,170,200", psi: 0.6816 },
    { id: "attraction",  name: "Attraction & The Pull",   desc: "The invisible force that draws two people together", icon: "🧲", accent: "220,140,140", psi: 0.6763 },
  ],

  ancient: [ // 🧠 CONSCIOUSNESS
    { id: "emotion",     name: "Emotion & Feeling",       desc: "What the body knows before the brain does",         icon: "❤️‍🔥", accent: "200,160,160", psi: 0.6919 },
    { id: "deathend",    name: "Death & The End",         desc: "The wall... or the door",                           icon: "🚪", accent: "180,170,200", psi: 0.6913 },
    { id: "memory",      name: "Memory & Time",           desc: "The story you tell yourself about yourself",        icon: "📷", accent: "180,180,200", psi: 0.6837 },
    { id: "identity",    name: "Identity & The Self",     desc: "Who are you when nobody's watching?",               icon: "🪞", accent: "200,200,230", psi: 0.6728 },
    { id: "langthought", name: "Language & Thought",      desc: "Can you think without a word for it?",              icon: "💭", accent: "180,190,210", psi: 0.6371 },
    { id: "observer",    name: "The Observer & Awareness", desc: "The thing watching the thing thinking",             icon: "👁️", accent: "200,200,230", psi: 0.6166 },
    { id: "dreamsleep",  name: "Dreams & Sleep",          desc: "The other life lived when eyes close",              icon: "😴", accent: "160,160,200", psi: 0.6851 },
    { id: "perception",  name: "Perception & The Filter", desc: "You see your version — not reality itself",         icon: "🔮", accent: "190,170,220", psi: 0.6755 },
    { id: "choice",      name: "Free Will & Choice",      desc: "Are you the driver or the road?",                   icon: "🛤️", accent: "180,180,200", psi: 0.6685 },
    { id: "attention",   name: "Attention & Focus",       desc: "What you focus on becomes your world",              icon: "🎯", accent: "200,180,180", psi: 0.6649 },
  ],
};

// Door metadata for subcategory views
export const DOOR_META = {
  sameness:  { name: "RELIGION",       emoji: "✝️", tagline: "What has God revealed, and how must we live in response?" },
  layers:    { name: "PHILOSOPHY",     emoji: "🤔", tagline: "What can we know through reason alone?" },
  rock:      { name: "SCIENCE",        emoji: "🔬", tagline: "How does the universe work, and what are its laws?" },
  plain:     { name: "MYSTICISM",      emoji: "🕯️", tagline: "Can I experience God directly, without mediation?" },
  depths:    { name: "ART",            emoji: "🎨", tagline: "What truth can only be expressed by creating something?" },
  promise:   { name: "MATHEMATICS",    emoji: "🔢", tagline: "What is the hidden structure beneath all things?" },
  gravity:   { name: "MYTHOLOGY",      emoji: "📖", tagline: "What stories keep telling themselves, and why?" },
  pillars:   { name: "NATURE",         emoji: "🌿", tagline: "What does the Earth itself teach us about existence?" },
  filter:    { name: "LOVE",           emoji: "❤️", tagline: "Is the deepest truth found in the space between us?" },
  ancient:   { name: "CONSCIOUSNESS",  emoji: "🧠", tagline: "What is this awareness that makes all experience possible?" },
};

// Get subcategories for a door key
export function getSubcategories(doorKey) {
  return SUBCATEGORIES[doorKey] || [];
}

// Get a specific subcategory by door key and sub id
export function getSubcategory(doorKey, subId) {
  const subs = SUBCATEGORIES[doorKey] || [];
  return subs.find(s => s.id === subId) || null;
}
