import { Difficulty } from "@/types/game";

export interface WordSet {
  id: string;
  letters: string;
  targetWord: string; // For classroom mode
  validWords: string[]; // All possible valid words
  difficulty: Difficulty;
  hint: string;
}

export const wordSets: WordSet[] = [
  // A2 Level
  {
    id: "a2_1",
    letters: "TCARE",
    targetWord: "CATER",
    validWords: ["CAT", "CAR", "RAT", "ART", "EAT", "TEA", "ACE", "ARC", "RACE", "CARE", "RATE", "TEAR", "CRATE", "REACT", "TRACE", "CATER"],
    difficulty: "a2",
    hint: "To provide food services"
  },
  {
    id: "a2_2",
    letters: "HOUES",
    targetWord: "HOUSE",
    validWords: ["SHE", "HUE", "USE", "HOE", "SHOE", "HOSE", "HOUSE"],
    difficulty: "a2",
    hint: "A place where people live"
  },
  {
    id: "a2_3",
    letters: "TRAWE",
    targetWord: "WATER",
    validWords: ["RAT", "WAR", "WET", "ART", "EAT", "TEA", "EAR", "RAW", "TAR", "RATE", "TEAR", "WEAR", "WATER"],
    difficulty: "a2",
    hint: "A liquid we drink"
  },
  
  // B1 Level
  {
    id: "b1_1",
    letters: "TIONERS",
    targetWord: "STONIER",
    validWords: ["SIT", "TEN", "TIE", "TON", "SIN", "SON", "SET", "NET", "NOT", "NIT", "SITE", "TONE", "NOSE", "ROSE", "STONE", "STORE", "SENIOR", "STONIER"],
    difficulty: "b1",
    hint: "More rocky"
  },
  {
    id: "b1_2",
    letters: "LISENT",
    targetWord: "LISTEN",
    validWords: ["SIT", "LET", "LIE", "TEN", "TIE", "TIN", "SET", "NET", "LIST", "SITE", "LENS", "NEST", "TILE", "INLET", "LISTEN", "SILENT", "ENLIST"],
    difficulty: "b1",
    hint: "To pay attention with ears"
  },
  {
    id: "b1_3",
    letters: "GARDNE",
    targetWord: "GARDEN",
    validWords: ["AGE", "DAD", "EAR", "END", "RAG", "RED", "AGED", "DARE", "DEAR", "DRAG", "EARN", "GEAR", "GRAD", "GRAND", "RANGE", "GARDEN", "DANGER", "GANDER"],
    difficulty: "b1",
    hint: "A place where plants grow"
  },

  // B2 Level
  {
    id: "b2_1",
    letters: "ATHLECE",
    targetWord: "ATHLETE",
    validWords: ["ACE", "ATE", "CAT", "EAT", "HAT", "TEA", "THE", "ACHE", "EACH", "HATE", "HEAL", "HEAT", "LATE", "LACE", "TALE", "TEACH", "CHEAT", "LEACH", "LATCH", "ATHLETE"],
    difficulty: "b2",
    hint: "A person who competes in sports"
  },
  {
    id: "b2_2",
    letters: "COMPTERS",
    targetWord: "COMPUTERS",
    validWords: ["COP", "CUP", "CUT", "MET", "PET", "SET", "TOP", "MOST", "POST", "ROPE", "STOP", "TERM", "COME", "CORE", "SPORT", "STORE", "TROPE", "COMPUTE", "CUSTOMER", "COMPUTERS"],
    difficulty: "b2",
    hint: "Electronic devices for processing data (plural)"
  },
  {
    id: "b2_3",
    letters: "STRANGER",
    targetWord: "STRANGER",
    validWords: ["AGE", "ART", "EAR", "EAT", "GAS", "NET", "RAT", "SAT", "SET", "TAG", "TAN", "TEA", "ANTS", "GATE", "GEAR", "RATE", "RENT", "SAGE", "STARE", "RANGE", "STRANGE", "STRANGER"],
    difficulty: "b2",
    hint: "Someone you don't know"
  },

  // C1 Level
  {
    id: "c1_1",
    letters: "RENAISSAC",
    targetWord: "RENAISSANCE",
    validWords: ["CAN", "CAR", "SIN", "SIR", "AIR", "ARC", "ACE", "RAIN", "RACE", "SCAR", "NICE", "CRANE", "CEASE", "SNARE", "ARISE", "RENAISSANCE"],
    difficulty: "c1",
    hint: "A period of cultural rebirth in Europe"
  },
  {
    id: "c1_2",
    letters: "PHILOSOPHY",
    targetWord: "PHILOSOPHY",
    validWords: ["HIP", "HOP", "SHY", "SLY", "SOY", "SPY", "SHIP", "SHOP", "LOOP", "POOL", "POLO", "SLOPPY", "PHILOSOPHY"],
    difficulty: "c1",
    hint: "The study of fundamental questions about existence"
  },
  {
    id: "c1_3",
    letters: "ELABORATE",
    targetWord: "ELABORATE",
    validWords: ["ART", "BAR", "BAT", "EAR", "EAT", "LAB", "LET", "LOT", "OAR", "RAT", "TAB", "ABLE", "BEAR", "BEAT", "BOAT", "BORE", "LATE", "RATE", "REAL", "TALE", "RELATE", "OBLATE", "ORATE", "ELABORATE"],
    difficulty: "c1",
    hint: "To explain in detail or make more complex"
  },

  // C2 Level
  {
    id: "c2_1",
    letters: "JUXTAPOSE",
    targetWord: "JUXTAPOSE",
    validWords: ["AXE", "APT", "SAT", "SEA", "SET", "TAX", "TOP", "TOE", "JUST", "PAST", "POET", "STOP", "TAPE", "TAPS", "SETUP", "PASTE", "UPSET", "JUXTAPOSE"],
    difficulty: "c2",
    hint: "To place side by side for comparison"
  },
  {
    id: "c2_2",
    letters: "UBIQUITOUS",
    targetWord: "UBIQUITOUS",
    validWords: ["BIT", "BUT", "BUS", "QUI", "SIT", "SUB", "SUIT", "QUIT", "BOUT", "BUST", "QUOTE", "UBIQUITOUS"],
    difficulty: "c2",
    hint: "Present everywhere at the same time"
  },
  {
    id: "c2_3",
    letters: "SERENDIPITY",
    targetWord: "SERENDIPITY",
    validWords: ["DEN", "DIN", "DIP", "END", "PEN", "PET", "PIN", "PIT", "RED", "RID", "SET", "SIN", "SIP", "SIT", "TEN", "TIE", "TIN", "TIP", "TIDE", "TIER", "TRIP", "SEED", "RESIDENT", "DESTINY", "SERENDIPITY"],
    difficulty: "c2",
    hint: "Finding something good by accident"
  },
];
