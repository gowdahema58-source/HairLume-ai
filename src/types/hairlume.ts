export type HairCategory =
  | 'Normal-looking hair'
  | 'Mild visible thinning'
  | 'Moderate visible thinning'
  | 'Severe visible thinning'
  | 'Dry and damaged hair'
  | 'Oily scalp'
  | 'Dandruff-like visible flakes'
  | 'Hair breakage';

export const HAIR_CATEGORIES: HairCategory[] = [
  'Normal-looking hair',
  'Mild visible thinning',
  'Moderate visible thinning',
  'Severe visible thinning',
  'Dry and damaged hair',
  'Oily scalp',
  'Dandruff-like visible flakes',
  'Hair breakage',
];

export type GenderOption = 'Female' | 'Male' | 'Other';
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  gender: GenderOption;
  age: number;
  hairType: string;
  washFrequencyDays: number;
  lastWashAt: string | null;
  createdAt: string;
}

export interface DensityMetrics {
  crownDensity: number;
  partingCoverage: number;
  scalpClarity: number;
  strandIntegrity: number;
  hydrationBalance: number;
}

export interface AnalysisRecord {
  id: number;
  userId: number;
  imageData: string;
  genderAtScan: GenderOption;
  ageAtScan: number;
  scalpNotes: string;
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
  recommendedProductIds: string[];
  createdAt: string;
}

export type ProductCategory = 'Shampoo' | 'Conditioner' | 'Hair Serum' | 'Hair Oil';

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceInr: number;
  size: string;
  image: string;
  description: string;
  keyActives: string[];
  usageInstructions: string;
  bestFor: HairCategory[];
  classification: 'Cosmetic Care';
  cosmeticRole: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export type AppRoute =
  | 'intro'
  | 'home'
  | 'login'
  | 'register'
  | 'upload'
  | 'analyze'
  | 'results'
  | 'products'
  | 'history'
  | 'education'
  | 'profile'
  | 'admin';
