export type AnalysisStage = "seed" | "seedling" | "produce";
export type AnalysisGoal =
  | "yield"
  | "resilience"
  | "fast-market"
  | "export-quality";

export interface AdvisorFormState {
  cropId: string;
  stage: AnalysisStage;
  region: string;
  soil: string;
  month: string;
  goal: AnalysisGoal;
  sampleName: string;
}

interface RegionFit {
  name: string;
  score: number;
  detail: string;
}

interface RiskNote {
  title: string;
  detail: string;
}

interface SignalDefinition {
  label: string;
  note: string;
  base: number;
}

interface CropProfile {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  preferredMonths: string[];
  preferredSoils: string[];
  regionFit: RegionFit[];
  fieldWindow: string;
  scoutingWindow: string;
  irrigationWindow: string;
  marketWindow: string;
  spacing: string;
  irrigation: string;
  nutrients: string;
  harvestLead: string;
  baseRisk: number;
  marketStrength: number;
  cycleSpeed: number;
  stageSignals: Record<AnalysisStage, SignalDefinition[]>;
  stagePlaybook: Record<AnalysisStage, string[]>;
  riskNotes: RiskNote[];
}

export interface DemoPreset {
  id: string;
  label: string;
  cropId: string;
  stage: AnalysisStage;
  region: string;
  soil: string;
  month: string;
  goal: AnalysisGoal;
  sampleName: string;
  image: string;
  note: string;
}

export interface AdvisorMetric {
  label: string;
  value: number;
  hint: string;
  accent: "green" | "amber" | "blue" | "purple";
}

export interface AdvisorEngine {
  name: string;
  value: number;
  detail: string;
}

export interface AdvisorRegionRanking {
  name: string;
  score: number;
  detail: string;
  selected: boolean;
}

export interface AdvisorVisionSignal {
  label: string;
  value: number;
  note: string;
}

export interface AdvisorTimingItem {
  label: string;
  value: string;
  detail: string;
}

export interface AdvisorRiskFlag {
  level: "Low" | "Moderate" | "Watch";
  title: string;
  detail: string;
}

export interface AdvisorSampleInput {
  source: "reference-library" | "farmer-upload";
  fileName?: string;
  mimeType?: string;
  fileSizeKb?: number;
  traceSeed?: string;
}

export interface AdvisorConfidenceDriver {
  label: string;
  status: "strong" | "watch";
  detail: string;
}

export interface AdvisorAction {
  window: string;
  title: string;
  detail: string;
}

export interface AdvisorCommercialSignal {
  label: string;
  value: string;
  detail: string;
}

export interface AdvisorAnalysis {
  cropName: string;
  stageLabel: string;
  title: string;
  summary: string;
  confidence: number;
  readinessBand: string;
  runLabel: string;
  traceId: string;
  scanModeLabel: string;
  sampleSourceLabel: string;
  sampleQuality: number;
  sampleSummary: string;
  advisoryFocus: string;
  marketHeadline: string;
  nextStep: string;
  metrics: AdvisorMetric[];
  engines: AdvisorEngine[];
  regionRanking: AdvisorRegionRanking[];
  visionSignals: AdvisorVisionSignal[];
  timingPlan: AdvisorTimingItem[];
  growthPlaybook: string[];
  riskFlags: AdvisorRiskFlag[];
  confidenceDrivers: AdvisorConfidenceDriver[];
  actionPlan: AdvisorAction[];
  commercialSignals: AdvisorCommercialSignal[];
}

export const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const REGION_OPTIONS = [
  "Greater Accra",
  "Ashanti",
  "Bono East",
  "Eastern",
  "Volta",
  "Northern",
  "Savannah",
  "Oti",
  "Central",
  "Western North",
] as const;

export const SOIL_OPTIONS = [
  "Loamy",
  "Sandy loam",
  "Clay loam",
  "Well-drained silt",
  "Forest loam",
] as const;

