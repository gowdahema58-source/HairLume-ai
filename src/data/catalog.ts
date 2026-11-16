import type { HairCategory, ProductItem } from '../types/hairlume';

export const BRAND_LOGO_PATH = '/assets/aistudio/image_47bd03ad.png';
export const HERO_EDITORIAL_IMAGE = '/src/assets/images/hero_hair_editorial_1794812330797.jpg';

const DOVE_SHAMPOO_IMG = '/assets/aistudio/dove_7007b61c.jpeg';
const LOREAL_SHAMPOO_IMG = '/assets/aistudio/loreal_114e7591.jpeg';
const MINIMALIST_SHAMPOO_IMG = '/assets/aistudio/minimalist_b8cdfad1.jpeg';
const SEBAMED_SHAMPOO_IMG = '/assets/aistudio/sebamed_7b9e7979.jpeg';
const TRESEMME_COND_IMG = '/assets/aistudio/tresemme_f05f03ef.jpeg';
const LOREAL_COND_IMG = '/assets/aistudio/loreal-conditioner_d359b055.jpeg';
const DOVE_COND_IMG = '/assets/aistudio/Dove-conditioner_3834d93e.jpeg';
const OGX_COND_IMG = '/assets/aistudio/ogx-conditioner_c032641f.jpeg';
const LOREAL_SERUM_IMG = '/assets/aistudio/loreal-serum_fc676179.jpeg';
const MINIMALIST_SERUM_IMG = '/assets/aistudio/minimalist-serum_4413f7d6.jpeg';
const STREAX_SERUM_IMG = '/assets/aistudio/streax-serum_0bdfbbd4.jpeg';
const INDULEKHA_OIL_IMG = '/assets/aistudio/indulekha-oil_a4042c3c.jpeg';
const PARACHUTE_OIL_IMG = '/assets/aistudio/parachute-oil_ed7e97e9.jpeg';
const MAMAEARTH_OIL_IMG = '/assets/aistudio/mamaearth-oil_5df4c361.jpeg';

