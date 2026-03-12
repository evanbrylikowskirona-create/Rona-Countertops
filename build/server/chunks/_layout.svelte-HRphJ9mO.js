import { c as store_get, d as ensure_array_like, f as attr, h as attr_class, j as stringify, k as escape_html, l as slot, m as unsubscribe_stores, n as getContext } from './index-Dp9S5Omt.js';
import './root-ClWktRf6.js';
import './state.svelte-BOROwm-q.js';
import { t as toastStore, q as quoteStore, u as unsaved, c as clientMode } from './stores-CIp7-zwv.js';
import 'firebase/firestore';
import './firebase-B38L6PY_.js';
import 'firebase/app';

const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function ToastContainer($$renderer) {
  var $$store_subs;
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const colors = {
    success: "bg-slate-700",
    error: "bg-red-700",
    info: "bg-teal-700",
    warning: "bg-amber-700"
  };
  $$renderer.push(`<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"><!--[-->`);
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toastStore", toastStore));
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let toast = each_array[$$index];
    $$renderer.push(`<div${attr_class(`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg pointer-events-auto max-w-xs ${stringify(colors[toast.type])} ${stringify(toast.removing ? "toast-leave" : "toast-enter")}`)}><span class="text-base">${escape_html(icons[toast.type])}</span> <span>${escape_html(toast.message)}</span></div>`);
  }
  $$renderer.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let onCalculator, quoteLabel;
    const navLinks = [
      { href: "/", label: "Calculator" },
      { href: "/cutlist", label: "Cut List" },
      { href: "/quotes", label: "Quotes" },
      { href: "/settings", label: "Settings" }
    ];
    let saving = false;
    onCalculator = store_get($$store_subs ??= {}, "$page", page).url.pathname === "/";
    quoteLabel = store_get($$store_subs ??= {}, "$quoteStore", quoteStore).quoteNumber ? store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name ? `${store_get($$store_subs ??= {}, "$quoteStore", quoteStore).quoteNumber} · ${store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name}` : store_get($$store_subs ??= {}, "$quoteStore", quoteStore).quoteNumber : store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name || null;
    $$renderer2.push(`<div class="min-h-screen bg-slate-100 flex flex-col"><nav class="bg-slate-800 text-white shadow-md no-print sticky top-0 z-40"><div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3"><span class="font-bold text-base tracking-tight whitespace-nowrap mr-1">RONA Countertops</span> <div class="flex items-center gap-0.5"><!--[-->`);
    const each_array = ensure_array_like(navLinks);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<a${attr("href", link.href)}${attr_class(`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${stringify(store_get($$store_subs ??= {}, "$page", page).url.pathname === link.href ? "bg-slate-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white")}`)}>${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (quoteLabel) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-700/60 border border-slate-600 rounded-full px-3 py-1 max-w-50 truncate"><svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span class="truncate">${escape_html(quoteLabel)}</span></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex-1"></div> `);
    if (store_get($$store_subs ??= {}, "$unsaved", unsaved)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="hidden sm:flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-300/10 border border-amber-300/30 rounded-full px-2.5 py-1 whitespace-nowrap">● Unsaved</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (onCalculator) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center gap-1"><button${attr("disabled", saving, true)} title="Save quote (Ctrl+S)" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded text-xs font-medium transition-colors disabled:opacity-50"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> ${escape_html("Save")}</button> <button title="Print quote" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded text-xs font-medium transition-colors"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Print</button> <button title="New quote" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded text-xs font-medium transition-colors"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> New</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button${attr("title", store_get($$store_subs ??= {}, "$clientMode", clientMode) ? "Switch to staff view (Esc)" : "Switch to client view (Esc)")}${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors whitespace-nowrap ${stringify(store_get($$store_subs ??= {}, "$clientMode", clientMode) ? "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700" : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white")}`)}>`);
    if (store_get($$store_subs ??= {}, "$clientMode", clientMode)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Client View`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg> Staff View`);
    }
    $$renderer2.push(`<!--]--></button></div></nav> <div class="print-only text-center font-semibold py-2 text-lg">Rona McGaughey North Bay — 705-474-4400</div> <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main></div> `);
    ToastContainer($$renderer2);
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-HRphJ9mO.js.map