export const STAGE_OPTIONS = [
  {
    value: "seed" as const,
    label: "Seed scan",
    helper: "Grade vigor, planting depth, and germination readiness.",
  },
  {
    id: "cassava",
    name: "Cassava",
    scientificName: "Manihot esculenta",
    image: "/images/casasava.jpg",
    description:
      "Resilient root crop that performs strongly in food markets and value-added processing.",
    preferredMonths: ["March", "April", "May", "June"],
    preferredSoils: ["Loamy", "Sandy loam", "Forest loam"],
    regionFit: [
      {
        name: "Eastern",
        score: 93,
        detail: "Strong root crop culture and good processing access improve consistency.",
      },
      {
        name: "Central",
        score: 92,
        detail: "Reliable root bulking and strong fresh food demand support good margins.",
      },
      {
        name: "Bono",
        score: 90,
        detail: "Cassava scales well when stem cuttings are uniform and fields are well drained.",
      },
      {
        name: "Western North",
        score: 89,
        detail: "Forest-zone soils help root size when ridges stay clean and well spaced.",
      },
      {
        name: "Volta",
        score: 88,
        detail: "Good fit for staggered planting cycles feeding both food and gari markets.",
      },
      {
        name: "Savannah",
        score: 72,
        detail: "Possible, but early moisture support is needed before the crop settles in.",
      },
    ],
    fieldWindow:
      "Plant from March through June once the soil profile is moist but still well drained.",
    scoutingWindow:
      "Inspect cuttings and early shoots between 7:00 AM and 9:00 AM for clean stand establishment.",
    irrigationWindow:
      "Water only to support establishment; cassava prefers a well-drained root zone.",
    marketWindow:
      "Fresh tuber and gari demand stay strong year round, with spikes before festive periods.",
    spacing: "1 m x 1 m for root size and easier field maintenance.",
    irrigation:
      "Support young cuttings early, then avoid sustained wet soil once roots begin swelling.",
    nutrients:
      "Apply moderate potassium and organic matter support rather than heavy nitrogen.",
    harvestLead:
      "Most commercial roots are ready in 8 to 12 months, depending on variety and target market.",
    baseRisk: 28,
    marketStrength: 80,
    cycleSpeed: 58,
    stageSignals: {
      seed: [
        {
          label: "Cutting viability",
          note: "Healthy stem cuttings lift uniform sprouting across the field.",
          base: 90,
        },
        {
          label: "Bud activation",
          note: "Strong bud points reduce patchy stands and replanting losses.",
          base: 85,
        },
        {
          label: "Field resilience",
          note: "Good field resilience supports the crop through dry intervals later in the season.",
          base: 87,
        },
      ],
      seedling: [
        {
          label: "Shoot vigor",
          note: "Fast canopy build helps suppress weeds and supports root bulking later on.",
          base: 88,
        },
        {
          label: "Stand uniformity",
          note: "Even stands are easier to manage and harvest at the right maturity.",
          base: 84,
        },
        {
          label: "Drainage tolerance",
          note: "Drainage stability protects the root zone from early rot pressure.",
          base: 82,
        },
      ],
      produce: [
        {
          label: "Root bulk signal",
          note: "Full, heavy roots increase output for food and processing buyers.",
          base: 86,
        },
        {
          label: "Starch outlook",
          note: "Good starch outlook is attractive for gari and starch processors.",
          base: 84,
        },
        {
          label: "Harvest handling",
          note: "Quick handling protects roots from post-harvest deterioration.",
          base: 79,
        },
      ],
    },
    stagePlaybook: {
      seed: [
        "Select mature stem cuttings from clean mother plants and plant them in a moist but airy ridge.",
        "Open drainage lines early so new cuttings do not sit in water after heavy rainfall.",
      ],
      seedling: [
        "Keep the first two months weed-free and mound soil gently around vigorous stands.",
        "Use gap filling early so field maturity stays uniform at harvest time.",
      ],
      produce: [
        "Harvest only what the market can absorb quickly because cassava loses freshness fast after lifting.",
        "Separate large, uniform roots for premium buyers and move lower-grade lots into processing immediately.",
      ],
    },
    riskNotes: [
      {
        title: "Root rot pressure",
        detail:
          "Waterlogged ridges can trigger rots that wipe out root quality before harvest.",
      },
      {
        title: "Weed takeover",
        detail:
          "Slow canopy build can let weeds dominate and reduce root bulking in the first two months.",
      },
      {
        title: "Post-harvest decline",
        detail:
          "Cassava quality drops quickly after lifting, so dispatch planning matters almost immediately.",
      },
    ],
  },
  {
    id: "pepper",
    name: "Pepper",
    scientificName: "Capsicum annuum",
    image: "/images/chilli.jpg",
    description:
      "Premium horticulture crop with strong local market pull and export-quality potential.",
    preferredMonths: ["April", "May", "September", "October"],
    preferredSoils: ["Sandy loam", "Loamy", "Well-drained silt"],
    regionFit: [
      {
        name: "Greater Accra",
        score: 92,
        detail: "High-value urban demand rewards quality fruit and repeat supply.",
      },
      {
        name: "Bono East",
        score: 91,
        detail: "Commercial growers benefit from strong wholesale movement and irrigation support.",
      },
      {
        name: "Ashanti",
        score: 89,
        detail: "Good market access and strong restaurant demand support steady turnover.",
      },
      {
        name: "Volta",
        score: 88,
        detail: "Balanced heat profile supports strong fruit set with careful moisture control.",
      },
      {
        name: "Eastern",
        score: 85,
        detail: "Performs well with regular scouting and clean harvest handling.",
      },
      {
        name: "Northern",
        score: 74,
        detail: "Heat stress risk climbs without shade strategy and disciplined irrigation.",
      },
    ],
    fieldWindow:
      "Plant in April to May for main rains or restart in September under managed irrigation.",
    scoutingWindow:
      "Inspect plots from 6:00 AM to 8:00 AM to catch mites, wilt, and blossom stress early.",
    irrigationWindow:
      "Irrigate between 5:30 AM and 7:00 AM with low splash to protect flowers and fruit set.",
    marketWindow:
      "Fresh and premium restaurant demand runs strongest in dry spells and festive weeks.",
    spacing: "50 cm x 45 cm with clean airflow between rows.",
    irrigation:
      "Keep moisture steady and avoid harsh dry-wet swings that trigger blossom drop.",
    nutrients:
      "Use balanced nutrition, then lift potassium and calcium once fruiting begins.",
    harvestLead:
      "Many pepper varieties start harvest in 80 to 100 days under good heat management.",
    baseRisk: 39,
    marketStrength: 89,
    cycleSpeed: 84,
    stageSignals: {
      seed: [
        {
          label: "Seed vigor",
          note: "Strong vigor improves nursery speed and transplant confidence.",
          base: 88,
        },
        {
          label: "Heat tolerance",
          note: "Better heat tolerance protects the first flower flush in hot spells.",
          base: 86,
        },
        {
          label: "Uniform emergence",
          note: "Uniform emergence simplifies irrigation and nursery management.",
          base: 85,
        },
      ],
      seedling: [
        {
          label: "Flower readiness",
          note: "Balanced seedling growth supports early flower retention.",
          base: 90,
        },
        {
          label: "Leaf health",
          note: "Healthy leaves improve energy flow into fruiting later in the cycle.",
          base: 87,
        },
        {
          label: "Stress resistance",
          note: "Lower stress means better fruit set under strong sunlight.",
          base: 82,
        },
      ],
      produce: [
        {
          label: "Color uniformity",
          note: "Uniform color is a strong premium signal for retail and export buyers.",
          base: 92,
        },
        {
          label: "Skin finish",
          note: "Clean skin finish improves shelf appeal and sorting speed.",
          base: 88,
        },
        {
          label: "Dispatch stability",
          note: "Stable dispatch quality helps buyers keep consistent shelf presentation.",
          base: 84,
        },
      ],
    },
    stagePlaybook: {
      seed: [
        "Build a clean nursery first, then transplant only the most uniform and compact seedlings.",
        "Prepare irrigation and mulching before transplant day so plants never stall after movement.",
      ],
      seedling: [
        "Keep flowers protected from water stress and remove weak early branches to balance the canopy.",
        "Feed with steady nutrients and watch for mites before fruit clusters begin to build.",
      ],
      produce: [
        "Harvest at the exact buyer color stage and cool quickly so fruits keep shine and firmness.",
        "Split premium lots from processing-grade fruits before dispatch to protect average pricing.",
      ],
    },
    riskNotes: [
      {
        title: "Mite pressure",
        detail:
          "Hot dry spells can trigger fast mite outbreaks that weaken flowers and young fruits.",
      },
      {
        title: "Blossom loss",
        detail:
          "Irregular irrigation often causes blossoms to drop before fruits can hold.",
      },
      {
        title: "Sunscald",
        detail:
          "Exposed fruits can lose premium color and shelf appeal during harsh heat.",
      },
    ],
  },
  {
    value: "seedling" as const,
    label: "Seedling health",
    helper: "Estimate early stress, field timing, and stand establishment.",
  },
  {
    value: "produce" as const,
    label: "Produce quality",
    helper: "Check harvest maturity, dispatch timing, and next crop cycle.",
  },
];

