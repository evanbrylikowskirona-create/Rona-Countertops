import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { SavedQuote, AppSettings, PricingData } from './types';

// ── Quote counter (localStorage) ─────────────────────────────────────────────

const COUNTER_KEY = 'belangerQuoteCounter';

export function nextQuoteNumber(): string {
  let counter = 1;
  try {
    counter = parseInt(localStorage.getItem(COUNTER_KEY) ?? '0') + 1;
    localStorage.setItem(COUNTER_KEY, String(counter));
  } catch {}
  return 'NB-' + String(counter).padStart(4, '0');
}

// ── Quotes ────────────────────────────────────────────────────────────────────

export async function saveQuote(quote: SavedQuote): Promise<void> {
  const ref = doc(db, 'quotes', quote.id);
  await setDoc(ref, { ...quote, updatedAt: Date.now() });
}

export async function loadQuotes(): Promise<SavedQuote[]> {
  const q = query(collection(db, 'quotes'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SavedQuote);
}

export async function loadQuote(id: string): Promise<SavedQuote | null> {
  const snap = await getDoc(doc(db, 'quotes', id));
  return snap.exists() ? (snap.data() as SavedQuote) : null;
}

export async function deleteQuote(id: string): Promise<void> {
  await deleteDoc(doc(db, 'quotes', id));
}

export async function updateQuoteMeta(
  id: string,
  fields: Partial<Pick<SavedQuote, 'notes' | 'customerInfo'>>
): Promise<void> {
  await updateDoc(doc(db, 'quotes', id), { ...fields, updatedAt: Date.now() });
}

// ── Settings ──────────────────────────────────────────────────────────────────

const SETTINGS_DOC = 'app/settings';

export async function loadSettings(): Promise<AppSettings | null> {
  const snap = await getDoc(doc(db, 'app', 'settings'));
  return snap.exists() ? (snap.data() as AppSettings) : null;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setDoc(doc(db, 'app', 'settings'), settings);
}
