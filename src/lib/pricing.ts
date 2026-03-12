import type { QuoteState, ProductEntry } from './types';
import type { PricingData } from './types';

export interface LineItem {
  label: string;
  costEach: number;
  qty: number;
  retailEach: number;
  retailTotal: number;
}

export interface PricingBreakdown {
  productLines: LineItem[];
  addonLines: LineItem[];
  productSubtotal: number;
  addonSubtotal: number;
  grandTotal: number;
}

export function calcBreakdown(
  quote: QuoteState,
  pricingData: PricingData
): PricingBreakdown {
  const { products, addons, marginProducts, marginAddons } = quote;

  const productLines: LineItem[] = products
    .filter((p) => p.quantity > 0 && pricingData[p.productKey])
    .map((p) => {
      const costEach = pricingData[p.productKey][p.grade][p.profile];
      const retailEach = costEach * marginProducts;
      return {
        label: `${pricingData[p.productKey].name} – ${p.grade} / ${p.profile}`,
        costEach,
        qty: p.quantity,
        retailEach,
        retailTotal: retailEach * p.quantity
      };
    });

  const addonLines: LineItem[] = addons
    .filter((a) => a.checked && a.quantity > 0)
    .map((a) => {
      const retailEach = a.costPrice * marginAddons;
      return {
        label: a.label,
        costEach: a.costPrice,
        qty: a.quantity,
        retailEach,
        retailTotal: retailEach * a.quantity
      };
    });

  const productSubtotal = productLines.reduce((s, l) => s + l.retailTotal, 0);
  const addonSubtotal   = addonLines.reduce((s, l) => s + l.retailTotal, 0);

  return {
    productLines,
    addonLines,
    productSubtotal,
    addonSubtotal,
    grandTotal: productSubtotal + addonSubtotal
  };
}

export function fmt(n: number): string {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
}

/** Detect which grades are actively used in the current product list */
export function activeGrades(products: ProductEntry[]): Set<string> {
  return new Set(products.map((p) => p.grade));
}