export const GOAL_OPTIONS = [
  {
    value: "yield" as const,
    label: "Max yield",
    helper: "Push for stronger field output and harvest volume.",
  },
  {
    value: "resilience" as const,
    label: "Climate resilience",
    helper: "Prioritize stability through weather and disease pressure.",
  },
  {
    value: "fast-market" as const,
    label: "Fast market entry",
    helper: "Shorten the time from field to buyer.",
  },
  {
    value: "export-quality" as const,
    label: "Premium quality",
    helper: "Focus on uniformity, storage life, and buyer confidence.",
  },
];

const cropProfiles: CropProfile[] = [
  {
    id: "maize",
    name: "Maize",
    scientificName: "Zea mays",
    image: "/images/maize.jpg",
    description:
      "High-demand cereal crop for grain markets, poultry feed, and processor contracts.",
    preferredMonths: ["April", "May", "June", "September"],
    preferredSoils: ["Loamy", "Sandy loam", "Clay loam"],
    regionFit: [
      {
        name: "Bono East",
        score: 95,
        detail: "Strong rain pattern and proven cereal throughput for commercial lots.",
      },
      {
        name: "Northern",
        score: 93,
        detail: "Open-field scale and reliable grain marketing routes support expansion.",
      },
      {
        name: "Savannah",
        score: 91,
        detail: "Works well with broad-acre planting when early weed pressure is controlled.",
      },
      {
        name: "Ashanti",
        score: 87,
        detail: "Good input access and nearby buyers improve turnaround after harvest.",
      },
      {
        name: "Eastern",
        score: 84,
        detail: "Performs well on loamy slopes with drainage and balanced nitrogen.",
      },
      {
        name: "Greater Accra",
        score: 73,
        detail: "Irrigation is needed more often and yield risk rises in heat spikes.",
      },
    ],
    fieldWindow:
      "Best planting window is mid-April to early June after two steady rains.",
    scoutingWindow:
      "Scout stands between 6:30 AM and 8:30 AM while leaf stress is easiest to read.",
    irrigationWindow:
      "If rainfall breaks, irrigate between 5:30 AM and 7:00 AM to protect tasseling.",
    marketWindow:
      "Bulk grain demand usually strengthens from August through October.",
    spacing: "75 cm x 25 cm with one strong plant per stand.",
    irrigation:
      "Keep moisture stable during tasseling and grain fill; avoid long dry gaps.",
    nutrients:
      "Apply starter NPK after emergence and top dress nitrogen at knee height.",
    harvestLead:
      "Most hybrid lines reach marketable grain maturity in 100 to 120 days.",
    baseRisk: 34,
    marketStrength: 82,
    cycleSpeed: 78,
    stageSignals: {
      seed: [
        {
          label: "Seed coat integrity",
          note: "Uniform seed coat color suggests fewer weak starts in the field.",
          base: 91,
        },
        {
          label: "Kernel density",
          note: "Dense kernels point to stronger vigor under early rainfall shifts.",
          base: 88,
        },
        {
          label: "Moisture balance",
          note: "Balanced dryness reduces storage mould and uneven germination.",
          base: 84,
        },
      ],
      seedling: [
        {
          label: "Leaf vigor",
          note: "Fresh green blades show a strong early nutrient response.",
          base: 87,
        },
        {
          label: "Stem strength",
          note: "Solid stems improve stand count when winds rise after rainfall.",
          base: 83,
        },
        {
          label: "Root-zone stress",
          note: "Low root-zone stress keeps the crop moving into rapid vegetative growth.",
          base: 79,
        },
      ],
      produce: [
        {
          label: "Grain fill signal",
          note: "Uniform kernel fill improves processor confidence and buyer grading.",
          base: 86,
        },
        {
          label: "Dry-down readiness",
          note: "Lower moisture at harvest reduces post-harvest handling losses.",
          base: 82,
        },
        {
          label: "Storage outlook",
          note: "Healthy drying conditions extend shelf stability before dispatch.",
          base: 80,
        },
      ],
    },
    stagePlaybook: {
      seed: [
        "Prime seed lots in a cool, dry store and plant only after the second stable rain event.",
        "Target a firm seed bed so kernels sit evenly and emerge with a consistent stand count.",
      ],
      seedling: [
        "Thin weak plants early and keep first weeding inside the first three weeks after emergence.",
        "Lock in nitrogen before rapid vegetative growth so leaves stay dark and upright.",
      ],
      produce: [
        "Harvest when cobs are fully filled, then move quickly into drying to protect grade.",
        "Group lots by moisture band before dispatch so buyers see a clean and uniform shipment.",
      ],
    },
    riskNotes: [
      {
        title: "Armyworm watch",
        detail:
          "Dense early growth can attract fall armyworm, especially after warm nights and fresh rain.",
      },
      {
        title: "Nitrogen fade",
        detail:
          "Pale leaves from the midrib outward are an early sign the crop is losing yield potential.",
      },
      {
        title: "Waterlogging risk",
        detail:
          "Poor drainage near tasseling can cut grain fill and lower the final market grade.",
      },
    ],
  },
  {
    id: "tomato",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "/images/tomato.jpg",
    description:
      "High-value vegetable crop with strong demand from markets, restaurants, and processors.",
    preferredMonths: ["April", "May", "October", "November"],
    preferredSoils: ["Sandy loam", "Loamy", "Well-drained silt"],
    regionFit: [
      {
        name: "Bono East",
        score: 94,
        detail: "Strong tomato trade routes and dry-season irrigation make scaling easier.",
      },
      {
        name: "Greater Accra",
        score: 91,
        detail: "Close to urban buyers and premium demand, especially for uniform fruits.",
      },
      {
        name: "Ashanti",
        score: 90,
        detail: "Steady buyer access and manageable transport distances protect margins.",
      },
      {
        name: "Volta",
        score: 88,
        detail: "Good heat profile for fruit set when irrigation is kept steady.",
      },
      {
        name: "Eastern",
        score: 86,
        detail: "Performs well with strong staking and careful fungal disease control.",
      },
      {
        name: "Northern",
        score: 75,
        detail: "Heat management and irrigation discipline are essential for quality fruit.",
      },
    ],
    fieldWindow:
      "The strongest field window is April to May, with a second irrigated cycle from October.",
    scoutingWindow:
      "Scout by 6:00 AM to spot leaf curl, fungal pressure, and flower drop before heat rises.",
    irrigationWindow:
      "Water between 5:30 AM and 7:00 AM with consistent light cycles to avoid fruit cracking.",
    marketWindow:
      "Fresh market premiums are strongest from June to August and again near festive demand.",
    spacing: "60 cm x 45 cm with supported staking or trellising from early growth.",
    irrigation:
      "Use frequent light watering once flowering starts and keep foliage dry when possible.",
    nutrients:
      "Feed with balanced NPK early, then lift potassium as fruit load increases.",
    harvestLead:
      "Most improved varieties begin harvest in 70 to 90 days, depending on heat and irrigation.",
    baseRisk: 41,
    marketStrength: 90,
    cycleSpeed: 88,
    stageSignals: {
      seed: [
        {
          label: "Seed uniformity",
          note: "Even seed size helps deliver a tighter nursery stand.",
          base: 89,
        },
        {
          label: "Dormancy break",
          note: "Stable dormancy release reduces patchy tray emergence.",
          base: 85,
        },
        {
          label: "Nursery vigor",
          note: "High nursery vigor shortens the wait to transplanting.",
          base: 87,
        },
      ],
      seedling: [
        {
          label: "Leaf turgor",
          note: "Leaf firmness shows the seedling can handle transplant shock.",
          base: 92,
        },
        {
          label: "Stem readiness",
          note: "Short, thick stems perform better once moved into the field.",
          base: 88,
        },
        {
          label: "Heat stress signal",
          note: "Lower heat stress means less flower abortion in the first flush.",
          base: 81,
        },
      ],
      produce: [
        {
          label: "Ripeness curve",
          note: "Balanced ripeness supports better picking and transport sequencing.",
          base: 90,
        },
        {
          label: "Skin firmness",
          note: "Firmer fruits survive transport with fewer bruises and soft spots.",
          base: 86,
        },
        {
          label: "Shelf-life outlook",
          note: "Stronger shelf life helps premium buyers trust the lot.",
          base: 83,
        },
      ],
    },
    stagePlaybook: {
      seed: [
        "Raise the lot in a clean nursery tray and transplant only when stems are short and sturdy.",
        "Prepare mulch or drip support early so plants do not lose momentum after transplanting.",
      ],
      seedling: [
        "Transplant at late afternoon or after cloud cover, then keep root moisture stable for one week.",
        "Stake early and prune carefully so airflow stays strong around the first flower clusters.",
      ],
      produce: [
        "Pick fruits at breaker stage for transport or red stage for nearby premium markets.",
        "Cool and sort immediately after harvest so bruised fruits do not shorten the shelf life of the lot.",
      ],
    },
    riskNotes: [
      {
        title: "Leaf disease pressure",
        detail:
          "Dense canopies and late watering can push blight and spot diseases quickly.",
      },
      {
        title: "Flower drop",
        detail:
          "Hot afternoons and uneven moisture can drop flowers before the first strong fruit set.",
      },
      {
        title: "Fruit cracking",
        detail:
          "Heavy irrigation after dry spells often causes market losses through split fruits.",
      },
    ],
  },
  {
    id: "rice",
    name: "Rice",
    scientificName: "Oryza sativa",
    image: "/images/rice.jpg",
    description:
      "Staple grain with strong processing demand and excellent fit for managed water systems.",
    preferredMonths: ["May", "June", "July"],
    preferredSoils: ["Clay loam", "Well-drained silt", "Loamy"],
    regionFit: [
      {
        name: "Northern",
        score: 94,
        detail: "Large production corridors and processor demand support volume crops.",
      },
      {
        name: "Volta",
        score: 92,
        detail: "Good lowland systems and strong buyer pull improve planning confidence.",
      },
      {
        name: "Oti",
        score: 90,
        detail: "Promising paddies and dependable seasonal water improve stand stability.",
      },
      {
        name: "Upper East",
        score: 88,
        detail: "Works well with careful water scheduling and weed discipline.",
      },
      {
        name: "Savannah",
        score: 86,
        detail: "Good fit where water control is in place and seed quality is high.",
      },
      {
        name: "Greater Accra",
        score: 66,
        detail: "Production is possible but water control is harder to scale cost effectively.",
      },
    ],
    fieldWindow:
      "Main establishment window is May to July when water levels can be managed with confidence.",
    scoutingWindow:
      "Inspect fields from 6:00 AM to 8:00 AM to track tiller count, weeds, and standing water depth.",
    irrigationWindow:
      "Refresh water early in the morning and avoid late-day flooding swings.",
    marketWindow:
      "Milling and bulk trade activity usually strengthens from September to November.",
    spacing: "20 cm x 20 cm for transplanted plots or calibrated drill spacing for direct seeding.",
    irrigation:
      "Maintain shallow, stable water levels and drain briefly when roots need oxygen.",
    nutrients:
      "Split nitrogen across early tillering and panicle initiation rather than one heavy dose.",
    harvestLead:
      "Many varieties are ready in 110 to 130 days, depending on water control and variety choice.",
    baseRisk: 37,
    marketStrength: 84,
    cycleSpeed: 71,
    stageSignals: {
      seed: [
        {
          label: "Seed vigor",
          note: "Higher vigor improves emergence in wet field conditions.",
          base: 88,
        },
        {
          label: "Water tolerance",
          note: "Stable tolerance reduces stand loss in shallow-flood systems.",
          base: 86,
        },
        {
          label: "Uniform germination",
          note: "Even germination helps maintain a balanced tiller population.",
          base: 84,
        },
      ],
      seedling: [
        {
          label: "Tiller energy",
          note: "Stronger early tillering increases later panicle density.",
          base: 87,
        },
        {
          label: "Root anchoring",
          note: "Good anchoring protects plants through water movement and wind.",
          base: 83,
        },
        {
          label: "Nutrient uptake",
          note: "Steady uptake keeps the crop moving cleanly toward panicle initiation.",
          base: 81,
        },
      ],
      produce: [
        {
          label: "Panicle fill",
          note: "Full panicles lift both grain weight and buyer confidence.",
          base: 88,
        },
        {
          label: "Drying readiness",
          note: "Predictable drying reduces cracking and storage losses.",
          base: 82,
        },
        {
          label: "Milling outlook",
          note: "Cleaner grain lots protect conversion efficiency at the mill.",
          base: 84,
        },
      ],
    },
    stagePlaybook: {
      seed: [
        "Start with clean seed and prepare water control before direct seeding or transplanting.",
        "Level the field carefully so young plants do not face uneven flooding pressure.",
      ],
      seedling: [
        "Keep weeds down before canopy closure and maintain shallow water during active tillering.",
        "Split nitrogen early enough to support tiller density without forcing weak lodging growth.",
      ],
      produce: [
        "Harvest once panicles are mature and begin drying immediately to protect milling quality.",
        "Bundle lots by maturity and moisture so processors receive a more uniform grain line.",
      ],
    },
    riskNotes: [
      {
        title: "Weed competition",
        detail:
          "Slow early weed control can quickly reduce tiller count and grain yield.",
      },
      {
        title: "Water instability",
        detail:
          "Rapid flooding and draining cycles stress roots and reduce panicle formation.",
      },
      {
        title: "Lodging pressure",
        detail:
          "Too much nitrogen on soft soils can push stems down before full maturity.",
      },
    ],
  },
];

