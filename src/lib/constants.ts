import type { PricingData, AddonEntry } from './types';

export const DEFAULT_PRICING: PricingData = {
  '2300_2700_Nova': {
    name: '2300, 2700, Nova',
    regular: { vanity: 10.97, bar32: 17.56, bar36: 29.72 },
    special: { vanity: 12.89, bar32: 20.64, bar36: 34.93 },
    ultra:   { vanity: 16.67, bar32: 26.70, bar36: 45.18 }
  },
  'Ora_Valencia': {
    name: 'Ora / Valencia',
    regular: { vanity: 12.53, bar32: 20.55, bar36: 31.28 },
    special: { vanity: 14.73, bar32: 24.15, bar36: 36.75 },
    ultra:   { vanity: 19.05, bar32: 31.24, bar36: 47.54 }
  }
};

export const DEFAULT_ADDONS: AddonEntry[] = [
  // Universal
  { id: 'mitre_assembled',   label: 'MITRE – ASSEMBLED',        costPrice: 60.00,  checked: false, quantity: 1 },
  { id: 'mitre_unassembled', label: 'MITRE – UNASSEMBLED',      costPrice: 33.25,  checked: false, quantity: 1 },
  { id: 'straight_cut',      label: 'STRAIGHT CUT',             costPrice: 10.00,  checked: false, quantity: 1 },
  { id: 'finished_ends',     label: 'FINISHED ENDS APPLIED',    costPrice: 12.00,  checked: false, quantity: 1 },
  { id: 'built_up_strips',   label: 'BUILT UP STRIPS',          costPrice: 10.00,  checked: false, quantity: 1 },
  // Grade-specific caps
  { id: 'rcap',     label: 'END CAP – Regular',  costPrice: 2.89,  checked: false, quantity: 1, gradeRestriction: 'regular' },
  { id: 'scap',     label: 'END CAP – Special',  costPrice: 3.40,  checked: false, quantity: 1, gradeRestriction: 'special' },
  { id: 'ucap',     label: 'END CAP – Ultra',    costPrice: 4.39,  checked: false, quantity: 1, gradeRestriction: 'ultra'   },
  // Trim rolls
  { id: 'rtrimroll', label: 'TRIM ROLL – Regular', costPrice: 11.58,  checked: false, quantity: 1, gradeRestriction: 'regular' },
  { id: 'strimroll', label: 'TRIM ROLL – Special', costPrice: 14.57, checked: false, quantity: 1, gradeRestriction: 'special' },
  { id: 'utrimroll', label: 'TRIM ROLL – Ultra',   costPrice: 24.88, checked: false, quantity: 1, gradeRestriction: 'ultra'   },
];

export const STOCK_LENGTHS = [48, 60, 72, 96, 120, 144];

export const CUT_COLORS = [
  'bg-slate-600', 'bg-emerald-500', 'bg-violet-500',
  'bg-amber-500', 'bg-rose-500',   'bg-cyan-500'
];

export const COLOR_LOOKUP_DATA = [
  {
    grade: 'R', label: 'Regular',
    color: 'border-emerald-400 bg-emerald-50 text-emerald-800',
    codes: ['CA', '38', '60', '43', '58', 'SD']
  },
  {
    grade: 'S', label: 'Special',
    color: 'border-blue-400 bg-blue-50 text-blue-800',
    codes: ['DI', 'BC', 'CW', 'LM', 'RM', 'SR', 'FP', 'EV',
            '01', '07', '12', '18', '22', '28', '52', '90',
            '34', '46', 'NG', 'RD', 'WR', 'GR', 'T']
  },
  {
    grade: 'U', label: 'Ultra',
    color: 'border-violet-400 bg-violet-50 text-violet-800',
    codes: ['PANORAMA', 'UL', '35', '55', 'FXNG', 'FXRD', 'FX11', 'FX34', 'FX43', 'FX46', 'SDU']
  }
];

export const COLOR_AMBIGUOUS: Record<string, string[]> = {
  IM: ['Special (Arborite)', 'Ultra (Arborite)'],
  VL: ['Special (Arborite)', 'Ultra (Arborite)']
};

export const PROFILE_LABELS: Record<string, string> = {
  vanity: 'Vanity/Kitchen (25½")',
  bar32: 'Bar Top 32"',
  bar36: 'Bar Top 36"'
};

export const DEFAULT_MARGIN_PRODUCTS = 1.99;
export const DEFAULT_MARGIN_ADDONS   = 1.50;
