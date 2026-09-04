import type { CharacterArchetypeId, DistrictIdentity } from './types';

export type CharacterBibleEntry = {
  id: CharacterArchetypeId;
  name: string;
  domain: DistrictIdentity;
  domainLabel: string;
  form: 'core' | 'specialist';
  portraitSrc: string;
  identity: string;
  silhouette: string;
  wardrobe: string;
  signatureProps: string[];
  palette: string[];
  productionPriority?: 1 | 2 | 3;
};

export const CHARACTER_BIBLE: CharacterBibleEntry[] = [
  {
    id: 'wayfinder',
    name: 'The Wayfinder',
    domain: 'exploration',
    domainLabel: 'Exploration and broad paths',
    form: 'core',
    portraitSrc: './art/characters/wayfinder.png',
    identity:
      'Young woman with warm medium skin, short wavy dark hair, and small braided ornaments.',
    silhouette:
      'Long asymmetric cartographer coat, expedition pack, tapered field trousers, and tall boots.',
    wardrobe:
      'Teal and gold map coat over an ivory shirt with dark field trousers and coral ties.',
    signatureProps: ['Brass compass', 'Map scrolls', 'Survey satchel'],
    palette: ['#0f6670', '#d9b85f', '#efe5cf', '#d56755'],
    productionPriority: 1,
  },
  {
    id: 'city-architect',
    name: 'The City Architect',
    domain: 'career',
    domainLabel: 'Career and projects',
    form: 'core',
    portraitSrc: './art/characters/city-architect.png',
    identity:
      'Young woman with warm olive skin and dark hair gathered into a practical loose bun.',
    silhouette:
      'Tailored long coat, rolled plans, tool bags, straight cream trousers, and riding boots.',
    wardrobe:
      'Deep teal architectural coat with gold piping and amber lining over an ivory work shirt.',
    signatureProps: ['Architectural plans', 'Dividers', 'Document satchels'],
    palette: ['#123f4b', '#d29b38', '#e9dfc9', '#73472f'],
  },
  {
    id: 'guild-forgemaster',
    name: 'The Guild Forgemaster',
    domain: 'career',
    domainLabel: 'Concentrated career craft',
    form: 'specialist',
    portraitSrc: './art/characters/guild-forgemaster.png',
    identity:
      'Older Black man with close gray hair, a full gray beard, and a powerful stocky build.',
    silhouette:
      'Broad work coat, heavy tool belt, rolled plans, reinforced trousers, and substantial boots.',
    wardrobe:
      'Teal guild coat with warm orange lining, ivory shirt, charcoal waistcoat, and workwear leather.',
    signatureProps: ['Brass hammer', 'Measuring tools', 'Forge plans'],
    palette: ['#124d58', '#d78332', '#e8dfcc', '#49382f'],
    productionPriority: 2,
  },
  {
    id: 'archive-sage',
    name: 'The Archive Sage',
    domain: 'learning',
    domainLabel: 'Learning and study',
    form: 'core',
    portraitSrc: './art/characters/archive-sage.png',
    identity:
      'Young scholar with round glasses, a calm expression, and dark hair tied back.',
    silhouette:
      'Layered scholarly coat, compact book satchel, slim trousers, and practical boots.',
    wardrobe:
      'Teal and moss embroidered coat over a cream knit layer with violet and gold details.',
    signatureProps: ['Field book', 'Rolled notes', 'Archive satchel'],
    palette: ['#275f5b', '#78945c', '#d4b765', '#8b75a9'],
  },
  {
    id: 'observatory-scholar',
    name: 'The Observatory Scholar',
    domain: 'learning',
    domainLabel: 'Concentrated research',
    form: 'specialist',
    portraitSrc: './art/characters/observatory-scholar.png',
    identity:
      'Older brown-skinned man with swept white hair, a full white beard, and an observant gaze.',
    silhouette:
      'Long layered scholar robe, broad sleeves, celestial instruments, and grounded leather boots.',
    wardrobe:
      'Teal, violet, and gold observatory robe over layered cream clothing.',
    signatureProps: ['Astrolabe', 'Open codex', 'Spyglass'],
    palette: ['#155864', '#76579b', '#d6b35d', '#efe1c9'],
  },
  {
    id: 'trail-warden',
    name: 'The Trail Warden',
    domain: 'fitness',
    domainLabel: 'Movement and fitness',
    form: 'core',
    portraitSrc: './art/characters/trail-warden.png',
    identity:
      'Athletic bearded man with short brown hair and an alert expedition-ready stance.',
    silhouette:
      'Technical sleeveless long vest, fitted performance layers, trail pack, and agile boots.',
    wardrobe:
      'Teal and coral trail gear over an ivory athletic shirt with charcoal technical trousers.',
    signatureProps: ['Trail pack', 'Water bottle', 'Route compass'],
    palette: ['#1d6870', '#d75e4e', '#eee5d2', '#394348'],
  },
  {
    id: 'circuit-ranger',
    name: 'The Circuit Ranger',
    domain: 'fitness',
    domainLabel: 'Concentrated training',
    form: 'specialist',
    portraitSrc: './art/characters/circuit-ranger.png',
    identity:
      'Young East Asian woman with short dark hair and a compact athletic climber build.',
    silhouette:
      'Cropped technical jacket, rope coil, cargo joggers, gloves, and climbing boots.',
    wardrobe:
      'Teal and coral climbing layers with charcoal utility trousers and weathered leather gear.',
    signatureProps: ['Climbing rope', 'Canteen', 'Circuit compass'],
    palette: ['#157085', '#e06955', '#d8c7a7', '#333e43'],
  },
  {
    id: 'hearth-envoy',
    name: 'The Hearth Envoy',
    domain: 'social',
    domainLabel: 'Relationships and community',
    form: 'core',
    portraitSrc: './art/characters/hearth-envoy.png',
    identity:
      'Young Black man with short curls, a neat beard, and a warm ceremonial presence.',
    silhouette:
      'Flowing formal coat, luminous lantern, message satchel, keepsakes, and polished boots.',
    wardrobe:
      'Teal, cream, violet, and gold ceremonial layers designed for gathering and diplomacy.',
    signatureProps: ['Signal lantern', 'Letters', 'Relationship medallions'],
    palette: ['#175a65', '#8f72b8', '#d5b45a', '#e3d9c8'],
  },
  {
    id: 'festival-herald',
    name: 'The Festival Herald',
    domain: 'social',
    domainLabel: 'Concentrated community',
    form: 'specialist',
    portraitSrc: './art/characters/festival-herald.png',
    identity:
      'South Asian woman with long decorated braids, a bright expression, and confident bearing.',
    silhouette:
      'Wide ceremonial coat, layered flowing trousers, ribboned lantern, invitations, and tall boots.',
    wardrobe:
      'Rich teal and ivory festival robes with violet sashes and dense gold embroidery.',
    signatureProps: [
      'Festival lantern',
      'Sealed invitations',
      'Ceremonial satchel',
    ],
    palette: ['#126073', '#76509a', '#d7ac49', '#efe2c9'],
  },
  {
    id: 'grovekeeper',
    name: 'The Grovekeeper',
    domain: 'recreation',
    domainLabel: 'Rest and recreation',
    form: 'core',
    portraitSrc: './art/characters/grovekeeper.png',
    identity:
      'Young East Asian man with swept dark hair, a relaxed smile, and an outdoorsy build.',
    silhouette:
      'Casual field jacket, flowered hiking pack, camera, rolled blanket, and sturdy boots.',
    wardrobe:
      'Teal leisure jacket over cream knitwear with sand cargo trousers and blue-gold scarf details.',
    signatureProps: ['Camera', 'Thermos', 'Wildflower pack'],
    palette: ['#205f64', '#78a45e', '#d0a85f', '#ded2b9'],
  },
  {
    id: 'dream-gardener',
    name: 'The Dream Gardener',
    domain: 'recreation',
    domainLabel: 'Concentrated restoration',
    form: 'specialist',
    portraitSrc: './art/characters/dream-gardener.png',
    identity:
      'Older East Asian woman with silver hair in a loose bun and a warm, grounded expression.',
    silhouette:
      'Generous botanical coat, layered soft trousers, garden journal, satchel, and rugged boots.',
    wardrobe:
      'Teal and moss embroidered layers over ivory linen with softly weathered leather.',
    signatureProps: ['Botanical journal', 'Pruning shears', 'Seed satchel'],
    palette: ['#20595e', '#748f58', '#c3a45a', '#ddd1bd'],
  },
  {
    id: 'atelier-weaver',
    name: 'The Atelier Weaver',
    domain: 'creative',
    domainLabel: 'Art and creative work',
    form: 'core',
    portraitSrc: './art/characters/atelier-weaver.png',
    identity:
      'Young Black man with short shaped hair, a groomed beard, and an athletic creative presence.',
    silhouette:
      'Modern creative jacket, open sketchbook, camera, headphones, tool satchel, and work boots.',
    wardrobe:
      'Teal studio jacket with coral accents over an ivory shirt and charcoal technical trousers.',
    signatureProps: ['Sketchbook', 'Camera', 'Headphones and art tools'],
    palette: ['#125465', '#dc6047', '#e5d7c1', '#29343d'],
    productionPriority: 3,
  },
];

export const CHARACTER_BIBLE_BY_ID = Object.fromEntries(
  CHARACTER_BIBLE.map((entry) => [entry.id, entry]),
) as Record<CharacterArchetypeId, CharacterBibleEntry>;