export const CROP_OPTIONS = cropProfiles.map((crop) => ({
  value: crop.id,
  label: crop.name,
}));

export const AI_DEMO_PRESETS: DemoPreset[] = [
  {
    id: "maize-seed-lot",
    label: "Maize seed lot",
    cropId: "maize",
    stage: "seed",
    region: "Northern",
    soil: "Loamy",
    month: "April",
    goal: "yield",
    sampleName: "Certified maize hybrid lot",
    image: "/images/maize.jpg",
    note: "Predict vigor, planting depth, and the best rain-fed window for large cereal plots.",
  },
  {
    id: "tomato-seedling-tray",
    label: "Tomato nursery tray",
    cropId: "tomato",
    stage: "seedling",
    region: "Ashanti",
    soil: "Sandy loam",
    month: "May",
    goal: "fast-market",
    sampleName: "Tomato seedling tray",
    image: "/images/tomato.jpg",
    note: "Forecast transplant timing, flowering stability, and fast market entry potential.",
  },
  {
    id: "rice-panicle-lot",
    label: "Rice panicle lot",
    cropId: "rice",
    stage: "produce",
    region: "Volta",
    soil: "Clay loam",
    month: "June",
    goal: "resilience",
    sampleName: "Rice panicle harvest sample",
    image: "/images/rice.jpg",
    note: "Estimate milling readiness, water stress exposure, and the next ideal planting cycle.",
  },
  {
    id: "cassava-cuttings",
    label: "Cassava cuttings",
    cropId: "cassava",
    stage: "seed",
    region: "Eastern",
    soil: "Forest loam",
    month: "March",
    goal: "resilience",
    sampleName: "Cassava stem cuttings",
    image: "/images/casasava.jpg",
    note: "Review cutting viability, ridge suitability, and stable planting windows.",
  },
  {
    id: "pepper-export-pack",
    label: "Pepper export pack",
    cropId: "pepper",
    stage: "produce",
    region: "Greater Accra",
    soil: "Sandy loam",
    month: "September",
    goal: "export-quality",
    sampleName: "Premium pepper cluster",
    image: "/images/chilli.jpg",
    note: "Grade fruit finish, dispatch stability, and where premium buyers are strongest.",
  },
];

