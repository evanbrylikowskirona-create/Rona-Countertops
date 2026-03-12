// ── Pricing ──────────────────────────────────────────────────────────────────

export type FinishGrade = 'regular' | 'special' | 'ultra';
export type ProfileType = 'vanity' | 'bar32' | 'bar36';

export interface ProfilePricing {
  vanity: number;
  bar32: number;
  bar36: number;
}

export interface ProductPricing {
  name: string;
  regular: ProfilePricing;
  special: ProfilePricing;
  ultra: ProfilePricing;
}

export type PricingData = Record<string, ProductPricing>;

// ── Quote ─────────────────────────────────────────────────────────────────────

export interface ProductEntry {
  id: number;
  productKey: string;
  grade: FinishGrade;
  profile: ProfileType;
  quantity: number;
}

export interface AddonEntry {
  id: string;
  label: string;
  costPrice: number;
  checked: boolean;
  quantity: number;
  gradeRestriction?: FinishGrade; // undefined = universal
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface QuoteState {
  id: string | null;
  quoteNumber: string | null;
  customerInfo: CustomerInfo;
  products: ProductEntry[];
  addons: AddonEntry[];
  marginProducts: number;
  marginAddons: number;
  notes: string;
  createdAt?: number;
  updatedAt?: number;
}

// ── Firestore saved quote ────────────────────────────────────────────────────

export interface SavedQuote extends QuoteState {
  id: string;
  quoteNumber: string;
  createdAt: number;
  updatedAt: number;
}

// ── Cut list ─────────────────────────────────────────────────────────────────

export interface CutBoard {
  total: number;
  cuts: number[];
  remaining: number;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  removing?: boolean;
}

// ── Settings ─────────────────────────────────────────────────────────────────

export interface AppSettings {
  pricingData: PricingData;
  marginProducts: number;
  marginAddons: number;
}
