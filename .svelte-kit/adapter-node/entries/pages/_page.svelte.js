import { s as store_get, c as escape_html, d as attr, b as stringify, e as ensure_array_like, u as unsubscribe_stores, h as bind_props, a as attr_class, i as head } from "../../chunks/index2.js";
import { s as settingsStore, P as PROFILE_LABELS, q as quoteStore, c as clientMode, C as COLOR_LOOKUP_DATA } from "../../chunks/stores.js";
function ProductRow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let productKeys;
    let product = $$props["product"];
    let index = $$props["index"];
    product.profile || "vanity";
    productKeys = Object.keys(store_get($$store_subs ??= {}, "$settingsStore", settingsStore).pricingData);
    $$renderer2.push(`<div class="bg-white border border-slate-200 rounded-lg p-3 space-y-3"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-500 uppercase tracking-wide">Product #${escape_html(index + 1)}</span> <button class="text-slate-400 hover:text-red-500 transition-colors" title="Remove product"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div> <div class="grid grid-cols-2 gap-2 sm:grid-cols-4"><div class="col-span-2 sm:col-span-1"><label${attr("for", `product-line-${stringify(product.id)}`)} class="block text-xs font-medium text-slate-600 mb-1">Product Line</label> `);
    $$renderer2.select(
      {
        id: `product-line-${stringify(product.id)}`,
        value: product.productKey,
        class: "w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(productKeys);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let key = each_array[$$index];
          $$renderer3.option({ value: key }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(store_get($$store_subs ??= {}, "$settingsStore", settingsStore).pricingData[key].name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label${attr("for", `grade-${stringify(product.id)}`)} class="block text-xs font-medium text-slate-600 mb-1">Finish Grade</label> `);
    $$renderer2.select(
      {
        id: `grade-${stringify(product.id)}`,
        value: product.grade,
        class: "w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "regular" }, ($$renderer4) => {
          $$renderer4.push(`Regular (R)`);
        });
        $$renderer3.option({ value: "special" }, ($$renderer4) => {
          $$renderer4.push(`Special (S)`);
        });
        $$renderer3.option({ value: "ultra" }, ($$renderer4) => {
          $$renderer4.push(`Ultra (U)`);
        });
      }
    );
    $$renderer2.push(`</div> <div><label${attr("for", `profile-${stringify(product.id)}`)} class="block text-xs font-medium text-slate-600 mb-1">Profile</label> `);
    $$renderer2.select(
      {
        id: `profile-${stringify(product.id)}`,
        value: product.profile,
        class: "w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(Object.entries(PROFILE_LABELS));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let [key, label] = each_array_1[$$index_1];
          $$renderer3.option({ value: key }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label${attr("for", `qty-${stringify(product.id)}`)} class="block text-xs font-medium text-slate-600 mb-1">Linear Feet</label> <input${attr("id", `qty-${stringify(product.id)}`)} type="number" min="1"${attr("value", product.quantity)} class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-center"/></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { product, index });
  });
}
function calcBreakdown(quote, pricingData) {
  const { products, addons, marginProducts, marginAddons } = quote;
  const productLines = products.filter((p) => p.quantity > 0 && pricingData[p.productKey]).map((p) => {
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
  const addonLines = addons.filter((a) => a.checked && a.quantity > 0).map((a) => {
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
  const addonSubtotal = addonLines.reduce((s, l) => s + l.retailTotal, 0);
  return {
    productLines,
    addonLines,
    productSubtotal,
    addonSubtotal,
    grandTotal: productSubtotal + addonSubtotal
  };
}
function fmt(n) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}
function activeGrades(products) {
  return new Set(products.map((p) => p.grade));
}
function AddonGrid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let grades;
    function isDisabled(addon) {
      if (!addon.gradeRestriction) return false;
      return !grades.has(addon.gradeRestriction);
    }
    grades = activeGrades(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).products);
    $$renderer2.push(`<div class="section bg-slate-50 p-4 rounded-lg border border-slate-200"><h3 class="text-base font-semibold text-slate-700 mb-3 pb-2 border-b-2 border-slate-600">Add-ons &amp; Extras</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-2"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).addons);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let addon = each_array[$$index];
      const disabled = isDisabled(addon);
      $$renderer2.push(`<div${attr_class(`flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md transition-opacity ${stringify(disabled ? "addon-disabled" : "")}`)}><div class="flex items-center gap-2 min-w-0"><input type="checkbox"${attr("id", addon.id)}${attr("checked", addon.checked, true)}${attr("disabled", disabled, true)} class="w-4 h-4 accent-slate-600 shrink-0"/> <label${attr("for", addon.id)} class="text-xs font-medium text-slate-700 cursor-pointer truncate"${attr("title", `${stringify(addon.label)} ($${stringify(addon.costPrice.toFixed(2))})`)}>${escape_html(addon.label)} <span class="text-slate-400">($${escape_html(addon.costPrice.toFixed(2))})</span></label></div> <input type="number" min="1"${attr("value", addon.quantity)}${attr("disabled", disabled || !addon.checked, true)}${attr_class(`w-14 px-2 py-1 text-center border border-slate-300 rounded text-xs ${stringify(!addon.checked || disabled ? "opacity-40 pointer-events-none" : "")}`)}/></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function PricingSummary($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let breakdown, totalCost, marginPct, profitDollars;
    breakdown = calcBreakdown(store_get($$store_subs ??= {}, "$quoteStore", quoteStore), store_get($$store_subs ??= {}, "$settingsStore", settingsStore).pricingData);
    totalCost = [
      ...breakdown.productLines.map((l) => l.costEach * l.qty),
      ...breakdown.addonLines.map((l) => l.costEach * l.qty)
    ].reduce((a, b) => a + b, 0);
    marginPct = totalCost > 0 ? ((breakdown.grandTotal - totalCost) / breakdown.grandTotal * 100).toFixed(1) : null;
    profitDollars = breakdown.grandTotal - totalCost;
    $$renderer2.push(`<div class="section print-show bg-slate-50 p-4 rounded-lg border border-slate-200 pricing-summary"><h3 class="text-base font-semibold text-slate-700 mb-3 pb-2 border-b-2 border-slate-600">Pricing Summary</h3> `);
    if (breakdown.productLines.length === 0 && breakdown.addonLines.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-slate-400 italic text-center py-4">Add products above to see pricing</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-1 text-sm mb-3"><!--[-->`);
      const each_array = ensure_array_like(breakdown.productLines);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let line = each_array[$$index];
        $$renderer2.push(`<div class="flex justify-between"><span class="text-slate-600">${escape_html(line.label)} × ${escape_html(line.qty)} ft</span> <span class="font-mono font-medium">${escape_html(fmt(line.retailTotal))}</span></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (breakdown.addonLines.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="border-t border-slate-200 pt-1 mt-1"><!--[-->`);
        const each_array_1 = ensure_array_like(breakdown.addonLines);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let line = each_array_1[$$index_1];
          $$renderer2.push(`<div class="flex justify-between"><span class="text-slate-600">${escape_html(line.label)} × ${escape_html(line.qty)}</span> <span class="font-mono font-medium">${escape_html(fmt(line.retailTotal))}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="border-t-2 border-slate-300 pt-2 space-y-1">`);
      if (breakdown.productSubtotal > 0 && breakdown.addonSubtotal > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex justify-between text-sm text-slate-500"><span>Products subtotal</span> <span class="font-mono">${escape_html(fmt(breakdown.productSubtotal))}</span></div> <div class="flex justify-between text-sm text-slate-500"><span>Add-ons subtotal</span> <span class="font-mono">${escape_html(fmt(breakdown.addonSubtotal))}</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-between text-lg font-bold text-slate-900 pt-1 border-t border-slate-300"><span>Total (before tax)</span> <span class="font-mono">${escape_html(fmt(breakdown.grandTotal))}</span></div></div> `);
      if (!store_get($$store_subs ??= {}, "$clientMode", clientMode)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="no-print mt-3 pt-3 border-t border-dashed border-slate-200"><div class="flex items-center justify-between mb-2"><p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Internal Cost View</p> `);
        if (marginPct !== null) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(`text-xs font-bold px-2 py-0.5 rounded-full ${stringify(parseFloat(marginPct) >= 40 ? "bg-emerald-100 text-emerald-700" : parseFloat(marginPct) >= 25 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600")}`)}>${escape_html(marginPct)}% margin · ${escape_html(fmt(profitDollars))} profit</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="text-xs text-slate-500 space-y-1 bg-slate-100 rounded-md p-2.5"><!--[-->`);
        const each_array_2 = ensure_array_like(breakdown.productLines);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let line = each_array_2[$$index_2];
          $$renderer2.push(`<div class="flex justify-between"><span>${escape_html(line.label)} × ${escape_html(line.qty)} ft</span> <span class="font-mono">${escape_html(fmt(line.costEach * line.qty))} cost <span class="text-slate-400 ml-1">(×${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).marginProducts.toFixed(2))})</span></span></div>`);
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_3 = ensure_array_like(breakdown.addonLines);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let line = each_array_3[$$index_3];
          $$renderer2.push(`<div class="flex justify-between"><span>${escape_html(line.label)} × ${escape_html(line.qty)}</span> <span class="font-mono">${escape_html(fmt(line.costEach * line.qty))} cost <span class="text-slate-400 ml-1">(×${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).marginAddons.toFixed(2))})</span></span></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="flex justify-between font-semibold pt-1 border-t border-slate-200 text-slate-600"><span>Total cost</span> <span class="font-mono">${escape_html(fmt(totalCost))}</span></div></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CustomerForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="section bg-slate-50 p-5 rounded-lg border border-slate-200 no-print"><h3 class="text-base font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-slate-600">Customer Information</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="customer-name" class="block text-sm font-medium text-slate-700 mb-1">Customer Name</label> <input id="customer-name" type="text" placeholder="Enter customer name"${attr("value", store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name)} class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"/></div> <div><label for="customer-phone" class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label> <input id="customer-phone" type="tel" placeholder="(705) 555-0100"${attr("value", store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.phone)} class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"/></div> <div><label for="customer-email" class="block text-sm font-medium text-slate-700 mb-1">Email Address</label> <input id="customer-email" type="email" placeholder="customer@example.com"${attr("value", store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.email)} class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"/></div> <div><label for="customer-address" class="block text-sm font-medium text-slate-700 mb-1">Address</label> <input id="customer-address" type="text" placeholder="123 Main St"${attr("value", store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.address)} class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"/></div></div></div> <div class="print-only bg-slate-100 p-4 rounded-lg mb-4"><h3 class="text-base font-semibold mb-2">Customer Information</h3> <div class="text-sm leading-relaxed">`);
    if (store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p><strong>Name:</strong> ${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.phone) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p><strong>Phone:</strong> ${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.phone)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.email) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p><strong>Email:</strong> ${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.email)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.address) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p><strong>Address:</strong> ${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.address)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function GradeReferenceChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let query = "";
    $$renderer2.push(`<div class="section no-print bg-slate-50 p-5 rounded-lg border border-slate-200"><button class="w-full text-left flex items-center justify-between text-base font-semibold text-slate-700 pb-2 border-b-2 border-slate-600 mb-4"><span>Finish Grade Reference Chart</span> <span class="text-slate-500 text-sm">${escape_html("▼")}</span></button> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white border border-slate-200 rounded-lg p-3 mb-4"><label for="color-lookup" class="block text-xs font-semibold text-slate-500 tracking-wider mb-2">Look Up Colour Code</label> <div class="flex gap-2 items-center"><input id="color-lookup" type="text" placeholder="e.g. 38, DI, FXNG, SDU…"${attr("value", query)} class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"/> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="overflow-x-auto"><table class="w-full text-sm border-collapse"><thead><tr class="bg-slate-100"><th class="border border-slate-200 p-2 text-left font-semibold">Grade</th><th class="border border-slate-200 p-2 text-left font-semibold">Codes</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(COLOR_LOOKUP_DATA);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let g = each_array[$$index];
        $$renderer2.push(`<tr${attr_class(g.color)}><td class="p-2 border border-slate-200 font-semibold whitespace-nowrap">${escape_html(g.grade)} – ${escape_html(g.label)}</td><td class="p-2 border border-slate-200 font-mono text-xs">${escape_html(g.codes.join(", "))}</td></tr>`);
      }
      $$renderer2.push(`<!--]--><tr class="bg-amber-50 text-amber-800"><td class="p-2 border border-slate-200 font-semibold whitespace-nowrap">IM / VL</td><td class="p-2 border border-slate-200 font-mono text-xs">Special or Ultra (Arborite) — ambiguous</td></tr></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let pageTitle;
    pageTitle = store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name ? `Quote – ${store_get($$store_subs ??= {}, "$quoteStore", quoteStore).customerInfo.name}` : "Laminate Countertop Calculator";
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(pageTitle)} | RONA</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-4">`);
    GradeReferenceChart($$renderer2);
    $$renderer2.push(`<!----> `);
    CustomerForm($$renderer2);
    $$renderer2.push(`<!----> <div class="section bg-slate-50 p-4 rounded-lg border border-slate-200"><div class="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-600"><h2 class="text-base font-semibold text-slate-700">Products</h2> <span class="text-sm text-slate-500">${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).products.length)} product${escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).products.length !== 1 ? "s" : "")}</span></div> <div class="space-y-3"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).products);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let product = each_array[i];
      ProductRow($$renderer2, { product, index: i });
    }
    $$renderer2.push(`<!--]--></div> <button class="w-full mt-3 py-2.5 bg-slate-500 text-white rounded-md font-medium hover:bg-slate-600 transition-colors no-print text-sm">+ Add Another Product</button></div> `);
    AddonGrid($$renderer2);
    $$renderer2.push(`<!----> `);
    PricingSummary($$renderer2);
    $$renderer2.push(`<!----> `);
    if (!store_get($$store_subs ??= {}, "$clientMode", clientMode)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="section bg-slate-50 p-4 rounded-lg border border-slate-200 no-print"><h2 class="text-base font-semibold text-slate-700 mb-2 pb-2 border-b-2 border-slate-600">Internal Notes <span class="ml-2 text-xs font-normal text-slate-400 normal-case">(staff only)</span></h2> <textarea rows="3" placeholder="Notes hidden from client view…" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y">`);
      const $$body = escape_html(store_get($$store_subs ??= {}, "$quoteStore", quoteStore).notes);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
