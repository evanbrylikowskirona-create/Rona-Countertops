import { i as head, c as escape_html, d as attr, e as ensure_array_like, b as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { S as STOCK_LENGTHS } from "../../../chunks/stores.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let totalStock, totalWaste;
    let inputVal = "";
    let cuts = [];
    let boards = [];
    const MAX_STOCK = Math.max(...STOCK_LENGTHS);
    totalStock = boards.reduce((s, b) => s + b.total, 0);
    totalWaste = boards.reduce((s, b) => s + b.remaining, 0);
    totalStock > 0 ? (totalWaste / totalStock * 100).toFixed(1) : "0.0";
    head("czl2lf", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cut List Optimizer | RONA</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-2xl mx-auto space-y-4"><div class="bg-slate-600 text-white px-5 py-4 rounded-lg"><h1 class="text-xl font-semibold text-center">Cut List Optimizer</h1> <p class="text-slate-300 text-sm text-center mt-1">Enter your required cut lengths — the optimizer minimizes waste across stock sizes (${escape_html(STOCK_LENGTHS.join('", '))}").</p></div> <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-4"><div><label for="cut-input" class="block text-sm font-semibold text-slate-700 mb-2">Add Cut Length <span class="font-normal text-slate-400">(inches, max ${escape_html(MAX_STOCK)}")</span></label> <div class="flex gap-2"><input id="cut-input" type="number" placeholder="e.g. 72&quot;"${attr("value", inputVal)} class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"/> <button class="px-5 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors">Add</button></div></div> `);
    if (cuts.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div><p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Cut List <span class="font-normal normal-case text-slate-400">(${escape_html(cuts.length)} cut${escape_html(cuts.length !== 1 ? "s" : "")})</span></p> <div class="grid grid-cols-2 sm:grid-cols-3 gap-2"><!--[-->`);
      const each_array = ensure_array_like(cuts);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let cut = each_array[i];
        $$renderer2.push(`<div class="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-md border border-slate-200"><span class="font-mono font-medium text-sm">${escape_html(cut)}"</span> <button${attr("aria-label", `Remove ${stringify(cut)} inch cut`)} class="text-slate-400 hover:text-red-500 transition-colors ml-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex gap-2 pt-1"><button${attr("disabled", !cuts.length, true)} class="flex-1 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-md font-bold text-sm transition-colors">OPTIMIZE CUTS</button> `);
    if (cuts.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-md font-medium border border-slate-300 text-sm transition-colors">Clear All</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (cuts.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="bg-white rounded-lg border-2 border-dashed border-slate-300 p-16 text-center text-slate-400"><svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <p class="font-medium">Add cut lengths above to get started</p> <p class="text-sm mt-1">Stock sizes available: ${escape_html(STOCK_LENGTHS.join('", '))}"</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