export const PRODUCT_CATALOG: ProductItem[] = [
  // SHAMPOOS
  {
    id: 'shampoo-dove-hairfall',
    name: 'Dove Nutritive Solutions Intense Repair Shampoo',
    brand: 'Dove',
    category: 'Shampoo',
    priceInr: 499,
    size: '650 ml',
    image: DOVE_SHAMPOO_IMG,
    description:
      'Nutritive Solutions formula crafted for damaged hair to nourish weak hair fibers and help prevent breakage from coming back.',
    keyActives: ['Nutri-Keratin Repair Actives', 'Glycerin', 'Mild Surfactants'],
    usageInstructions:
      'Apply to wet hair, massage gently into the scalp with fingertips for 60 seconds, then rinse thoroughly with lukewarm water.',
    bestFor: ['Mild visible thinning', 'Hair breakage', 'Dry and damaged hair', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Reduces mechanical breakage and improves strand smoothness during daily washing.',
  },
  {
    id: 'shampoo-loreal-fall-resist',
    name: "L'Oréal Professionnel Paris Liss Unlimited Shampoo",
    brand: "L'Oréal Paris",
    category: 'Shampoo',
    priceInr: 740,
    size: '300 ml',
    image: LOREAL_SHAMPOO_IMG,
    description:
      'Serie Expert ProKeratin smoothing shampoo designed for unruly, frizz-prone hair to reinforce strand structure and cleanse excess oil.',
    keyActives: ['ProKeratin', 'Kukui Nut Oil', 'Evening Primrose Oil'],
    usageInstructions:
      'Use 2 to 3 times weekly on damp scalp. Lather softly at the roots and follow with a lightweight conditioner on mid-lengths.',
    bestFor: ['Mild visible thinning', 'Moderate visible thinning', 'Hair breakage', 'Oily scalp', 'Dry and damaged hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Smooths raised cuticles, controls humidity frizz, and reinforces keratin resilience.',
  },
  {
    id: 'shampoo-minimalist-bond',
    name: 'Minimalist Maleic Bond Repair Complex 3.5% Shampoo',
    brand: 'Minimalist',
    category: 'Shampoo',
    priceInr: 599,
    size: '250 ml',
    image: MINIMALIST_SHAMPOO_IMG,
    description:
      'Sulfate-free, pH-balanced cleanser with 3.5% Maleic Bond Repair Complex, Amino Acids, Vitamin B5, and Ceramides to prevent hair damage.',
    keyActives: ['Maleic Acid 3.5%', 'Amino Acids', 'Vitamin B5 (Panthenol)', 'Ceramide'],
    usageInstructions:
      'Emulsify a coin-sized amount in palms before applying to wet scalp. Leave on for 1 minute before rinsing completely.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Moderate visible thinning', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Supports cuticle smoothness and minimizes post-wash fiber snapping across all hair types.',
  },
  {
    id: 'shampoo-sebamed-anti-hairloss',
    name: 'Sebamed Everyday Shampoo (pH 5.5)',
    brand: 'Sebamed',
    category: 'Shampoo',
    priceInr: 680,
    size: '200 ml',
    image: SEBAMED_SHAMPOO_IMG,
    description:
      'Clinically pH 5.5 tested soap-free extra-mild formula soothing for sensitive scalps while providing moisture and volume.',
    keyActives: ['pH 5.5 Barrier Complex', 'Decyl Glucoside (Sugar Tenside)', 'Conditioning Polymers'],
    usageInstructions:
      'Wet hair, massage gently into the scalp for 1 to 2 minutes, and rinse thoroughly. Mild enough for frequent or daily washing.',
    bestFor: ['Oily scalp', 'Dandruff-like visible flakes', 'Mild visible thinning', 'Moderate visible thinning', 'Severe visible thinning', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Maintains physiological scalp pH 5.5 and gently cleanses sensitive, oily, or flaky scalps.',
  },

  // CONDITIONERS
  {
    id: 'cond-tresemme-defense',
    name: 'TRESemmé Keratin Smooth Conditioner',
    brand: 'Tresemmé',
    category: 'Conditioner',
    priceInr: 360,
    size: '190 ml',
    image: TRESEMME_COND_IMG,
    description:
      'Keratin and Argan Oil professional conditioner offering up to 72-hour frizz control and smoother detangling on fragile strands.',
    keyActives: ['Hydrolyzed Keratin', 'Argan Oil', 'Conditioning Esters'],
    usageInstructions:
      'After shampooing, apply from mid-lengths to ends avoiding the scalp. Leave for 2 to 3 minutes, detangle gently, and rinse.',
    bestFor: ['Hair breakage', 'Mild visible thinning', 'Dry and damaged hair', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Tames frizz and lowers combing friction so strands do not snap during wet detangling.',
  },
  {
    id: 'cond-loreal-total-repair',
    name: "L'Oréal Professionnel Paris Absolut Repair Conditioner",
    brand: "L'Oréal Paris",
    category: 'Conditioner',
    priceInr: 1290,
    size: '500 ml',
    image: LOREAL_COND_IMG,
    description:
      'Serie Expert instant resurfacing conditioner infused with Protein and Gold Quinoa for dry and damaged hair.',
    keyActives: ['Gold Quinoa Bran Extract', 'Wheat Protein', 'Amino Acids'],
    usageInstructions:
      'Smooth evenly onto towel-dried lengths after shampooing. Wait 3 minutes and rinse thoroughly to restore shine and softness.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Moderate visible thinning'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Resurfaces rough, heat- or color-stressed cuticles with lightweight protein care.',
  },
  {
    id: 'cond-dove-intense-repair',
    name: 'Dove Ultra Care Intensive Repair Conditioner',
    brand: 'Dove',
    category: 'Conditioner',
    priceInr: 680,
    size: '750 ml',
    image: DOVE_COND_IMG,
    description:
      'Bio-Restore conditioner for damaged hair that targets and visibly repairs hair surface damage while preventing future breakage.',
    keyActives: ['Bio-Restore Complex', 'Keratin Repair Actives', 'Glycerin'],
    usageInstructions:
      'Concentrate on the lower two-thirds of hair after every wash. Rinse thoroughly so no residue reaches the scalp.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Softens brittle ends and reinforces strand flexibility.',
  },
  {
    id: 'cond-ogx-biotin-collagen',
    name: 'OGX Nourishing + Coconut Milk Conditioner',
    brand: 'OGX',
    category: 'Conditioner',
    priceInr: 795,
    size: '385 ml',
    image: OGX_COND_IMG,
    description:
      'Sulfate-free, paraben-free hydrating blend with Coconut Milk, Coconut Oil, and LipiPro Shield for immediate softness from first use.',
    keyActives: ['Coconut Milk', 'Coconut Oil', 'Hydrolyzed Milk Protein'],
    usageInstructions:
      'Apply generously to damp mid-lengths and ends after shampooing. Wait 3 to 5 minutes, then rinse cleanly.',
    bestFor: ['Dry and damaged hair', 'Mild visible thinning', 'Moderate visible thinning', 'Severe visible thinning', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Hydrates parched strands and leaves hair softer with natural bounce.',
  },

  // HAIR SERUMS
  {
    id: 'serum-loreal-extraordinary',
    name: "L'Oréal Paris Extraordinary Oil Serum",
    brand: "L'Oréal Paris",
    category: 'Hair Serum',
    priceInr: 649,
    size: '100 ml',
    image: LOREAL_SERUM_IMG,
    description:
      'Serum infused with 6 precious floral oils for extraordinary moisture, sumptuous softness, and luxurious shine across all hair types.',
    keyActives: ['Lotus Extract', 'Chamomile Oil', 'Flax, Tiare, Sunflower & Rose Oils'],
    usageInstructions:
      'Warm 1 to 2 pumps in palms and glide over damp or dry mid-lengths and ends. Do not apply directly to an oily scalp.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Shields hair lengths against thermal styling and humidity frizz.',
  },
  {
    id: 'serum-minimalist-actives',
    name: 'Minimalist Hair Density Serum 18%',
    brand: 'Minimalist',
    category: 'Hair Serum',
    priceInr: 799,
    size: '30 ml',
    image: MINIMALIST_SERUM_IMG,
    description:
      'Leave-on water-based scalp serum with 5% Capixyl, 3% Redensyl, and 3% Procapil to help hair look thicker and more voluminous.',
    keyActives: ['Capixyl 5%', 'Redensyl 3%', 'Procapil 3%', 'Anagain & Baicapil'],
    usageInstructions:
      'Use the dropper to apply 1 ml directly onto a clean, dry scalp before bedtime. Massage gently with fingertips and leave overnight.',
    bestFor: ['Mild visible thinning', 'Moderate visible thinning', 'Severe visible thinning', 'Oily scalp'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Peptide and botanical scalp tonic for cosmetic density and fullness support (non-drug).',
  },
  {
    id: 'serum-streax-walnut',
    name: 'Streax Shine Hair Serum with Walnut Oil',
    brand: 'Streax',
    category: 'Hair Serum',
    priceInr: 260,
    size: '100 ml',
    image: STREAX_SERUM_IMG,
    description:
      'Tangle-free, frizz-free smoothing serum enriched with Walnut Oil for glossy, manageable hair shine up to 24 hours.',
    keyActives: ['Walnut Oil', 'Vitamin E', 'Smoothing Emollients'],
    usageInstructions:
      'Apply 2 to 3 drops across damp hair lengths after towel-drying, focusing on tangled ends.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Instantly smooths rough cuticles and prevents brush tugging.',
  },

  // HAIR OILS
  {
    id: 'oil-indulekha-bringha',
    name: 'Indulekha Bringha Hair Oil',
    brand: 'Indulekha',
    category: 'Hair Oil',
    priceInr: 432,
    size: '100 ml',
    image: INDULEKHA_OIL_IMG,
    description:
      'Ayurvedic proprietary herbal infusion centered on Bhringraj, Amla, and Virgin Coconut Oil with a built-in scalp applicator comb.',
    keyActives: ['Bhringraj Extract', 'Amla', 'Brahmi', 'Virgin Coconut Oil'],
    usageInstructions:
      'Part hair and glide the selfie comb across the scalp 2 to 3 times a week. Leave on for 2 to 4 hours before washing with a gentle cleanser.',
    bestFor: ['Mild visible thinning', 'Moderate visible thinning', 'Dry and damaged hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Traditional scalp conditioning massage oil; rinse well if scalp is oily or flaky.',
  },
  {
    id: 'oil-parachute-coconut',
    name: 'Parachute 100% Pure Coconut Oil',
    brand: 'Parachute',
    category: 'Hair Oil',
    priceInr: 255,
    size: '600 ml',
    image: PARACHUTE_OIL_IMG,
    description:
      'Single-ingredient lauric-acid-rich 100% pure coconut oil proven in cosmetic science to penetrate the hair shaft and limit protein loss during washing.',
    keyActives: ['100% Pure Coconut Oil (Lauric Acid)', 'Medium-Chain Triglycerides'],
    usageInstructions:
      'Apply lightly to hair mid-lengths and ends 45 minutes before shampooing as a pre-wash protector. Avoid heavy overnight scalp oiling if prone to dandruff.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Normal-looking hair'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Pre-wash lipid barrier reducing hygral fatigue and protein loss.',
  },
  {
    id: 'oil-mamaearth-onion',
    name: 'Mamaearth Onion Hair Oil',
    brand: 'Mamaearth',
    category: 'Hair Oil',
    priceInr: 549,
    size: '250 ml',
    image: MAMAEARTH_OIL_IMG,
    description:
      'Mineral-oil and silicone-free blend with Onion Oil, Redensyl, and Almond Oil designed for hair fall control and soft nourishment.',
    keyActives: ['Onion Seed Oil', 'Redensyl', 'Sweet Almond Oil', 'Castor Oil'],
    usageInstructions:
      'Use the comb applicator to massage gently into scalp and lengths 1 to 2 hours prior to shampooing twice weekly. Wash out thoroughly.',
    bestFor: ['Dry and damaged hair', 'Hair breakage', 'Mild visible thinning'],
    classification: 'Cosmetic Care',
    cosmeticRole: 'Conditions dry hair shafts and reduces combing friction.',
  },
];

export const CLINICALLY_PROVEN_GUIDANCE = [
  {
    title: 'Topical Minoxidil (2% / 5%)',
    category: 'Clinically Proven OTC / Rx Medication',
    summary:
      'FDA/CDSCO-approved vasodilator clinically demonstrated to prolong the anagen (growth) phase in androgenetic alopecia. Requires consistent medical guidance and months of continuous use.',
  },
  {
    title: 'Ketoconazole 2% Medicated Shampoo',
    category: 'Clinically Proven Antifungal',
    summary:
      'Targets Malassezia yeast overgrowth responsible for persistent seborrheic dermatitis and stubborn dandruff that cosmetic shampoos cannot clear alone.',
  },
  {
    title: 'Prescription Anti-Androgens & Blood Work',
    category: 'Dermatologist-Supervised Care',
    summary:
      'For moderate-to-severe pattern thinning, a dermatologist may evaluate ferritin, vitamin D, thyroid panel (TSH), B12, or prescribe targeted therapies such as oral Finasteride (men) or Spironolactone (women).',
  },
];

export function recommendProductsForCategory(category: HairCategory): ProductItem[] {
  const matched = PRODUCT_CATALOG.filter((p) => p.bestFor.includes(category));
  const categories: Array<'Shampoo' | 'Conditioner' | 'Hair Serum' | 'Hair Oil'> = [
    'Shampoo',
    'Conditioner',
    'Hair Serum',
    'Hair Oil',
  ];
  const selected: ProductItem[] = [];
  for (const cat of categories) {
    const pick = matched.find((p) => p.category === cat) || PRODUCT_CATALOG.find((p) => p.category === cat);
    if (pick) selected.push(pick);
  }
  return selected;
}

export const EDUCATION_CONTENT = {
  causes: [
    {
      title: 'Telogen Effluvium (Stress & Illness Shedding)',
      detail:
        'Physical stress, viral fever, crash dieting, or emotional strain can shift follicles prematurely into the resting phase, causing diffuse shedding 2–3 months later.',
    },
    {
      title: 'Pattern Thinning (Androgenetic Sensitivity)',
      detail:
        'Gradual miniaturization at the temples, crown, or center part driven by genetic sensitivity to DHT. Early clinical evaluation preserves existing density.',
    },
    {
      title: 'Nutritional & Ferritin Deficiencies',
      detail:
        'Low iron stores (ferritin), vitamin D, vitamin B12, zinc, and inadequate daily protein impair keratin synthesis.',
    },
    {
      title: 'Scalp Microbiome & Seborrheic Buildup',
      detail:
        'Excess sebum combined with yeast overgrowth creates flaking and inflammation that weakens hair anchoring if left unwashed.',
    },
    {
      title: 'Mechanical & Thermal Breakage',
      detail:
        'High-heat flat irons, tight hairstyles (traction), bleach/chemical relaxing, and aggressive wet brushing snap hair shafts mid-length.',
    },
  ],
  tipsByGender: {
    women: [
      'Avoid tight high ponytails or heavy extensions that pull on frontal hairline follicles.',
      'Request ferritin, thyroid (TSH), and vitamin D checks if shedding persists beyond 12 weeks.',
      'Apply conditioner and oils from ear-level downward if your scalp gets oily within 48 hours.',
      'Switch to microfiber towel blotting instead of vigorous rubbing after showering.',
    ],
    men: [
      'Track hairline and crown photos under consistent overhead lighting every 4 weeks.',
      'Keep the scalp clean after heavy sweating or gym sessions to minimize follicle-clogging sebum.',
      'Avoid stiff matte waxes close to the roots when hair is wet; rinse styling residue before bed.',
      'Consult a dermatologist early at the first signs of crown thinning for clinically proven options.',
    ],
  },
  foods: [
    { nutrient: 'Complete Protein', sources: 'Eggs, Greek yogurt, paneer, lentils, fish, tofu', role: 'Forms the structural keratin matrix of every hair shaft.' },
    { nutrient: 'Iron & Ferritin', sources: 'Spinach, pumpkin seeds, red kidney beans, lean meats', role: 'Supports oxygen delivery to rapidly dividing follicle cells.' },
    { nutrient: 'Omega-3 Fatty Acids', sources: 'Walnuts, flaxseeds, chia seeds, salmon', role: 'Nourishes scalp lipid barrier and reduces dryness.' },
    { nutrient: 'Zinc & Biotin', sources: 'Almonds, oats, chickpeas, sunflower seeds', role: 'Assists scalp oil regulation and enzyme repair.' },
    { nutrient: 'Vitamin C & D', sources: 'Amla, citrus, bell peppers, fortified dairy, morning sun', role: 'Vitamin C boosts iron absorption; Vitamin D supports follicle cycling.' },
  ],
  myths: [
    {
      myth: 'Washing your hair frequently causes permanent hair loss.',
      fact: 'Shampooing merely releases hairs that have already detached in the telogen phase. Skipping washes lets sebum and flakes inflame the scalp.',
    },
    {
      myth: 'Heavy overnight oiling cures baldness and dandruff.',
      fact: 'Oil protects hair shafts from dryness, but thick oils left on dandruff-prone scalps actually feed Malassezia yeast and worsen flaking.',
    },
    {
      myth: 'Trimming split ends makes hair grow faster from the root.',
      fact: 'Growth happens at the follicle beneath the scalp. Trimming removes frayed ends so strands do not split upward and snap off.',
    },
    {
      myth: 'A single smartphone photo can medically diagnose alopecia.',
      fact: 'Images reveal visible density and surface cues only. True diagnosis requires trichoscopy, medical history, and blood panels.',
    },
  ],
  dermatologistCriteria: [
    'Sudden, patchy circular bald spots on the scalp, eyebrows, or beard.',
    'Shedding noticeably more than 100–150 hairs daily for over 3 consecutive months.',
    'Scalp redness, burning, painful tenderness, oozing, or thick crusty scaling.',
    'Rapidly widening center part or receding hairline before age 25.',
    'Hair fall accompanied by fatigue, unexplained weight shifts, or irregular cycles.',
  ],
};
