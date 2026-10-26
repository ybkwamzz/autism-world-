import type { ScenarioNode } from '../components/ScenarioPlayer';

export type ConceptCategory = 'noun' | 'verb' | 'emotion' | 'social';
export type ConceptSubcategory = 'food' | 'animal' | 'object' | 'place' | 'verb' | 'emotion';

export type EdgeRelationType =
  | 'is_a'
  | 'part_of'
  | 'used_for'
  | 'found_in'
  | 'contrasts_with'
  | 'causes'
  | 'precedes'
  | 'associated_with';

export interface ConceptExemplar {
  id: string;
  variant: 'primary' | 'context' | 'detail' | 'caregiver_photo';
  title_en: string;
  title_swa: string;
  bgClass: string;
  accentClass: string;
  ringClass: string;
  customDataUrl?: string;
}

export interface ConceptAttributes {
  color?: string[];
  shape?: string;
  texture?: string;
  taste?: string;
  energy?: string;
  bodyPart?: string;
  expression?: string;
}

export interface ConceptBeats {
  what: string;
  does: string;
  usedFor: string;
  found: string;
  what_swa: string;
  does_swa: string;
  usedFor_swa: string;
  found_swa: string;
}

export interface ConceptNode {
  id: string;
  type: 'concept';
  label: string;
  swahiliLabel: string;
  category: ConceptCategory;
  subcategory: ConceptSubcategory;
  held_out: boolean;
  attributes: ConceptAttributes;
  found_in: string[];
  used_for: string[];
  actions: string[];
  beats: ConceptBeats;
  exemplars: ConceptExemplar[];
}

export interface ConceptEdge {
  from_id: string;
  to_id: string;
  relation: EdgeRelationType;
  explanation_en: string;
  explanation_swa: string;
}

export type PatternTaskType =
  | 'predict_next_beat'
  | 'odd_one_out'
  | 'sort_group'
  | 'transfer_slot'
  | 'cue_transfer';

export interface PatternTaskOption {
  id: string;
  label_en: string;
  label_swa: string;
  conceptId?: string;
  subcategory?: ConceptSubcategory;
  hint_en?: string;
  hint_swa?: string;
}

export interface PatternTask {
  id: string;
  type: PatternTaskType;
  source_relation: EdgeRelationType | 'beat_template';
  target_concept_id: string;
  held_out: boolean;
  choice_level: 1 | 2 | 3;
  scaffold_level: 0 | 1 | 2 | 3;
  prompt_en: string;
  prompt_swa: string;
  context_beats?: { beat1_en: string; beat1_swa: string; beat2_en: string; beat2_swa: string };
  sort_groups?: Array<{ id: string; label_en: string; label_swa: string }>;
  options: PatternTaskOption[];
  correct_id: string;
  explanation_en: string;
  explanation_swa: string;
}

export const RELATION_LABELS: Record<EdgeRelationType, { en: string; swa: string; badgeClass: string }> = {
  is_a: {
    en: 'Is a type of (Category)',
    swa: 'Ni aina ya (Kundi)',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
  },
  part_of: {
    en: 'Part of / Belongs with',
    swa: 'Sehemu ya',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
  },
  used_for: {
    en: 'Used for (Function)',
    swa: 'Inatumika kwa (Kazi)',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  },
  found_in: {
    en: 'Found in (Setting)',
    swa: 'Inapatikana (Mahali)',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
  },
  contrasts_with: {
    en: 'Contrasts with (Different)',
    swa: 'Tofauti na',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
  },
  causes: {
    en: 'Causes / Leads to',
    swa: 'Husababisha',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
  },
  precedes: {
    en: 'Happens before (Sequence)',
    swa: 'Hutangulia (Mtiririko)',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
  },
  associated_with: {
    en: 'Associated with',
    swa: 'Inahusiana na',
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
  }
};

export const PATTERN_TASK_METADATA: Record<
  PatternTaskType,
  { title_en: string; title_swa: string; desc_en: string; desc_swa: string; relation: string }
> = {
  predict_next_beat: {
    title_en: 'Predict Next Beat',
    title_swa: 'Tabiri Hatua Ifuatayo',
    desc_en: 'Sees the first two lesson beats and predicts the third beat in the sequence.',
    desc_swa: 'Anaona hatua mbili za kwanza na kutabiri hatua ya tatu katika mpangilio.',
    relation: '4-Beat Template'
  },
  odd_one_out: {
    title_en: 'Odd One Out',
    title_swa: 'Chagua Kilicho Tofauti',
    desc_en: 'Identifies the item that belongs to a contrasting category.',
    desc_swa: 'Anatambua kitu ambacho hakiingii kwenye kundi moja na vingine.',
    relation: 'is_a + contrasts_with'
  },
  sort_group: {
    title_en: 'Category Sorting',
    title_swa: 'Panga Kwenye Makundi',
    desc_en: 'Places items into the matching semantic category group (Food, Animals, Objects, Places).',
    desc_swa: 'Anaweka vitu kwenye kundi sahihi (Chakula, Wanyama, Vifaa, Mahali).',
    relation: 'is_a'
  },
  transfer_slot: {
    title_en: 'Held-Out Transfer Test',
    title_swa: 'Jaribio la Kuhamisha Ujuzi',
    desc_en: 'Applies slot patterns ("Where is it found?", "What is it used for?") to untaught held-out concepts.',
    desc_swa: 'Anatumia muundo wa maswali kwa maneno mapya ambayo hayajafundishwa moja kwa moja.',
    relation: 'found_in + used_for (Held-Out)'
  },
  cue_transfer: {
    title_en: 'Social Cue Transfer',
    title_swa: 'Uhamisho wa Ishara za Kijamii',
    desc_en: 'Generalizes a practiced social communication response from school to home (or home to school).',
    desc_swa: 'Anahamisha jibu la mawasiliano kutoka shuleni kwenda nyumbani (au nyumbani kwenda shuleni).',
    relation: 'related_scenario_ids + precedes'
  }
};

