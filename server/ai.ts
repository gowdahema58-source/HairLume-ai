import { GoogleGenAI, Type } from '@google/genai';
import { HAIR_CATEGORIES, type DensityMetrics, type GenderOption, type HairCategory } from '../src/types/hairlume';

let cachedAiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in server environment secrets.');
  }
  if (!cachedAiClient) {
    cachedAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAiClient;
}

export interface HairVisionResult {
  isValidHairImage: boolean;
  validationReason: string;
  primaryCategory: HairCategory;
  secondaryObservations: string[];
  confidenceScore: number;
  confidenceLabel: string;
  hairHealthScore: number;
  densityMetrics: DensityMetrics;
  scalpConcerns: string[];
  aiSummary: string;
  limitationsNote: string;
  dermatologistFlag: boolean;
}

export async function analyzeHairImageWithGemini(params: {
  base64Data: string;
  mimeType: string;
  gender: GenderOption;
  age: number;
  scalpNotes: string;
}): Promise<HairVisionResult> {
  const ai = getAiClient();

  const systemInstruction = `You are HAIRLUME AI's visual hair and scalp assessment engine.
Analyze the provided photograph strictly based on visible cosmetic and structural cues.
CRITICAL RULES:
1. First verify whether the image clearly shows human hair and/or a human scalp (crown, parting, hairline, or hair lengths). If the photo is blurry beyond inspection, completely dark, or shows an unrelated object (landscape, text document, wall, pet, etc.), set isValidHairImage=false and explain clearly in validationReason why it cannot be analyzed.
2. NEVER claim to medically diagnose any disease or condition (such as alopecia areata, telogen effluvium, tinea capitis, psoriasis, or hormonal disorders). Always frame findings as visible cosmetic observations ("visible thinning", "dandruff-like visible flakes", "oily scalp sheen").
3. Classify primaryCategory into EXACTLY ONE of these 8 categories:
   - "Normal-looking hair"
   - "Mild visible thinning"
   - "Moderate visible thinning"
   - "Severe visible thinning"
   - "Dry and damaged hair"
   - "Oily scalp"
   - "Dandruff-like visible flakes"
   - "Hair breakage"
4. Be honest with confidenceScore (0-100) based on lighting quality, focus sharpness, and scalp visibility.
5. All densityMetrics (crownDensity, partingCoverage, scalpClarity, strandIntegrity, hydrationBalance) and hairHealthScore must be realistic integers from 10 to 100 reflecting what is actually visible in the photograph.
6. Set dermatologistFlag=true if there is moderate-to-severe visible scalp exposure, marked inflammation/redness, or pronounced flaking that warrants clinical evaluation.`;

  const prompt = `User Context:
- Gender: ${params.gender}
- Age: ${params.age}
- User Notes: ${params.scalpNotes ? params.scalpNotes : 'None provided'}

Inspect the uploaded photograph carefully and return the structured hair and scalp visual assessment JSON.`;

  const imagePart = {
    inlineData: {
      mimeType: params.mimeType,
      data: params.base64Data,
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValidHairImage: {
            type: Type.BOOLEAN,
            description: 'True only if human hair or scalp is clearly visible and analyzable.',
          },
          validationReason: {
            type: Type.STRING,
            description: 'Clear explanation if image is invalid, or brief image quality summary if valid.',
          },
          primaryCategory: {
            type: Type.STRING,
            description: `Must be exactly one of: ${HAIR_CATEGORIES.join(', ')}`,
          },
          secondaryObservations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Up to 3 concise visible secondary hair or scalp cues.',
          },
          confidenceScore: {
            type: Type.INTEGER,
            description: 'Honest visual confidence percentage (30 to 96) based on photo clarity and lighting.',
          },
          confidenceLabel: {
            type: Type.STRING,
            description: 'Short label like High Clarity, Moderate Clarity, or Low Lighting.',
          },
          hairHealthScore: {
            type: Type.INTEGER,
            description: 'Composite cosmetic visual appearance index from 15 to 98.',
          },
          densityMetrics: {
            type: Type.OBJECT,
            properties: {
              crownDensity: { type: Type.INTEGER },
              partingCoverage: { type: Type.INTEGER },
              scalpClarity: { type: Type.INTEGER },
              strandIntegrity: { type: Type.INTEGER },
              hydrationBalance: { type: Type.INTEGER },
            },
            required: [
              'crownDensity',
              'partingCoverage',
              'scalpClarity',
              'strandIntegrity',
              'hydrationBalance',
            ],
          },
          scalpConcerns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Visible surface observations such as parting widening, sebum sheen, dry cuticles, or none observed.',
          },
          aiSummary: {
            type: Type.STRING,
            description: '2-3 sentence plain-language summary of visible hair density, scalp surface, and strand condition.',
          },
          limitationsNote: {
            type: Type.STRING,
            description: 'Explicit reminder that image-based visual inspection is non-diagnostic and affected by lighting, angle, and styling.',
          },
          dermatologistFlag: {
            type: Type.BOOLEAN,
            description: 'True when visible thinning or scalp signs suggest professional dermatological review would be beneficial.',
          },
        },
        required: [
          'isValidHairImage',
          'validationReason',
          'primaryCategory',
          'secondaryObservations',
          'confidenceScore',
          'confidenceLabel',
          'hairHealthScore',
          'densityMetrics',
          'scalpConcerns',
          'aiSummary',
          'limitationsNote',
          'dermatologistFlag',
        ],
      },
    },
  });

  const rawText = (response.text ?? '').trim();
  if (!rawText) {
    throw new Error('AI vision model returned an empty response. Please try again.');
  }

  const parsed = JSON.parse(rawText) as HairVisionResult;

  // Normalize category strictly to one of the 8 allowed categories
  const matchedCategory =
    HAIR_CATEGORIES.find((c) => c.toLowerCase() === (parsed.primaryCategory || '').toLowerCase()) ||
    'Normal-looking hair';

  const clamp = (val: number, min = 10, max = 98) =>
    Math.max(min, Math.min(max, Math.round(Number.isFinite(val) ? val : 65)));

  return {
    isValidHairImage: Boolean(parsed.isValidHairImage),
    validationReason: parsed.validationReason || 'Image quality checked.',
    primaryCategory: matchedCategory,
    secondaryObservations: Array.isArray(parsed.secondaryObservations)
      ? parsed.secondaryObservations.slice(0, 4)
      : [],
    confidenceScore: clamp(parsed.confidenceScore, 25, 96),
    confidenceLabel: parsed.confidenceLabel || 'Moderate Clarity',
    hairHealthScore: clamp(parsed.hairHealthScore, 15, 98),
    densityMetrics: {
      crownDensity: clamp(parsed.densityMetrics?.crownDensity),
      partingCoverage: clamp(parsed.densityMetrics?.partingCoverage),
      scalpClarity: clamp(parsed.densityMetrics?.scalpClarity),
      strandIntegrity: clamp(parsed.densityMetrics?.strandIntegrity),
      hydrationBalance: clamp(parsed.densityMetrics?.hydrationBalance),
    },
    scalpConcerns: Array.isArray(parsed.scalpConcerns) ? parsed.scalpConcerns.slice(0, 5) : [],
    aiSummary: parsed.aiSummary || 'Visual inspection completed.',
    limitationsNote:
      parsed.limitationsNote ||
      'Single-photograph assessment cannot diagnose medical hair or scalp conditions and varies with lighting, camera angle, and hair styling.',
    dermatologistFlag: Boolean(parsed.dermatologistFlag),
  };
}

