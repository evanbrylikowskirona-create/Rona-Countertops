import { writable } from 'svelte/store';
import type { QuoteState, Toast, ToastType, ProductEntry, AddonEntry, AppSettings } from './types';
import {
  DEFAULT_ADDONS,
  DEFAULT_MARGIN_PRODUCTS,
  DEFAULT_MARGIN_ADDONS,
  DEFAULT_PRICING
} from './constants';

// ── Settings store ────────────────────────────────────────────────────────────

function createSettingsStore() {
  const { subscribe, set, update } = writable<AppSettings>({
    pricingData: DEFAULT_PRICING,
    marginProducts: DEFAULT_MARGIN_PRODUCTS,
    marginAddons: DEFAULT_MARGIN_ADDONS
  });

  return {
    subscribe, set, update,
    reset: () => set({
      pricingData: DEFAULT_PRICING,
      marginProducts: DEFAULT_MARGIN_PRODUCTS,
      marginAddons: DEFAULT_MARGIN_ADDONS
    })
  };
}

export const settingsStore = createSettingsStore();

// ── Quote store ───────────────────────────────────────────────────────────────

function emptyQuote(): QuoteState {
  return {
    id: null,
    quoteNumber: null,
    customerInfo: { name: '', phone: '', email: '', address: '' },
    products: [],
    addons: DEFAULT_ADDONS.map((a) => ({ ...a })),
    marginProducts: DEFAULT_MARGIN_PRODUCTS,
    marginAddons: DEFAULT_MARGIN_ADDONS,
    notes: ''
  };
}

function createQuoteStore() {
  const { subscribe, set, update } = writable<QuoteState>(emptyQuote());

  return {
    subscribe, set, update,
    reset: () => set(emptyQuote()),
    addProduct: (product: ProductEntry) =>
      update((q) => ({ ...q, products: [...q.products, product] })),
    updateProduct: (id: number, changes: Partial<ProductEntry>) =>
      update((q) => ({
        ...q,
        products: q.products.map((p) => (p.id === id ? { ...p, ...changes } : p))
      })),
    removeProduct: (id: number) =>
      update((q) => ({ ...q, products: q.products.filter((p) => p.id !== id) })),
    updateAddon: (addonId: string, changes: Partial<AddonEntry>) =>
      update((q) => ({
        ...q,
        addons: q.addons.map((a) => (a.id === addonId ? { ...a, ...changes } : a))
      })),
    setCustomerInfo: (info: Partial<QuoteState['customerInfo']>) =>
      update((q) => ({ ...q, customerInfo: { ...q.customerInfo, ...info } })),
    setMargins: (marginProducts: number, marginAddons: number) =>
      update((q) => ({ ...q, marginProducts, marginAddons })),
    setNotes: (notes: string) => update((q) => ({ ...q, notes }))
  };
}

export const quoteStore = createQuoteStore();

// ── Unsaved changes ───────────────────────────────────────────────────────────

export const unsaved = writable(false);

// ── Client mode (hides all internal cost/margin/notes info) ──────────────────

export const clientMode = writable(false);

// ── Toast store ───────────────────────────────────────────────────────────────

let toastId = 0;

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function show(message: string, type: ToastType = 'success', duration = 3000) {
    const id = ++toastId;
    update((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      update((t) => t.map((toast) => (toast.id === id ? { ...toast, removing: true } : toast)));
      setTimeout(() => {
        update((t) => t.filter((toast) => toast.id !== id));
      }, 260);
    }, duration);
  }

  return { subscribe, show };
}

export const toastStore = createToastStore();
