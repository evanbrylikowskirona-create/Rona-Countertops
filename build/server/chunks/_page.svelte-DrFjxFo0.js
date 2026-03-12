import { o as head, f as attr } from './index-Dp9S5Omt.js';
import './root-ClWktRf6.js';
import './state.svelte-BOROwm-q.js';
import 'firebase/firestore';
import './firebase-B38L6PY_.js';
import './stores-CIp7-zwv.js';
import 'firebase/app';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let quotes = [];
    let search = "";
    quotes.filter((q) => {
      const s = search.toLowerCase();
      return (q.quoteNumber ?? "").toLowerCase().includes(s) || (q.customerInfo?.name ?? "").toLowerCase().includes(s) || (q.customerInfo?.phone ?? "").toLowerCase().includes(s) || (q.notes ?? "").toLowerCase().includes(s);
    });
    head("h4j26", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Saved Quotes | RONA</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto"><div class="bg-white rounded-lg shadow-sm overflow-hidden"><div class="bg-slate-700 text-white px-6 py-4"><h1 class="text-xl font-semibold">Saved Quotes</h1></div> <div class="p-5"><div class="mb-4"><input type="search" placeholder="Search by name, quote #, phone or notes…"${attr("value", search)} class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"/></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-center text-slate-400 py-10">Loading quotes…</p>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DrFjxFo0.js.map