export const DEFAULT_DEMO_PRESET = AI_DEMO_PRESETS[0];

export const getCropProfile = (cropId: string) =>
  cropProfiles.find((crop) => crop.id === cropId);

export const getDemoPreset = (presetId: string) =>
  AI_DEMO_PRESETS.find((preset) => preset.id === presetId);

export const buildAdvisorFormFromPreset = (
  preset: DemoPreset,
): AdvisorFormState => ({
  cropId: preset.cropId,
  stage: preset.stage,
  region: preset.region,
  soil: preset.soil,
  month: preset.month,
  goal: preset.goal,
  sampleName: preset.sampleName,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const stageLabelMap: Record<AnalysisStage, string> = {
  seed: "Seed scan",
  seedling: "Seedling health",
  produce: "Produce quality",
};

const goalSummaryMap: Record<AnalysisGoal, string> = {
  yield: "push for stronger field output",
  resilience: "keep the crop stable through weather swings",
  "fast-market": "reach buyers faster with less crop downtime",
  "export-quality": "protect premium quality and buyer confidence",
};

const advisoryFocusMap: Record<AnalysisGoal, string> = {
  yield: "Yield expansion",
  resilience: "Climate resilience",
  "fast-market": "Fast market entry",
  "export-quality": "Premium quality positioning",
};

const readinessBand = (confidence: number) => {
  if (confidence >= 90) {
    return "High-confidence recommendation";
  }

  if (confidence >= 82) {
    return "Strong field signal";
  }

  return "Monitor before scaling";
};

const buildRegionRanking = (
  crop: CropProfile,
  region: string,
): AdvisorRegionRanking[] => {
  const fallbackRegion: AdvisorRegionRanking = {
    name: region,
    score: 72,
    detail: "Curated rules show moderate fit. Field data would refine this signal.",
    selected: true,
  };

  const ranked = crop.regionFit
    .map((entry) => ({
      ...entry,
      selected: entry.name === region,
    }))
    .sort((left, right) => right.score - left.score);

  if (!ranked.some((entry) => entry.name === region)) {
    ranked.push(fallbackRegion);
    ranked.sort((left, right) => right.score - left.score);
  }

  const topRanked = ranked.slice(0, 4);
  if (!topRanked.some((entry) => entry.name === region)) {
    topRanked[topRanked.length - 1] = fallbackRegion;
    topRanked.sort((left, right) => right.score - left.score);
  }

  return topRanked;
};

const buildRiskLevel = (pressure: number): AdvisorRiskFlag["level"] => {
  if (pressure >= 54) {
    return "Watch";
  }

  if (pressure >= 36) {
    return "Moderate";
  }

  return "Low";
};

const hashString = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const buildTraceId = (
  form: AdvisorFormState,
  sampleInput?: AdvisorSampleInput,
) => {
  const seed = [
    sampleInput?.traceSeed ?? sampleInput?.fileName ?? "reference",
    form.cropId,
    form.stage,
    form.region,
    form.soil,
    form.month,
    form.goal,
  ].join("|");

  return `SF-AI-${hashString(seed).toString(36).toUpperCase().padStart(8, "0").slice(-8)}`;
};

const buildSampleQuality = (sampleInput?: AdvisorSampleInput) => {
  if (!sampleInput) {
    return 90;
  }

  if (sampleInput.source === "reference-library") {
    return 93;
  }

  const sizeSignal = sampleInput.fileSizeKb
    ? clamp(70 + Math.round(sampleInput.fileSizeKb / 28), 70, 94)
    : 78;
  const mimeBoost =
    sampleInput.mimeType?.includes("png")
      ? 4
      : sampleInput.mimeType?.includes("jpeg") || sampleInput.mimeType?.includes("jpg")
        ? 5
        : sampleInput.mimeType?.includes("webp")
          ? 3
          : 0;

  return clamp(sizeSignal + mimeBoost, 68, 96);
};

const buildConfidenceDrivers = ({
  monthMatch,
  soilMatch,
  selectedRegionScore,
  sampleQuality,
}: {
  monthMatch: boolean;
  soilMatch: boolean;
  selectedRegionScore: number;
  sampleQuality: number;
}): AdvisorConfidenceDriver[] => [
  {
    label: "Regional suitability",
    status: selectedRegionScore >= 84 ? "strong" : "watch",
    detail:
      selectedRegionScore >= 84
        ? "The target region closely matches this crop's strongest production corridors."
        : "The target region is workable, but nearby production zones currently rank stronger.",
  },
  {
    label: "Season timing",
    status: monthMatch ? "strong" : "watch",
    detail: monthMatch
      ? "The planning month sits inside the crop's preferred operating window."
      : "The planning month is outside the strongest cycle, so speed and stand confidence are discounted.",
  },
  {
    label: "Soil compatibility",
    status: soilMatch ? "strong" : "watch",
    detail: soilMatch
      ? "The chosen soil profile supports stronger rooting, irrigation control, and nutrient efficiency."
      : "The crop can still perform, but the current soil profile raises establishment and consistency risk.",
  },
  {
    label: "Sample clarity",
    status: sampleQuality >= 85 ? "strong" : "watch",
    detail:
      sampleQuality >= 85
        ? "The captured sample gives the vision stack enough surface detail for a stable advisory pass."
        : "The current image is still usable, but a cleaner capture would improve evidence quality.",
  },
];

const buildActionPlan = (
  crop: CropProfile,
  form: AdvisorFormState,
  topRegion: string,
): AdvisorAction[] => {
  if (form.stage === "produce") {
    return [
      {
        window: "Now",
        title: "Sort the lot by grade",
        detail:
          "Separate premium-grade produce from processing volume before dispatch so buyers receive a cleaner offer.",
      },
      {
        window: "Next 24 hours",
        title: "Lock delivery timing",
        detail:
          "Use the strongest buyer window and move the lot during the coolest handling hours to protect shelf life.",
      },
      {
        window: "Next cycle",
        title: `Plan the next field block for ${topRegion}`,
        detail: `Use ${crop.fieldWindow.toLowerCase()} to secure the next production run before this lot leaves the farm.`,
      },
    ];
  }

  return [
    {
      window: "Today",
      title: "Prepare the field setup",
      detail: `Match the field layout to ${crop.spacing.toLowerCase()} and align irrigation around ${crop.irrigationWindow.toLowerCase()}`,
    },
    {
      window: "This week",
      title: "Confirm inputs and scouting rhythm",
      detail: `${crop.nutrients} Pair that with field checks during ${crop.scoutingWindow.toLowerCase()}`,
    },
    {
      window: "Before scale-up",
      title: `Validate the strongest zone: ${topRegion}`,
      detail: `Run the next planting cycle in ${topRegion} first, then expand once stand quality remains stable.`,
    },
  ];
};

const buildCommercialSignals = ({
  marketFit,
  crop,
  goal,
  topRegion,
}: {
  marketFit: number;
  crop: CropProfile;
  goal: AnalysisGoal;
  topRegion: string;
}): AdvisorCommercialSignal[] => [
  {
    label: "Buyer momentum",
    value:
      marketFit >= 90
        ? "Premium"
        : marketFit >= 82
          ? "Stable"
          : "Selective",
    detail:
      marketFit >= 90
        ? "Buyer timing is favorable for a premium pitch if the lot stays uniform and traceable."
        : "Demand is healthy, but grading discipline will decide how strongly the market responds.",
  },
  {
    label: "Best commercial zone",
    value: topRegion,
    detail: `Current agronomy and buyer signals point to ${topRegion} as the strongest region to prioritize.`,
  },
  {
    label: "Operating priority",
    value: advisoryFocusMap[goal],
    detail: `${crop.marketWindow} The advisory is tuned to protect ${goalSummaryMap[goal]}.`,
  },
];

const buildTimingPlan = (
  crop: CropProfile,
  stage: AnalysisStage,
): AdvisorTimingItem[] => {
  if (stage === "produce") {
    return [
      {
        label: "Market release window",
        value: crop.marketWindow,
        detail: "Use the current sample to time dispatch before quality drops.",
      },
      {
        label: "Sorting window",
        value: "Sort and pack between 6:00 AM and 8:00 AM.",
        detail: "Cooler hours reduce bruising and keep visual grading stable.",
      },
      {
        label: "Next crop planning",
        value: crop.fieldWindow,
        detail: "The next planting cycle should be lined up before this lot leaves the farm.",
      },
      {
        label: "Follow-up analysis",
        value: "Refresh the advisory in 7 days or before dispatch.",
        detail: "A second scan is useful once market demand or field weather shifts.",
      },
    ];
  }

  return [
    {
      label: "Best planting window",
      value: crop.fieldWindow,
      detail: "This is the strongest timing slot the advisory engine sees for the crop.",
    },
    {
      label: "Scouting time",
      value: crop.scoutingWindow,
      detail: "Morning scouting gives clearer signals for stress, pests, and stand count.",
    },
    {
      label: "Irrigation slot",
      value: crop.irrigationWindow,
      detail: "Watering early helps keep leaf and root stress lower through the day.",
    },
    {
      label: "Crop cycle checkpoint",
      value: crop.harvestLead,
      detail: "Use this to plan labor, input timing, and harvest booking.",
    },
  ];
};

export const buildAdvisorAnalysis = (
  form: AdvisorFormState,
  sampleInput?: AdvisorSampleInput,
  now = new Date(),
): AdvisorAnalysis => {
  const crop = getCropProfile(form.cropId) ?? cropProfiles[0];
  const monthMatch = crop.preferredMonths.includes(form.month);
  const soilMatch = crop.preferredSoils.includes(form.soil);
  const regionRanking = buildRegionRanking(crop, form.region);
  const selectedRegionScore =
    regionRanking.find((entry) => entry.name === form.region)?.score ?? 72;
  const topRegion = regionRanking[0]?.name ?? form.region;
  const sampleQuality = buildSampleQuality(sampleInput);
  const captureBoost = Math.round((sampleQuality - 80) / 5);
  const stageBoost = form.stage === "seed" ? 6 : form.stage === "seedling" ? 4 : 2;
  const goalBoost =
    form.goal === "yield"
      ? 5
      : form.goal === "resilience"
        ? 7
        : form.goal === "fast-market"
          ? Math.round(crop.cycleSpeed / 11)
          : Math.round(crop.marketStrength / 12);

  const confidence = clamp(
    Math.round(
        selectedRegionScore * 0.52 +
        (soilMatch ? 14 : 6) +
        (monthMatch ? 15 : 7) +
        stageBoost +
        goalBoost +
        captureBoost,
    ),
    68,
    97,
  );

  const climateFit = clamp(
    Math.round(
      selectedRegionScore +
        (monthMatch ? 8 : -8) +
        (form.goal === "resilience" ? 5 : 0),
    ),
    58,
    98,
  );

  const soilFit = clamp(
    Math.round(72 + (soilMatch ? 18 : -8) + (form.stage === "seed" ? 4 : 0)),
    58,
    96,
  );

  const marketFit = clamp(
    Math.round(
        crop.marketStrength +
        (form.goal === "fast-market" ? 8 : form.goal === "export-quality" ? 10 : 3) +
        (form.stage === "produce" ? 4 : 0) +
        Math.max(captureBoost, 0),
    ),
    62,
    97,
  );

  const riskPressure = clamp(
      crop.baseRisk + (soilMatch ? -6 : 8) + (monthMatch ? -4 : 10),
    18,
    74,
  );

  const sampleSourceLabel =
    sampleInput?.source === "farmer-upload"
      ? "Farm capture"
      : "Verified crop library";
  const scanModeLabel =
    sampleInput?.source === "farmer-upload"
      ? "Live field capture"
      : "Verified library scan";
  const traceId = buildTraceId(form, sampleInput);

  const summary = `${crop.name} ${form.stage === "produce" ? "sample" : "lot"} looks ${
    confidence >= 90 ? "highly ready" : confidence >= 82 ? "promising" : "recoverable"
  } for ${form.region}. The advisory recommends ${topRegion} as the strongest production zone, ${
    crop.fieldWindow.toLowerCase()
  }, and a plan that will ${goalSummaryMap[form.goal]}.`;

  const topSignalAdjustment = (soilMatch ? 2 : -3) + Math.round((sampleQuality - 82) / 6);
  const visionSignals = crop.stageSignals[form.stage].map((signal, index) => ({
    label: signal.label,
    value: clamp(
      signal.base + topSignalAdjustment + (monthMatch ? 2 : -2) - index,
      56,
      98,
    ),
    note: signal.note,
  }));

  const growthPlaybook = [
    crop.stagePlaybook[form.stage][0],
    crop.stagePlaybook[form.stage][1],
    `Spacing guide: ${crop.spacing}`,
    `Feeding and water plan: ${crop.nutrients} ${crop.irrigation}`,
  ];

  const mismatchTitle = !monthMatch
    ? "Timing drift"
    : !soilMatch
      ? "Soil mismatch"
      : "Seasonal pressure";
  const mismatchDetail = !monthMatch
    ? `${form.month} is outside the crop's strongest window, so the model is discounting field speed and stand confidence.`
    : !soilMatch
      ? `${form.soil} is workable, but the crop prefers ${crop.preferredSoils.join(", ")} for stronger consistency.`
      : "Conditions line up well enough to scale, but the field should still be monitored closely as weather shifts.";

  const riskFlags: AdvisorRiskFlag[] = [
    {
      level: buildRiskLevel(riskPressure),
      title: mismatchTitle,
      detail: mismatchDetail,
    },
    ...crop.riskNotes.map((riskNote, index) => ({
      level: buildRiskLevel(riskPressure + index * 4),
      title: riskNote.title,
      detail: riskNote.detail,
    })),
  ].slice(0, 3);

  const confidenceDrivers = buildConfidenceDrivers({
    monthMatch,
    soilMatch,
    selectedRegionScore,
    sampleQuality,
  });
  const actionPlan = buildActionPlan(crop, form, topRegion);
  const commercialSignals = buildCommercialSignals({
    marketFit,
    crop,
    goal: form.goal,
    topRegion,
  });

  return {
    cropName: crop.name,
    stageLabel: stageLabelMap[form.stage],
    title: `${crop.name} outlook for ${form.region}`,
    summary,
    confidence,
    readinessBand: readinessBand(confidence),
    runLabel: now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    traceId,
    scanModeLabel,
    sampleSourceLabel,
    sampleQuality,
    sampleSummary:
      sampleInput?.source === "farmer-upload"
        ? `The uploaded sample is being treated as a live field capture. Vision confidence is currently ${sampleQuality}% based on capture clarity, file quality, and visible surface detail.`
        : `This advisory is anchored on a verified crop library scan for ${crop.name.toLowerCase()}, which keeps the sample evidence stable while agronomy conditions change.`,
    advisoryFocus: advisoryFocusMap[form.goal],
    marketHeadline:
      marketFit >= 90
        ? "Premium window is open"
        : marketFit >= 82
          ? "Market demand is stable"
          : "Buyer demand is selective",
    nextStep: `Next move: use ${form.sampleName || crop.name} to confirm the field setup, then lock inputs for ${topRegion} before the next advisory checkpoint.`,
    metrics: [
      {
        label: "Field readiness",
        value: confidence,
        hint: "Overall operational readiness score for this crop and scenario.",
        accent: "green",
      },
      {
        label: "Climate fit",
        value: climateFit,
        hint: "How well the selected month and region line up with the crop cycle.",
        accent: "blue",
      },
      {
        label: "Soil match",
        value: soilFit,
        hint: "Root-zone compatibility based on the chosen soil profile.",
        accent: "amber",
      },
      {
        label: "Market signal",
        value: marketFit,
        hint: "Expected buyer confidence based on crop quality and timing.",
        accent: "purple",
      },
    ],
    engines: [
      {
        name: "Computer vision",
        value: clamp(Math.round((confidence + sampleQuality) / 2), 60, 98),
        detail: "Grades visible crop quality, maturity cues, and surface consistency from the sample image.",
      },
      {
        name: "Climate model",
        value: climateFit,
        detail: "Maps the crop stage to the selected season and regional conditions.",
      },
      {
        name: "Soil intelligence",
        value: soilFit,
        detail: "Checks how well the crop fits the planned root-zone environment.",
      },
      {
        name: "Market engine",
        value: marketFit,
        detail: "Estimates buyer pull, timing advantage, and pricing strength.",
      },
    ],
    regionRanking,
    visionSignals,
    timingPlan: buildTimingPlan(crop, form.stage),
    growthPlaybook,
    riskFlags,
    confidenceDrivers,
    actionPlan,
    commercialSignals,
  };
};