function makeExemplars(
  id: string,
  en1: string,
  swa1: string,
  en2: string,
  swa2: string,
  en3: string,
  swa3: string,
  palette: 'rose' | 'amber' | 'sky' | 'emerald' | 'purple' | 'orange' | 'stone' | 'blue'
): ConceptExemplar[] {
  const palettes = {
    rose: [
      { bg: 'bg-rose-50 dark:bg-rose-950/30', accent: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-200 dark:ring-rose-800/40' },
      { bg: 'bg-emerald-50 dark:bg-emerald-950/30', accent: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800/40' },
      { bg: 'bg-amber-50 dark:bg-amber-950/30', accent: 'text-amber-700 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-800/40' }
    ],
    amber: [
      { bg: 'bg-amber-50 dark:bg-amber-950/30', accent: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-800/40' },
      { bg: 'bg-orange-50 dark:bg-orange-950/30', accent: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-200 dark:ring-orange-800/40' },
      { bg: 'bg-stone-100 dark:bg-stone-900/50', accent: 'text-stone-700 dark:text-stone-300', ring: 'ring-stone-300 dark:ring-stone-700' }
    ],
    sky: [
      { bg: 'bg-sky-50 dark:bg-sky-950/30', accent: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-200 dark:ring-sky-800/40' },
      { bg: 'bg-blue-50 dark:bg-blue-950/30', accent: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-200 dark:ring-blue-800/40' },
      { bg: 'bg-teal-50 dark:bg-teal-950/30', accent: 'text-teal-600 dark:text-teal-400', ring: 'ring-teal-200 dark:ring-teal-800/40' }
    ],
    emerald: [
      { bg: 'bg-emerald-50 dark:bg-emerald-950/30', accent: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800/40' },
      { bg: 'bg-teal-50 dark:bg-teal-950/30', accent: 'text-teal-700 dark:text-teal-300', ring: 'ring-teal-200 dark:ring-teal-800/40' },
      { bg: 'bg-lime-50 dark:bg-lime-950/30', accent: 'text-lime-700 dark:text-lime-400', ring: 'ring-lime-200 dark:ring-lime-800/40' }
    ],
    purple: [
      { bg: 'bg-purple-50 dark:bg-purple-950/30', accent: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-200 dark:ring-purple-800/40' },
      { bg: 'bg-indigo-50 dark:bg-indigo-950/30', accent: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-200 dark:ring-indigo-800/40' },
      { bg: 'bg-rose-50 dark:bg-rose-950/30', accent: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-200 dark:ring-rose-800/40' }
    ],
    orange: [
      { bg: 'bg-orange-50 dark:bg-orange-950/30', accent: 'text-[#C77700] dark:text-[#E89B2E]', ring: 'ring-orange-200 dark:ring-orange-800/40' },
      { bg: 'bg-amber-50 dark:bg-amber-950/30', accent: 'text-amber-700 dark:text-amber-300', ring: 'ring-amber-200 dark:ring-amber-800/40' },
      { bg: 'bg-rose-50 dark:bg-rose-950/30', accent: 'text-rose-700 dark:text-rose-300', ring: 'ring-rose-200 dark:ring-rose-800/40' }
    ],
    stone: [
      { bg: 'bg-stone-50 dark:bg-stone-900/40', accent: 'text-stone-700 dark:text-stone-300', ring: 'ring-stone-200 dark:ring-stone-700' },
      { bg: 'bg-amber-50/70 dark:bg-amber-950/20', accent: 'text-[#C77700] dark:text-[#E89B2E]', ring: 'ring-amber-200 dark:ring-amber-800/30' },
      { bg: 'bg-emerald-50/70 dark:bg-emerald-950/20', accent: 'text-[#2F6B4F] dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800/30' }
    ],
    blue: [
      { bg: 'bg-blue-50 dark:bg-blue-950/30', accent: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-200 dark:ring-blue-800/40' },
      { bg: 'bg-sky-50 dark:bg-sky-950/30', accent: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-200 dark:ring-sky-800/40' },
      { bg: 'bg-amber-50 dark:bg-amber-950/30', accent: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-200 dark:ring-amber-800/40' }
    ]
  }[palette];

  return [
    {
      id: `${id}-ex-1`,
      variant: 'primary',
      title_en: en1,
      title_swa: swa1,
      bgClass: palettes[0].bg,
      accentClass: palettes[0].accent,
      ringClass: palettes[0].ring
    },
    {
      id: `${id}-ex-2`,
      variant: 'context',
      title_en: en2,
      title_swa: swa2,
      bgClass: palettes[1].bg,
      accentClass: palettes[1].accent,
      ringClass: palettes[1].ring
    },
    {
      id: `${id}-ex-3`,
      variant: 'detail',
      title_en: en3,
      title_swa: swa3,
      bgClass: palettes[2].bg,
      accentClass: palettes[2].accent,
      ringClass: palettes[2].ring
    }
  ];
}

// ============================================================================
// 24 SEED CONCEPTS (18 Taught in Passive Layer + 6 Held-Out for Transfer Tests)
// ============================================================================
export const KNOWLEDGE_CONCEPTS: ConceptNode[] = [
  // --- FOODS (4 Taught + 1 Held-Out) ---
  {
    id: 'apple',
    type: 'concept',
    label: 'Apple',
    swahiliLabel: 'Tufaha',
    category: 'noun',
    subcategory: 'food',
    held_out: false,
    attributes: { color: ['Red', 'Green'], shape: 'Round', texture: 'Crisp & Smooth', taste: 'Sweet' },
    found_in: ['Kitchen', 'Market', 'Lunchbox', 'Tree'],
    used_for: ['Eating as a healthy snack', 'Sharing at break time'],
    actions: ['Wash', 'Bite', 'Chew', 'Slice'],
    beats: {
      what: 'An apple is a crisp, healthy fruit.',
      does: 'It grows on fruit trees in farms and orchards.',
      usedFor: 'We eat apples as nutritious food for energy.',
      found: 'Apples are found at home, school, or the local market.',
      what_swa: 'Tufaha ni tunda zuri na lenye afya.',
      does_swa: 'Hukua juu ya miti mashambani na bustanini.',
      usedFor_swa: 'Tunakula tufaha kama chakula bora cha kutupa nguvu.',
      found_swa: 'Tufaha hupatikana nyumbani, shuleni, au sokoni.'
    },
    exemplars: makeExemplars(
      'apple',
      'Red Whole Apple',
      'Tufaha Jekundu Kamili',
      'Green Crisp Apple',
      'Tufaha la Kijani',
      'Sliced Apple on Plate',
      'Vipande vya Tufaha Sahanini',
      'rose'
    )
  },
  {
    id: 'banana',
    type: 'concept',
    label: 'Banana',
    swahiliLabel: 'Ndizi',
    category: 'noun',
    subcategory: 'food',
    held_out: false,
    attributes: { color: ['Yellow', 'Green'], shape: 'Curved', texture: 'Soft inside, smooth peel', taste: 'Sweet' },
    found_in: ['Market', 'Home kitchen', 'Farm'],
    used_for: ['Peeling and eating for breakfast or snack'],
    actions: ['Peel', 'Slice', 'Eat'],
    beats: {
      what: 'A banana is a soft, curved yellow fruit.',
      does: 'It grows in bunches on tall banana plants.',
      usedFor: 'We peel and eat a banana when we are hungry.',
      found: 'Bananas are found in the kitchen and at the market.',
      what_swa: 'Ndizi ni tunda laini la njano lililopinda.',
      does_swa: 'Hukua kwenye mikungu juu ya migomba.',
      usedFor_swa: 'Tunamenya na kula ndizi tunapohisi njaa.',
      found_swa: 'Ndizi hupatikana jikoni na sokoni.'
    },
    exemplars: makeExemplars(
      'banana',
      'Ripe Yellow Banana',
      'Ndizi Mbivu ya Njano',
      'Peeled Banana Snack',
      'Ndizi Iliyomenywa',
      'Bunch of Market Bananas',
      'Mkungu wa Ndizi Sokoni',
      'amber'
    )
  },
  {
    id: 'milk',
    type: 'concept',
    label: 'Milk',
    swahiliLabel: 'Maziwa',
    category: 'noun',
    subcategory: 'food',
    held_out: false,
    attributes: { color: ['White'], shape: 'Liquid', texture: 'Smooth & Cool', taste: 'Creamy' },
    found_in: ['Cup', 'Kitchen fridge', 'Shop'],
    used_for: ['Drinking to build strong bones and teeth'],
    actions: ['Pour', 'Sip', 'Drink'],
    beats: {
      what: 'Milk is a healthy white drink.',
      does: 'It pours smoothly into a cup or glass.',
      usedFor: 'We drink milk to grow strong bones and teeth.',
      found: 'Milk is found in the kitchen at home and at school.',
      what_swa: 'Maziwa ni kinywaji cheupe chenye afya.',
      does_swa: 'Humiminika vizuri ndani ya kikombe.',
      usedFor_swa: 'Tunakunywa maziwa kujenga mifupa na meno imara.',
      found_swa: 'Maziwa hupatikana jikoni nyumbani na shuleni.'
    },
    exemplars: makeExemplars(
      'milk',
      'Glass of Fresh Milk',
      'Gilasi ya Maziwa Safi',
      'Milk Packet & Jug',
      'Pakiti na Jagi la Maziwa',
      'Warm Morning Milk Cup',
      'Kikombe cha Maziwa ya Asubuhi',
      'sky'
    )
  },
  {
    id: 'bread',
    type: 'concept',
    label: 'Bread',
    swahiliLabel: 'Mkate',
    category: 'noun',
    subcategory: 'food',
    held_out: false,
    attributes: { color: ['Golden Brown', 'White'], shape: 'Loaf / Square slice', texture: 'Soft & Spongy', taste: 'Mild & Savory' },
    found_in: ['Kitchen', 'Bakery', 'Breakfast table'],
    used_for: ['Making breakfast slices and sandwiches'],
    actions: ['Slice', 'Spread', 'Eat'],
    beats: {
      what: 'Bread is a soft baked food made from flour.',
      does: 'It comes in slices that are easy to hold and chew.',
      usedFor: 'We eat bread with tea or milk in the morning.',
      found: 'Bread is kept on the kitchen table and in local shops.',
      what_swa: 'Mkate ni chakula laini kilichookwa kwa unga.',
      does_swa: 'hukatwa vipande rahisi kushika na kutafuna.',
      usedFor_swa: 'Tunakula mkate na chai au maziwa asubuhi.',
      found_swa: 'Mkate hupatikana mezani jikoni na dukani.'
    },
    exemplars: makeExemplars(
      'bread',
      'Sliced Loaf of Bread',
      'Mkate Uliokatwa Vipande',
      'Two Breakfast Toast Slices',
      'Vipande Viwili vya Mkate',
      'Bakery Whole Loaf',
      'Mkate Mzima wa Dukani',
      'amber'
    )
  },
  {
    id: 'mango',
    type: 'concept',
    label: 'Mango',
    swahiliLabel: 'Embe',
    category: 'noun',
    subcategory: 'food',
    held_out: true, // HELD-OUT FOR TRANSFER TESTING
    attributes: { color: ['Orange', 'Yellow', 'Green'], shape: 'Oval', texture: 'Juicy & Smooth', taste: 'Sweet & Tropical' },
    found_in: ['Market', 'Kitchen', 'Tree'],
    used_for: ['Eating as a sweet fruit or making juice'],
    actions: ['Wash', 'Peel', 'Slice', 'Eat'],
    beats: {
      what: 'A mango is a sweet, juicy tropical fruit.',
      does: 'It ripens on mango trees in warm weather.',
      usedFor: 'We eat mango slices or blend them into fresh juice.',
      found: 'Mangoes are found at the market and in home kitchens.',
      what_swa: 'Embe ni tunda tamu lenye majimaji mengi.',
      does_swa: 'Huiva juu ya miembe wakati wa joto.',
      usedFor_swa: 'Tunakula vipande vya embe au kutengeneza juisi.',
      found_swa: 'Maembe hupatikana sokoni na jikoni nyumbani.'
    },
    exemplars: makeExemplars(
      'mango',
      'Ripe Golden Mango',
      'Embe Mbivu la Njano',
      'Sliced Juicy Mango',
      'Vipande vya Embe Tamu',
      'Fresh Mango in Basket',
      'Embe Ndani ya Kikapu',
      'orange'
    )
  },

  // --- ANIMALS (3 Taught + 1 Held-Out) ---
  {
    id: 'dog',
    type: 'concept',
    label: 'Dog',
    swahiliLabel: 'Mbwa',
    category: 'noun',
    subcategory: 'animal',
    held_out: false,
    attributes: { color: ['Brown', 'Black', 'Spotted'], shape: 'Four-legged animal', texture: 'Furry', energy: 'Playful' },
    found_in: ['Home compound', 'Neighbourhood', 'Outdoors'],
    used_for: ['Guarding the home and being a loyal friend'],
    actions: ['Bark', 'Run', 'Wag tail', 'Fetch'],
    beats: {
      what: 'A dog is a friendly, furry animal.',
      does: 'A dog can bark, wag its tail, and run outside.',
      usedFor: 'Dogs are trusted companions and help guard our homes.',
      found: 'Dogs are found in home compounds and neighbourhoods.',
      what_swa: 'Mbwa ni mnyama rafiki mwenye manyoya.',
      does_swa: 'Mbwa anaweza kubweka, kuchezesha mkia, na kukimbia.',
      usedFor_swa: 'Mbwa ni rafiki mwaminifu na hulinda nyumba zetu.',
      found_swa: 'Mbwa hupatikana nyumbani na mtaani.'
    },
    exemplars: makeExemplars(
      'dog',
      'Friendly Brown Puppy',
      'Mbwa Mdogo wa Kahawia',
      'Playful Running Dog',
      'Mbwa Anayekimbia Uwanjani',
      'Resting Family Dog',
      'Mbwa Anayepumzika Nyumbani',
      'amber'
    )
  },
  {
    id: 'cat',
    type: 'concept',
    label: 'Cat',
    swahiliLabel: 'Paka',
    category: 'noun',
    subcategory: 'animal',
    held_out: false,
    attributes: { color: ['Orange', 'Grey', 'White'], shape: 'Small four-legged pet', texture: 'Soft fur', energy: 'Calm & Agile' },
    found_in: ['House', 'Veranda', 'Garden'],
    used_for: ['Keeping company and chasing mice away'],
    actions: ['Purr', 'Meow', 'Stretch', 'Sleep'],
    beats: {
      what: 'A cat is a quiet, soft domestic animal.',
      does: 'A cat says meow, purrs softly, and cleans its paws.',
      usedFor: 'Cats are gentle pets that live peacefully with families.',
      found: 'Cats are found resting inside the house or on a warm porch.',
      what_swa: 'Paka ni mnyama mpole wa nyumbani mwenye manyoya laini.',
      does_swa: 'Paka hulia nyau na kujisafisha miguu yake.',
      usedFor_swa: 'Paka ni mnyama rafiki anayeishi na familia.',
      found_swa: 'Paka hupatikana ndani ya nyumba au barazani.'
    },
    exemplars: makeExemplars(
      'cat',
      'Striped Ginger Cat',
      'Paka mwenye Mistari',
      'Curled Sleeping Cat',
      'Paka Aliyelala',
      'Curious Sitting Cat',
      'Paka Aliyeketi kwa Utulivu',
      'orange'
    )
  },
  {
    id: 'bird',
    type: 'concept',
    label: 'Bird',
    swahiliLabel: 'Ndege',
    category: 'noun',
    subcategory: 'animal',
    held_out: false,
    attributes: { color: ['Blue', 'Yellow', 'Green'], shape: 'Winged animal with beak', texture: 'Feathered', energy: 'Light & Swift' },
    found_in: ['Trees', 'Sky', 'School compound', 'Garden'],
    used_for: ['Singing morning songs and spreading seeds in nature'],
    actions: ['Fly', 'Chirp', 'Build nest', 'Hop'],
    beats: {
      what: 'A bird is an animal with feathers, wings, and a beak.',
      does: 'It flies in the sky and sings cheerful songs in trees.',
      usedFor: 'We watch and listen to birds to enjoy nature outdoors.',
      found: 'Birds are found in garden trees, parks, and schoolyards.',
      what_swa: 'Ndege ni mnyama mwenyeuloya, mabawa, na mdomo.',
      does_swa: 'Huruka angani na kuimba nyimbo nzuri mitini.',
      usedFor_swa: 'Tunatazama na kusikiliza ndege kufurahia mazingira.',
      found_swa: 'Ndege hupatikana kwenye miti bustanini na shuleni.'
    },
    exemplars: makeExemplars(
      'bird',
      'Singing Perching Bird',
      'Ndege Anayeimba Mtini',
      'Flying Blue Bird',
      'Ndege Anayeruka Angani',
      'Bird in a Tree Nest',
      'Ndege Kwenye Kiota',
      'sky'
    )
  },
  {
    id: 'cow',
    type: 'concept',
    label: 'Cow',
    swahiliLabel: "Ng'ombe",
    category: 'noun',
    subcategory: 'animal',
    held_out: true, // HELD-OUT FOR TRANSFER TESTING
    attributes: { color: ['Black & White', 'Brown'], shape: 'Large farm animal', texture: 'Short coat', energy: 'Gentle' },
    found_in: ['Farm', 'Grass field', 'Countryside'],
    used_for: ['Giving fresh milk for families to drink'],
    actions: ['Graze grass', 'Moo', 'Chew'],
    beats: {
      what: 'A cow is a gentle, large farm animal.',
      does: 'It eats green grass and makes a calm moo sound.',
      usedFor: 'Cows give us fresh milk that we drink at home.',
      found: 'Cows are found on farms and green grazing fields.',
      what_swa: "Ng'ombe ni mnyama mkubwa na mpole wa shambani.",
      does_swa: 'Hula nyasi za kijani na kutoa sauti ya muu.',
      usedFor_swa: "Ng'ombe hutupa maziwa safi tunayokunywa nyumbani.",
      found_swa: "Ng'ombe hupatikana mashambani na malishoni."
    },
    exemplars: makeExemplars(
      'cow',
      'Spotted Dairy Cow',
      "Ng'ombe wa Maziwa",
      'Cow Grazing Green Grass',
      "Ng'ombe Anakula Nyasi",
      'Resting Farm Cow',
      "Ng'ombe Shambani",
      'emerald'
    )
  },

  // --- OBJECTS (4 Taught + 1 Held-Out) ---
  {
    id: 'cup',
    type: 'concept',
    label: 'Cup',
    swahiliLabel: 'Kikombe',
    category: 'noun',
    subcategory: 'object',
    held_out: false,
    attributes: { color: ['Blue', 'White', 'Yellow'], shape: 'Cylinder with handle', texture: 'Smooth', energy: 'Still object' },
    found_in: ['Kitchen', 'Dining table', 'School dining hall'],
    used_for: ['Holding water, milk, or juice for drinking'],
    actions: ['Hold handle', 'Pour into', 'Sip from', 'Wash'],
    beats: {
      what: 'A cup is a small container with a handle.',
      does: 'It holds water, milk, tea, or juice safely without spilling.',
      usedFor: 'We use a cup to drink whenever we are thirsty.',
      found: 'Cups are found in the kitchen and on dining tables.',
      what_swa: 'Kikombe ni chombo kidogo chenye mkono wa kushikia.',
      does_swa: 'Hushikilia maji, maziwa, au juisi bila kumwagika.',
      usedFor_swa: 'Tunatumia kikombe kunywa tunapohisi kiu.',
      found_swa: 'Vikombe hupatikana jikoni na mezani.'
    },
    exemplars: makeExemplars(
      'cup',
      'Blue Drinking Cup',
      'Kikombe cha Bluu',
      'Two-Handled Child Cup',
      'Kikombe cha Watoto',
      'Ceramic Tea Mug',
      'Kikombe cha Chai Mezani',
      'sky'
    )
  },
  {
    id: 'ball',
    type: 'concept',
    label: 'Ball',
    swahiliLabel: 'Mpira',
    category: 'noun',
    subcategory: 'object',
    held_out: false,
    attributes: { color: ['Red & White', 'Blue', 'Orange'], shape: 'Round sphere', texture: 'Bouncy & Firm' },
    found_in: ['Playground', 'School field', 'Home yard'],
    used_for: ['Playing catch, kicking, and sharing turn-taking games'],
    actions: ['Roll', 'Bounce', 'Throw', 'Catch', 'Kick'],
    beats: {
      what: 'A ball is a round, bouncy play toy.',
      does: 'It rolls on the ground, bounces high, and can be tossed.',
      usedFor: 'We use a ball to play games together with friends.',
      found: 'Balls are found on playgrounds, school fields, and at home.',
      what_swa: 'Mpira ni kifaa cha kuchezea cha duara kinachoruka.',
      does_swa: 'ivingirika chini, kudunda, na kurushwa.',
      usedFor_swa: 'Tunatumia mpira kucheza pamoja na marafiki.',
      found_swa: 'Mipira hupatikana uwanjani shuleni na nyumbani.'
    },
    exemplars: makeExemplars(
      'ball',
      'Soccer Playground Ball',
      'Mpira wa Miguu Uwanjani',
      'Bright Bouncy Rubber Ball',
      'Mpira wa Kudunda',
      'Colorful Beach Play Ball',
      'Mpira wa Rangi Nyingi',
      'blue'
    )
  },
  {
    id: 'book',
    type: 'concept',
    label: 'Book',
    swahiliLabel: 'Kitabu',
    category: 'noun',
    subcategory: 'object',
    held_out: false,
    attributes: { color: ['Colorful cover', 'White pages'], shape: 'Rectangle', texture: 'Paper pages' },
    found_in: ['School classroom', 'Bookshelf', 'School bag', 'Home'],
    used_for: ['Reading stories, looking at pictures, and learning new words'],
    actions: ['Open', 'Turn page', 'Point at picture', 'Read'],
    beats: {
      what: 'A book is a set of pages with pictures and words.',
      does: 'It opens flat so we can turn pages one by one.',
      usedFor: 'We use a book to read stories and learn at school or bedtime.',
      found: 'Books are found in classrooms, libraries, and home shelves.',
      what_swa: 'Kitabu ni kurasa zilizounganishwa zenye picha na maneno.',
      does_swa: 'Hufunguka ili tuweze kufungua kurasa moja baada ya nyingine.',
      usedFor_swa: 'Tunatumia kitabu kusoma hadithi na kujifunza shuleni au nyumbani.',
      found_swa: 'Vitabu hupatikana darasani, maktaba, na nyumbani.'
    },
    exemplars: makeExemplars(
      'book',
      'Open Story Picture Book',
      'Kitabu cha Hadithi na Picha',
      'Classroom Exercise Book',
      'Kitabu cha Darasani',
      'Stack of Colorful Books',
      'Vitabu Kwenye Rafu',
      'purple'
    )
  },
  {
    id: 'spoon',
    type: 'concept',
    label: 'Spoon',
    swahiliLabel: 'Kijiko',
    category: 'noun',
    subcategory: 'object',
    held_out: false,
    attributes: { color: ['Silver', 'Colored plastic'], shape: 'Oval bowl with handle', texture: 'Smooth' },
    found_in: ['Kitchen drawer', 'Dining table', 'Lunchbox'],
    used_for: ['Scooping food like rice, soup, or porridge to eat neatly'],
    actions: ['Hold', 'Scoop', 'Stir', 'Eat with'],
    beats: {
      what: 'A spoon is a smooth eating tool with a small bowl.',
      does: 'It scoops up warm food, porridge, or soup cleanly.',
      usedFor: 'We use a spoon to eat meals at the table.',
      found: 'Spoons are found in the kitchen and beside plates at mealtime.',
      what_swa: 'Kijiko ni kifaa cha kulia chakula chenye mpini.',
      does_swa: 'Huchota chakula kama uji, wali, au supu vizuri.',
      usedFor_swa: 'Tunatumia kijiko kula chakula mezani.',
      found_swa: 'Vijiko hupatikana jikoni na mezani wakati wa chakula.'
    },
    exemplars: makeExemplars(
      'spoon',
      'Metal Dining Spoon',
      'Kijiko cha Mezani',
      'Child Easy-Grip Spoon',
      'Kijiko cha Mtoto',
      'Spoon Next to Bowl',
      'Kijiko Kando ya Bakuli',
      'stone'
    )
  },
  {
    id: 'chair',
    type: 'concept',
    label: 'Chair',
    swahiliLabel: 'Kiti',
    category: 'noun',
    subcategory: 'object',
    held_out: true, // HELD-OUT FOR TRANSFER TESTING
    attributes: { color: ['Brown wood', 'Blue classroom'], shape: 'Seat with backrest and 4 legs', texture: 'Sturdy' },
    found_in: ['School classroom', 'House living room', 'Dining table'],
    used_for: ['Sitting comfortably while learning, reading, or eating'],
    actions: ['Sit down', 'Push in', 'Rest back'],
    beats: {
      what: 'A chair is a sturdy piece of furniture with a seat and back.',
      does: 'It supports our body comfortably when we sit down.',
      usedFor: 'We use a chair to sit at a desk in school or at the table at home.',
      found: 'Chairs are found in classrooms, living rooms, and dining areas.',
      what_swa: 'Kiti ni samani imara yenye sehemu ya kukalia na kuegemea.',
      does_swa: 'Huushikilia mwili wetu vizuri tunapoketi.',
      usedFor_swa: 'Tunatumia kiti kukaa darasani shuleni au mezani nyumbani.',
      found_swa: 'Viti hupatikana darasani, sebuleni, na chumba cha kulia.'
    },
    exemplars: makeExemplars(
      'chair',
      'Wooden Classroom Chair',
      'Kiti cha Mbao Darasani',
      'Home Dining Chair',
      'Kiti cha Mezani Nyumbani',
      'Small Reading Corner Chair',
      'Kiti cha Kona ya Kusomea',
      'stone'
    )
  },

  // --- PLACES & PEOPLE (3 Taught + 1 Held-Out) ---
  {
    id: 'house',
    type: 'concept',
    label: 'House',
    swahiliLabel: 'Nyumba',
    category: 'noun',
    subcategory: 'place',
    held_out: false,
    attributes: { color: ['Warm cream', 'Brick roof'], shape: 'Building with roof, walls, and door', texture: 'Solid' },
    found_in: ['Town', 'Village', 'Neighbourhood'],
    used_for: ['Living safely with family, sleeping, and cooking meals'],
    actions: ['Enter door', 'Rest inside', 'Eat with family'],
    beats: {
      what: 'A house is a safe building with walls, windows, and a roof.',
      does: 'It shelters our family from hot sun, wind, and rain.',
      usedFor: 'We live, cook, eat, and sleep peacefully inside a house.',
      found: 'Houses are found in neighbourhoods, towns, and rural homesteads.',
      what_swa: 'Nyumba ni jengo salama lenye kuta, madirisha, na paa.',
      does_swa: 'Huilinda familia yetu dhidi ya jua kali, upepo, na mvua.',
      usedFor_swa: 'Tunaishi, kupika, kula, na kulala kwa amani ndani ya nyumba.',
      found_swa: 'Nyumba hupatikana mitaani, mijini, na vijijini.'
    },
    exemplars: makeExemplars(
      'house',
      'Family Home with Roof',
      'Nyumba ya Familia',
      'Sunny Homestead House',
      'Nyumba Yenye Ua',
      'Cozy Evening House',
      'Nyumba Wakati wa Jioni',
      'stone'
    )
  },
  {
    id: 'school',
    type: 'concept',
    label: 'School',
    swahiliLabel: 'Shule',
    category: 'noun',
    subcategory: 'place',
    held_out: false,
    attributes: { color: ['Bright walls', 'Green field'], shape: 'Classrooms & playground', texture: 'Structured space' },
    found_in: ['Community', 'Town', 'County'],
    used_for: ['Learning with teachers, reading books, and playing with classmates'],
    actions: ['Learn', 'Read', 'Raise hand', 'Play outside'],
    beats: {
      what: 'A school is a community place with classrooms and a playground.',
      does: 'It brings teachers and children together every weekday.',
      usedFor: 'We go to school to learn, read, draw, and make friends.',
      found: 'Schools are found in every neighbourhood and community.',
      what_swa: 'Shule ni mahali penye madarasa na uwanja wa michezo.',
      does_swa: 'awakutanisha walimu na watoto kila siku za masomo.',
      usedFor_swa: 'Tunaenda shuleni kujifunza, kusoma, kuchora, na kupata marafiki.',
      found_swa: 'Shule hupatikana katika kila mtaa na jamii.'
    },
    exemplars: makeExemplars(
      'school',
      'School Classroom Building',
      'Jengo la Madarasa Shuleni',
      'School Desk & Chalkboard',
      'Dawati na Ubao wa Darasa',
      'School Playground Yard',
      'Uwanja wa Michezo Shuleni',
      'emerald'
    )
  },
  {
    id: 'mother',
    type: 'concept',
    label: 'Mother',
    swahiliLabel: 'Mama',
    category: 'noun',
    subcategory: 'place',
    held_out: false,
    attributes: { expression: 'Warm & Caring', energy: 'Supportive caregiver' },
    found_in: ['House', 'Community', 'Work'],
    used_for: ['Asking for comfort, help, food, and daily guidance'],
    actions: ['Hug', 'Ask for help', 'Listen', 'Walk together'],
    beats: {
      what: 'A mother is a loving parent and caregiver.',
      does: 'She cares for, protects, and guides children every day.',
      usedFor: 'We talk to mother when we need help, comfort, or a snack.',
      found: 'Mother is with family at home and in the community.',
      what_swa: 'Mama ni mzazi na mlezi mwenye upendo.',
      does_swa: 'Huwatunza, kuwalinda, na kuwaongoza watoto kila siku.',
      usedFor_swa: 'Tunamwambia mama tunapohitaji msaada, faraja, au chakula.',
      found_swa: 'Mama hupatikana pamoja na familia nyumbani na katika jamii.'
    },
    exemplars: makeExemplars(
      'mother',
      'Warm Smiling Mother',
      'Mama Mwenye Tabasamu',
      'Mother Helping Child Read',
      'Mama Akimsaidia Mtoto Kusoma',
      'Mother Preparing Meal',
      'Mama Akiandaa Chakula',
      'orange'
    )
  },
  {
    id: 'market',
    type: 'concept',
    label: 'Market',
    swahiliLabel: 'Soko',
    category: 'noun',
    subcategory: 'place',
    held_out: true, // HELD-OUT FOR TRANSFER TESTING
    attributes: { color: ['Colorful stalls'], shape: 'Open stalls and baskets', energy: 'Busy & lively' },
    found_in: ['Town center', 'Neighbourhood'],
    used_for: ['Buying fresh fruits like apples, bananas, and mangoes'],
    actions: ['Carry basket', 'Choose fruit', 'Greet seller'],
    beats: {
      what: 'A market is a community place with stalls of fresh food.',
      does: 'Farmers and sellers arrange fruits and vegetables in baskets.',
      usedFor: 'We visit the market to buy fresh apples, bananas, and mangoes.',
      found: 'Markets are found in town centers and local neighbourhoods.',
      what_swa: 'Soko ni mahali pa jamii penye vibanda vya chakula safi.',
      does_swa: 'Wakulima na wauzaji hupanga matunda na mboga kwenye vikapu.',
      usedFor_swa: 'Tunaenda sokoni kununua tufaha, ndizi, na maembe.',
      found_swa: 'Masoko hupatikana mijini na mitaani.'
    },
    exemplars: makeExemplars(
      'market',
      'Fruit Market Stall',
      'Kibanda cha Matunda Sokoni',
      'Woven Market Baskets',
      'Vikapu vya Sokoni',
      'Fresh Produce Display',
      'Matunda Yaliyopangwa Sokoni',
      'emerald'
    )
  },

  // --- VERBS (2 Taught + 1 Held-Out) ---
  {
    id: 'run',
    type: 'concept',
    label: 'Run',
    swahiliLabel: 'Kimbia',
    category: 'verb',
    subcategory: 'verb',
    held_out: false,
    attributes: { energy: 'Fast & Active', bodyPart: 'Legs, feet, and arms' },
    found_in: ['School field', 'Playground', 'Park'],
    used_for: ['Moving quickly during outdoor games and exercise'],
    actions: ['Step fast', 'Swing arms', 'Breathe deeply'],
    beats: {
      what: 'Run is a fast, active movement using our legs.',
      does: 'Running moves our feet quickly across the ground.',
      usedFor: 'We run when playing ball games and exercising outdoors.',
      found: 'Running happens safely on playgrounds and school fields.',
      what_swa: 'Kukimbia ni kitendo cha kwenda haraka kwa kutumia miguu.',
      does_swa: 'Kukimbia huifanya miguu yetu kupiga hatua za haraka.',
      usedFor_swa: 'Tunakimbia tunapocheza mpira na kufanya mazoezi nje.',
      found_swa: 'Kukimbia hufanyika kwa usalama uwanjani na shuleni.'
    },
    exemplars: makeExemplars(
      'run',
      'Child Running on Field',
      'Mtoto Anakimbia Uwanjani',
      'Running After a Ball',
      'Kukimbia Kuufuata Mpira',
      'Morning Jogging Exercise',
      'Mazoezi ya Kukimbia',
      'emerald'
    )
  },
  {
    id: 'eat',
    type: 'concept',
    label: 'Eat',
    swahiliLabel: 'Kula',
    category: 'verb',
    subcategory: 'verb',
    held_out: false,
    attributes: { energy: 'Calm daily routine', bodyPart: 'Hands, mouth, and teeth' },
    found_in: ['Dining table', 'Kitchen', 'School lunch area'],
    used_for: ['Taking in healthy food like apples, bread, and bananas'],
    actions: ['Pick up spoon', 'Take a bite', 'Chew slowly', 'Swallow'],
    beats: {
      what: 'Eat is the action of chewing and swallowing food.',
      does: 'Eating gives our body strength and stops hunger.',
      usedFor: 'We eat healthy food like apples, bananas, and bread every day.',
      found: 'Eating happens at the dining table at home and at school lunch.',
      what_swa: 'Kula ni kitendo cha kutafuna na kumeza chakula.',
      does_swa: 'Kula huupa mwili wetu nguvu na kuondoa njaa.',
      usedFor_swa: 'Tunakula chakula bora kama tufaha, ndizi, na mkate kila siku.',
      found_swa: 'Kula hufanyika mezani nyumbani na wakati wa chakula shuleni.'
    },
    exemplars: makeExemplars(
      'eat',
      'Eating Healthy Fruit',
      'Kula Tunda Bora',
      'Eating Meal with Spoon',
      'Kula Chakula kwa Kijiko',
      'Family Mealtime at Table',
      'Kula Mezani Nyumbani',
      'amber'
    )
  },
  {
    id: 'sleep',
    type: 'concept',
    label: 'Sleep',
    swahiliLabel: 'Lala',
    category: 'verb',
    subcategory: 'verb',
    held_out: true, // HELD-OUT FOR TRANSFER TESTING
    attributes: { energy: 'Quiet & Restful', bodyPart: 'Eyes closed, whole body resting' },
    found_in: ['Bedroom', 'House at night'],
    used_for: ['Resting our body and brain when we feel tired'],
    actions: ['Lie down', 'Close eyes', 'Breathe softly'],
    beats: {
      what: 'Sleep is a quiet, restful action at night or nap time.',
      does: 'Sleeping closes our eyes and lets our brain and body recharge.',
      usedFor: 'We sleep in a bed inside the house when we feel tired.',
      found: 'Sleeping happens in a quiet bedroom at home.',
      what_swa: 'Kulala ni kitendo cha kupumzika kwa utulivu usiku au mchana.',
      does_swa: 'Kulala hufumba macho yetu na kuupa ubongo na mwili mapumziko.',
      usedFor_swa: 'Tunalala kitandani ndani ya nyumba tunapohisi uchovu.',
      found_swa: 'Kulala hufanyika kwenye chumba tulivu nyumbani.'
    },
    exemplars: makeExemplars(
      'sleep',
      'Peaceful Night Sleep',
      'Kulala kwa Amani Usiku',
      'Resting on Soft Pillow',
      'Kupumzika Kwenye Mto Laini',
      'Quiet Afternoon Nap',
      'Mapumziko ya Mchana',
      'purple'
    )
  },

  // --- EMOTIONS (2 Taught + 1 Held-Out) ---
  {
    id: 'happy',
    type: 'concept',
    label: 'Happy',
    swahiliLabel: 'Furaha',
    category: 'emotion',
    subcategory: 'emotion',
    held_out: false,
    attributes: { expression: 'Warm smile & bright eyes', energy: 'Joyful & comfortable' },
    found_in: ['Playtime', 'Story time', 'Family hugs'],
    used_for: ['Showing others that we enjoy an activity or feel safe'],
    actions: ['Smile', 'Laugh', 'Share joy'],
    beats: {
      what: 'Happy is a warm, joyful feeling inside.',
      does: 'It brings a gentle smile to our face and relaxed breathing.',
      usedFor: 'We show we are happy when we enjoy playing or reading.',
      found: 'Happiness is felt during favorite games, music, and family time.',
      what_swa: 'Furaha ni hisia nzuri na yauchangamfu moyoni.',
      does_swa: 'Huleta tabasamu usoni na utulivu.',
      usedFor_swa: 'Tunaonyesha furaha tunapopenda mchezo au hadithi.',
      found_swa: 'Furaha huonekana wakati wa michezo, muziki, na pamoja na familia.'
    },
    exemplars: makeExemplars(
      'happy',
      'Warm Smiling Face',
      'Uso Wenye Tabasamu la Furaha',
      'Happy Playtime Together',
      'Furaha Wakati wa Kucheza',
      'Celebrating a Good Job',
      'Kusherehekea Kazi Nzuri',
      'amber'
    )
  },
  {
    id: 'calm',
    type: 'concept',
    label: 'Calm',
    swahiliLabel: 'Utulivu',
    category: 'emotion',
    subcategory: 'emotion',
    held_out: false,
    attributes: { expression: 'Relaxed shoulders & slow breathing', energy: 'Peaceful & steady' },
    found_in: ['Quiet corner', 'Home', 'Reading time'],
    used_for: ['Helping our body feel safe and ready to transition or listen'],
    actions: ['Breathe in slowly', 'Breathe out', 'Sit comfortably'],
    beats: {
      what: 'Calm is a peaceful, steady feeling in our body.',
      does: 'It slows our breathing and relaxes our hands and shoulders.',
      usedFor: 'Feeling calm helps us transition smoothly between activities.',
      found: 'Calmness is found in a quiet sensory corner, reading a book, or resting.',
      what_swa: 'Utulivu ni hisia ya amani na kupumzika mwilini.',
      does_swa: 'Hufanya pumzi yetu kwenda taratibu na kupumzisha mabega.',
      usedFor_swa: 'Utulivuutusaidia kubadilisha shughuli bila wasiwasi.',
      found_swa: 'Utulivu hupatikana kwenye kona tulivu, kusoma kitabu, au kupumzika.'
    },
    exemplars: makeExemplars(
      'calm',
      'Slow Deep Breathing',
      'Kupumua Taratibu kwa Utulivu',
      'Quiet Sensory Corner',
      'Kona ya Utulivu wa Hisia',
      'Peaceful Reading Moment',
      'Wakati Tulivu wa Kusoma',
      'emerald'
    )
  },
  {
    id: 'tired',
    type: 'concept',
    label: 'Tired',
    swahiliLabel: 'Uchovu',
    category: 'emotion',
    subcategory: 'emotion',
    held_out: true, // HELD-OUT FOR TRANSFER TESTING
    attributes: { expression: 'Yawning & heavy eyelids', energy: 'Low energy, needing rest' },
    found_in: ['After running', 'Evening at home', 'End of school day'],
    used_for: ['Telling a parent or teacher that we need a break or sleep'],
    actions: ['Yawn', 'Stretch', 'Ask for rest', 'Sleep'],
    beats: {
      what: 'Tired is a body feeling when our energy is low.',
      does: 'It makes us yawn and want to sit down or close our eyes.',
      usedFor: 'When we feel tired, we ask for a quiet break or go to sleep.',
      found: 'Tiredness happens after active play or at bedtime in the house.',
      what_swa: 'Uchovu ni hisia ya mwili wakati nguvu zimepungua.',
      does_swa: 'Hutufanya kupiga miayo na kutaka kuketi au kufumba macho.',
      usedFor_swa: 'Tunapohisi uchovu, tunaomba mapumziko au kwenda kulala.',
      found_swa: 'Uchovu hutokea baada ya michezo mingi au wakati wa kulala nyumbani.'
    },
    exemplars: makeExemplars(
      'tired',
      'Yawning & Needing Rest',
      'Kupiga Miayo na Kuhitaji Mapumziko',
      'Resting After Running',
      'Kupumzika Baada ya Kukimbia',
      'Ready for Bedtime',
      'Tayari Kulala Jioni',
      'purple'
    )
  }
];

// ============================================================================
// TYPED SEMANTIC EDGES (8 Pedagogical Relationship Types)
// ============================================================================
export const CONCEPT_EDGES: ConceptEdge[] = [
  // Category & Contrast Edges (Foods)
  {
    from_id: 'apple',
    to_id: 'banana',
    relation: 'is_a',
    explanation_en: 'Both apple and banana are sweet fruits that we eat as food.',
    explanation_swa: 'Tufaha na ndizi yote ni matunda matamu tunayokula.'
  },
  {
    from_id: 'apple',
    to_id: 'mango',
    relation: 'is_a',
    explanation_en: 'Both apple and mango are healthy fruits grown on trees.',
    explanation_swa: 'Tufaha na embe yote ni matunda yenye afya yanayokua mitini.'
  },
  {
    from_id: 'banana',
    to_id: 'bread',
    relation: 'is_a',
    explanation_en: 'Both banana and bread are nourishing foods eaten at breakfast or snack time.',
    explanation_swa: 'Ndizi na mkate vyote ni vyakula vinavyoliwa wakati wa kifungua kinywa.'
  },
  {
    from_id: 'apple',
    to_id: 'ball',
    relation: 'contrasts_with',
    explanation_en: 'Both are round, but an apple is food we eat whereas a ball is a toy we bounce and kick.',
    explanation_swa: 'Vyote ni vya duara, lakini tufaha ni chakula ilhali mpira ni kifaa cha kuchezea.'
  },
  {
    from_id: 'banana',
    to_id: 'spoon',
    relation: 'contrasts_with',
    explanation_en: 'A banana is food we peel and eat; a spoon is a metal or plastic tool used for scooping.',
    explanation_swa: 'Ndizi ni chakula kinacholiwa; kijiko ni chombo cha kuchotea chakula.'
  },

  // Functional & Environmental Edges
  {
    from_id: 'apple',
    to_id: 'eat',
    relation: 'used_for',
    explanation_en: 'An apple is used for eating when we feel hungry.',
    explanation_swa: 'Tufaha hutumika kwa kula tunapohisi njaa.'
  },
  {
    from_id: 'apple',
    to_id: 'market',
    relation: 'found_in',
    explanation_en: 'Apples are sold and found in baskets at the local market.',
    explanation_swa: 'Tufaha huuzwa na kupatikana kwenye vikapu sokoni.'
  },
  {
    from_id: 'mango',
    to_id: 'market',
    relation: 'found_in',
    explanation_en: 'Fresh mangoes are found in fruit stalls at the market.',
    explanation_swa: 'Maembe safi hupatikana kwenye vibanda vya matunda sokoni.'
  },
  {
    from_id: 'mango',
    to_id: 'eat',
    relation: 'used_for',
    explanation_en: 'A ripe mango is used for eating or blending into juice.',
    explanation_swa: 'Embe mbivu hutumika kwa kula au kutengeneza juisi.'
  },
  {
    from_id: 'milk',
    to_id: 'cup',
    relation: 'used_for',
    explanation_en: 'We pour milk into a cup so we can hold and drink it neatly.',
    explanation_swa: 'Tunamimina maziwa ndani ya kikombe ili tuyanywe vizuri.'
  },
  {
    from_id: 'cow',
    to_id: 'milk',
    relation: 'causes',
    explanation_en: 'A dairy cow produces the fresh milk that families drink.',
    explanation_swa: "Ng'ombe wa maziwa hutupa maziwa safi tunayokunywa."
  },
  {
    from_id: 'cow',
    to_id: 'dog',
    relation: 'is_a',
    explanation_en: 'Both cow and dog are four-legged animals.',
    explanation_swa: "Ng'ombe na mbwa wote ni wanyama wenye miguu minne."
  },
  {
    from_id: 'dog',
    to_id: 'cat',
    relation: 'is_a',
    explanation_en: 'Both dog and cat are friendly domestic animals found around the home.',
    explanation_swa: 'Mbwa na paka wote ni wanyama rafiki wanaofugwa nyumbani.'
  },
  {
    from_id: 'dog',
    to_id: 'house',
    relation: 'found_in',
    explanation_en: 'A family dog lives in and guards the home compound.',
    explanation_swa: 'Mbwa wa familia huishi na kulinda nyumba.'
  },
  {
    from_id: 'bird',
    to_id: 'school',
    relation: 'found_in',
    explanation_en: 'Birds perch and sing in the trees around the school compound.',
    explanation_swa: 'Ndege hutua na kuimba kwenye miti inayozunguka shule.'
  },
  {
    from_id: 'spoon',
    to_id: 'eat',
    relation: 'used_for',
    explanation_en: 'We hold a spoon to scoop food when we eat.',
    explanation_swa: 'Tunatumia kijiko kuchota chakula tunapokula.'
  },
  {
    from_id: 'spoon',
    to_id: 'cup',
    relation: 'associated_with',
    explanation_en: 'A spoon and a cup are both tableware items used during meals.',
    explanation_swa: 'Kijiko na kikombe vyote ni vyombo vya mezani wakati wa chakula.'
  },
  {
    from_id: 'book',
    to_id: 'school',
    relation: 'found_in',
    explanation_en: 'Books are kept on desks and shelves inside the school classroom.',
    explanation_swa: 'Vitabu huwekwa kwenye madawati na rafu darasani shuleni.'
  },
  {
    from_id: 'chair',
    to_id: 'school',
    relation: 'found_in',
    explanation_en: 'Chairs are placed at every student desk inside the school classroom.',
    explanation_swa: 'Viti huwekwa kwenye kila dawati ndani ya darasa shuleni.'
  },
  {
    from_id: 'chair',
    to_id: 'house',
    relation: 'found_in',
    explanation_en: 'Chairs are part of the living room and dining room furniture in a house.',
    explanation_swa: 'Viti ni sehemu ya samani za sebuleni na chumba cha kulia nyumbani.'
  },
  {
    from_id: 'ball',
    to_id: 'run',
    relation: 'used_for',
    explanation_en: 'Playing with a ball encourages us to run and exercise on the field.',
    explanation_swa: 'Kucheza mpira hutuhamasisha kukimbia na kufanya mazoezi uwanjani.'
  },
  {
    from_id: 'run',
    to_id: 'tired',
    relation: 'causes',
    explanation_en: 'Running fast for a long time uses energy and causes our body to feel tired.',
    explanation_swa: 'Kukimbia kwa muda mrefu hutumia nguvu na kuufanya mwili kuhisi uchovu.'
  },
  {
    from_id: 'tired',
    to_id: 'sleep',
    relation: 'precedes',
    explanation_en: 'Feeling tired comes before lying down to sleep and rest.',
    explanation_swa: 'Kuhisi uchovu hutangulia kitendo cha kulala na kupumzika.'
  },
  {
    from_id: 'sleep',
    to_id: 'house',
    relation: 'found_in',
    explanation_en: 'We sleep safely in a bed inside our house.',
    explanation_swa: 'Tunalala salama kitandani ndani ya nyumba yetu.'
  },
  {
    from_id: 'mother',
    to_id: 'house',
    relation: 'found_in',
    explanation_en: 'Mother cares for the family at home.',
    explanation_swa: 'Mama huitunza familia nyumbani.'
  },
  {
    from_id: 'mother',
    to_id: 'calm',
    relation: 'causes',
    explanation_en: 'Asking mother for comfort or a hug helps us feel safe and calm.',
    explanation_swa: 'Kuomba faraja kwa mama hutusaidia kuhisi usalama na utulivu.'
  },
  {
    from_id: 'calm',
    to_id: 'happy',
    relation: 'associated_with',
    explanation_en: 'When our body feels calm and regulated, it is easier to feel happy during play.',
    explanation_swa: 'Mwili wetu unapokuwa tulivu, ni rahisi kufurahia michezo.'
  }
];

export function getConceptById(id: string): ConceptNode | undefined {
  return KNOWLEDGE_CONCEPTS.find(c => c.id === id);
}

export function getConnectedEdges(conceptId: string): Array<{
  edge: ConceptEdge;
  neighbor: ConceptNode;
  direction: 'outgoing' | 'incoming';
}> {
  const results: Array<{ edge: ConceptEdge; neighbor: ConceptNode; direction: 'outgoing' | 'incoming' }> = [];
  for (const edge of CONCEPT_EDGES) {
    if (edge.from_id === conceptId) {
      const neighbor = getConceptById(edge.to_id);
      if (neighbor) results.push({ edge, neighbor, direction: 'outgoing' });
    } else if (edge.to_id === conceptId) {
      const neighbor = getConceptById(edge.from_id);
      if (neighbor) results.push({ edge, neighbor, direction: 'incoming' });
    }
  }
  return results;
}

// ============================================================================
// DETERMINISTIC PATTERN LAB TASK GENERATOR (Zero Generative LLM in Child Mode)
// ============================================================================
export function generatePatternLabSession(
  scenarios: ScenarioNode[],
  adaptiveLevels: Record<PatternTaskType, { choiceLevel: 1 | 2 | 3; scaffoldLevel: 0 | 1 | 2 | 3 }>
): PatternTask[] {
  const taughtConcepts = KNOWLEDGE_CONCEPTS.filter(c => !c.held_out);
  const heldOutConcepts = KNOWLEDGE_CONCEPTS.filter(c => c.held_out);

  const tasks: PatternTask[] = [];

  // 1. PREDICT NEXT BEAT (tests the 4-beat sequence pattern: What -> Does -> Used For)
  const beatConcept = taughtConcepts[0]; // Apple
  const lvlBeat = adaptiveLevels.predict_next_beat || { choiceLevel: 1, scaffoldLevel: 3 };
  const beatOptionsAll: PatternTaskOption[] = [
    {
      id: 'beat-usedFor',
      label_en: `3. Used For: "${beatConcept.beats.usedFor}"`,
      label_swa: `3. Matumizi: "${beatConcept.beats.usedFor_swa}"`,
      conceptId: 'eat',
      hint_en: 'Beat 3 always tells what we use it for!',
      hint_swa: 'Hatua ya 3 hueleza tunatumia kitu hicho kufanya nini!'
    },
    {
      id: 'beat-distractor-1',
      label_en: 'Bark loudly outside in the yard',
      label_swa: 'Kubweka kwa sauti nje uwanjani',
      conceptId: 'dog'
    },
    {
      id: 'beat-distractor-2',
      label_en: 'Kick the soccer ball across the field',
      label_swa: 'Kupiga mpira wa miguu uwanjani',
      conceptId: 'ball'
    },
    {
      id: 'beat-distractor-3',
      label_en: '4. Found In: "Apples are found at the market"',
      label_swa: '4. Mahali: "Tufaha hupatikana sokoni"',
      conceptId: 'house'
    }
  ];
  tasks.push({
    id: 'task-predict-beat-1',
    type: 'predict_next_beat',
    source_relation: 'beat_template',
    target_concept_id: beatConcept.id,
    held_out: false,
    choice_level: lvlBeat.choiceLevel,
    scaffold_level: lvlBeat.scaffoldLevel,
    prompt_en: `Look at Beat 1 and Beat 2 for "${beatConcept.label}". Which beat comes next (Beat 3)?`,
    prompt_swa: `Tazama Hatua ya 1 na Hatua ya 2 ya "${beatConcept.swahiliLabel}". Ni hatua gani inafuata (Hatua ya 3)?`,
    context_beats: {
      beat1_en: `1. What is it? ${beatConcept.beats.what}`,
      beat1_swa: `1. Ni nini? ${beatConcept.beats.what_swa}`,
      beat2_en: `2. What does it do? ${beatConcept.beats.does}`,
      beat2_swa: `2. Inafanya nini? ${beatConcept.beats.does_swa}`
    },
    options: beatOptionsAll.slice(0, lvlBeat.choiceLevel + 1),
    correct_id: 'beat-usedFor',
    explanation_en: 'Every concept follows the same 4-beat pattern: 1. What is it → 2. What does it do → 3. What is it used for → 4. Where is it found.',
    explanation_swa: 'Kila somo linafuata mpangilio wa hatua 4: 1. Ni nini → 2. Inafanya nini → 3. Inatumika kwa nini → 4. Inapatikana wapi.'
  });

  // 2. ODD ONE OUT (uses is_a + contrasts_with)
  const lvlOdd = adaptiveLevels.odd_one_out || { choiceLevel: 2, scaffoldLevel: 3 };
  const oddOptionsAll: PatternTaskOption[] = [
    {
      id: 'ball',
      label_en: 'Ball (Toy)',
      label_swa: 'Mpira (Kifaa cha kuchezea)',
      conceptId: 'ball',
      subcategory: 'object',
      hint_en: 'We bounce a ball, we do not eat it!',
      hint_swa: 'Tunachezea mpira, hatuli mpira!'
    },
    {
      id: 'apple',
      label_en: 'Apple (Food)',
      label_swa: 'Tufaha (Chakula)',
      conceptId: 'apple',
      subcategory: 'food'
    },
    {
      id: 'banana',
      label_en: 'Banana (Food)',
      label_swa: 'Ndizi (Chakula)',
      conceptId: 'banana',
      subcategory: 'food'
    },
    {
      id: 'bread',
      label_en: 'Bread (Food)',
      label_swa: 'Mkate (Chakula)',
      conceptId: 'bread',
      subcategory: 'food'
    }
  ];
  tasks.push({
    id: 'task-odd-one-out-1',
    type: 'odd_one_out',
    source_relation: 'contrasts_with',
    target_concept_id: 'ball',
    held_out: false,
    choice_level: lvlOdd.choiceLevel,
    scaffold_level: lvlOdd.scaffoldLevel,
    prompt_en: 'Which one does NOT belong with the foods we eat?',
    prompt_swa: 'Ni kipi HAKIENDANI na vyakula tunavyokula?',
    options: oddOptionsAll.slice(0, Math.max(3, lvlOdd.choiceLevel + 1)),
    correct_id: 'ball',
    explanation_en: 'Apple, Banana, and Bread are all foods we eat (is_a: food). A Ball contrasts_with food because it is a play object.',
    explanation_swa: 'Tufaha, Ndizi, na Mkate ni vyakula tunavyokula. Mpira ni tofauti kwa sababu ni kifaa cha kuchezea.'
  });

  // 3. SORT INTO A GROUP (uses is_a category classification, including held-out animal)
  const lvlSort = adaptiveLevels.sort_group || { choiceLevel: 1, scaffoldLevel: 3 };
  const sortOptionsAll: PatternTaskOption[] = [
    {
      id: 'group-food',
      label_en: 'Food & Drinks Group (Apples, Bananas, Milk)',
      label_swa: 'Kundi la Chakula (Tufaha, Ndizi, Maziwa)',
      conceptId: 'apple',
      subcategory: 'food',
      hint_en: 'Mango is a sweet fruit we eat!',
      hint_swa: 'Embe ni tunda tamu tunalokula!'
    },
    {
      id: 'group-object',
      label_en: 'Classroom & Home Objects (Ball, Book, Chair)',
      label_swa: 'Kundi la Vifaa (Mpira, Kitabu, Kiti)',
      conceptId: 'book',
      subcategory: 'object'
    },
    {
      id: 'group-animal',
      label_en: 'Animals Group (Dog, Cat, Bird)',
      label_swa: 'Kundi la Wanyama (Mbwa, Paka, Ndege)',
      conceptId: 'dog',
      subcategory: 'animal'
    },
    {
      id: 'group-place',
      label_en: 'Places Group (House, School)',
      label_swa: 'Kundi la Mahali (Nyumba, Shule)',
      conceptId: 'house',
      subcategory: 'place'
    }
  ];
  tasks.push({
    id: 'task-sort-group-mango',
    type: 'sort_group',
    source_relation: 'is_a',
    target_concept_id: 'mango',
    held_out: true,
    choice_level: lvlSort.choiceLevel,
    scaffold_level: lvlSort.scaffoldLevel,
    prompt_en: 'Sort "Mango (Embe)" into the group where it belongs:',
    prompt_swa: 'Weka "Embe (Mango)" katika kundi sahihi:',
    options: sortOptionsAll.slice(0, lvlSort.choiceLevel + 1),
    correct_id: 'group-food',
    explanation_en: 'Even though Mango is a held-out item not shown in passive lessons, it shares the fruit/food pattern with Apple and Banana.',
    explanation_swa: 'Ingawa Embe halikufundishwa kwenye hatua za awali, linafanana na Tufaha na Ndizi katika kundi la chakula.'
  });

  // 4. TRANSFER SLOT TEST #1 (Held-Out Concept: Chair -> Where is it found?)
  const lvlTransfer = adaptiveLevels.transfer_slot || { choiceLevel: 1, scaffoldLevel: 3 };
  const chairConcept = heldOutConcepts.find(c => c.id === 'chair') || heldOutConcepts[0];
  const transferChairOptions: PatternTaskOption[] = [
    {
      id: 'school',
      label_en: 'Inside a School Classroom or House',
      label_swa: 'Ndani ya Darasa Shuleni au Nyumbani',
      conceptId: 'school',
      hint_en: 'We sit on a chair at a desk in school or at the table at home.',
      hint_swa: 'Tunakalia kiti darasani shuleni au mezani nyumbani.'
    },
    {
      id: 'bird',
      label_en: 'Flying high in the sky with feathers',
      label_swa: 'Kinaruka juu angani chenye manyoya',
      conceptId: 'bird'
    },
    {
      id: 'milk',
      label_en: 'Poured inside a drinking cup',
      label_swa: 'Kinamiminwa ndani ya kikombe cha kunywea',
      conceptId: 'cup'
    },
    {
      id: 'banana',
      label_en: 'Growing in bunches on a banana plant',
      label_swa: 'Kinakua kwenye mkungu wa mgomba',
      conceptId: 'banana'
    }
  ];
  tasks.push({
    id: 'task-transfer-chair',
    type: 'transfer_slot',
    source_relation: 'found_in',
    target_concept_id: chairConcept.id,
    held_out: true,
    choice_level: lvlTransfer.choiceLevel,
    scaffold_level: lvlTransfer.scaffoldLevel,
    prompt_en: `Held-Out Transfer Question: You have not practiced "${chairConcept.label}" in the passive beats. Where is a ${chairConcept.label} found?`,
    prompt_swa: `Swali la Uhamisho: Hujasoma "${chairConcept.swahiliLabel}" kwenye hatua za awali. Je, ${chairConcept.swahiliLabel} hupatikana wapi?`,
    options: transferChairOptions.slice(0, lvlTransfer.choiceLevel + 1),
    correct_id: 'school',
    explanation_en: 'Transfer success! You applied the "Where is it found?" (found_in) slot rule to an untaught held-out concept (Chair → School / House).',
    explanation_swa: 'Umefanikiwa kuhamisha ujuzi! Umetumia muundo wa "Inapatikana wapi?" kwa neno jipya (Kiti → Shuleni / Nyumbani).'
  });

  // 5. TRANSFER SLOT TEST #2 (Held-Out Concept: Cow -> What does it give us / used_for?)
  const cowConcept = heldOutConcepts.find(c => c.id === 'cow') || heldOutConcepts[1];
  const transferCowOptions: PatternTaskOption[] = [
    {
      id: 'milk',
      label_en: 'Gives us fresh Milk to drink in a cup',
      label_swa: 'Hutupa Maziwa safi ya kunywa kwenye kikombe',
      conceptId: 'milk',
      hint_en: 'Think about the white drink we pour into a cup!',
      hint_swa: 'Fikiria kinywaji cheupe tunachomimina kwenye kikombe!'
    },
    {
      id: 'book',
      label_en: 'Used to turn paper pages and read stories',
      label_swa: 'Kufungua kurasa za karatasi na kusoma hadithi',
      conceptId: 'book'
    },
    {
      id: 'ball',
      label_en: 'Used to bounce on the playground floor',
      label_swa: 'Kudunda chini kwenye uwanja wa michezo',
      conceptId: 'ball'
    },
    {
      id: 'spoon',
      label_en: 'A small metal tool kept in a kitchen drawer',
      label_swa: 'Chombo kidogo cha chuma kinachowekwa jikoni',
      conceptId: 'spoon'
    }
  ];
  tasks.push({
    id: 'task-transfer-cow',
    type: 'transfer_slot',
    source_relation: 'causes',
    target_concept_id: cowConcept.id,
    held_out: true,
    choice_level: lvlTransfer.choiceLevel,
    scaffold_level: lvlTransfer.scaffoldLevel,
    prompt_en: `Held-Out Transfer Question: What does a "${cowConcept.label} (${cowConcept.swahiliLabel})" provide for our family?`,
    prompt_swa: `Swali la Uhamisho: Je, "${cowConcept.swahiliLabel} (${cowConcept.label})" huipa familia yetu nini?`,
    options: transferCowOptions.slice(0, lvlTransfer.choiceLevel + 1),
    correct_id: 'milk',
    explanation_en: 'Transfer success! You connected the untaught animal (Cow) to Milk using the causes / used_for relationship.',
    explanation_swa: "Umefanikiwa! Umeunganisha mnyama mpya (Ng'ombe) na Maziwa kwa kutumia uhusiano wa chanzo na matumizi."
  });

  // 6. CUE TRANSFER ACROSS SCENARIOS (School <-> Home via related_scenario_ids & precedes)
  const lvlCue = adaptiveLevels.cue_transfer || { choiceLevel: 1, scaffoldLevel: 3 };
  const schoolHelpScenario = scenarios.find(s => s.id === 'sch-ask-help-01') || scenarios[0];
  const cueTransferOptions: PatternTaskOption[] = [
    {
      id: 'polite-request-home',
      label_en: 'Say calmly: "Mother, please help me reach the cup."',
      label_swa: 'Sema kwa utulivu: "Mama, tafadhali nisaidie kufikia kikombe."',
      conceptId: 'mother',
      hint_en: 'Use the same calm polite request words you used at school!',
      hint_swa: 'Tumia maneno yaleyale ya upole uliyotumia shuleni!'
    },
    {
      id: 'shout-home',
      label_en: 'Shout loudly until someone guesses what you want',
      label_swa: 'Piga kelele hadi mtu abahatize unachotaka',
      conceptId: 'tired'
    },
    {
      id: 'walk-away-home',
      label_en: 'Walk away and hide the cup',
      label_swa: 'Ondoka na ufiche kikombe',
      conceptId: 'house'
    },
    {
      id: 'throw-home',
      label_en: 'Throw a spoon across the kitchen',
      label_swa: 'Rusha kijiko jikoni',
      conceptId: 'spoon'
    }
  ];
  tasks.push({
    id: 'task-cue-transfer-1',
    type: 'cue_transfer',
    source_relation: 'precedes',
    target_concept_id: 'mother',
    held_out: true,
    choice_level: lvlCue.choiceLevel,
    scaffold_level: lvlCue.scaffoldLevel,
    prompt_en: `Social Cue Transfer (${schoolHelpScenario.setting.toUpperCase()} → HOME): At school, you said "Please help me with this." Now you are at HOME and cannot reach your cup in the kitchen. What do you say?`,
    prompt_swa: `Uhamisho wa Mawasiliano (SHULENI → NYUMBANI): Shuleni ulisema "Tafadhali nisaidie." Sasa uko NYUMBANI na huwezi kufikia kikombe jikoni. Utasemaje?`,
    options: cueTransferOptions.slice(0, lvlCue.choiceLevel + 1),
    correct_id: 'polite-request-home',
    explanation_en: 'Cue transfer verified! You generalized the polite help-request pattern from a School setting to a Home setting.',
    explanation_swa: 'Uhamisho umethibitishwa! Umetumia muundo wa kuomba msaada kwa upole kutoka Shuleni hadi Nyumbani.'
  });

  return tasks;
}
