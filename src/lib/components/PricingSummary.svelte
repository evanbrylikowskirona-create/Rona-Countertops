<script lang="ts">
  import { quoteStore, settingsStore, clientMode } from '$lib/stores';
  import { calcBreakdown, fmt } from '$lib/pricing';

  $: breakdown = calcBreakdown($quoteStore, $settingsStore.pricingData);

  $: totalCost = [
    ...breakdown.productLines.map(l => l.costEach * l.qty),
    ...breakdown.addonLines.map(l => l.costEach * l.qty)
  ].reduce((a, b) => a + b, 0);

  $: marginPct = totalCost > 0
    ? (((breakdown.grandTotal - totalCost) / breakdown.grandTotal) * 100).toFixed(1)
    : null;

  $: profitDollars = breakdown.grandTotal - totalCost;
</script>

<div class="section print-show bg-slate-50 p-4 rounded-lg border border-slate-200 pricing-summary">
  <h3 class="text-base font-semibold text-slate-700 mb-3 pb-2 border-b-2 border-slate-600">
    Pricing Summary
  </h3>

  {#if breakdown.productLines.length === 0 && breakdown.addonLines.length === 0}
    <p class="text-sm text-slate-400 italic text-center py-4">Add products above to see pricing</p>
  {:else}
    <!-- Line items -->
    <div class="space-y-1 text-sm mb-3">
      {#each breakdown.productLines as line}
        <div class="flex justify-between">
          <span class="text-slate-600">{line.label} × {line.qty} ft</span>
          <span class="font-mono font-medium">{fmt(line.retailTotal)}</span>
        </div>
      {/each}

      {#if breakdown.addonLines.length > 0}
        <div class="border-t border-slate-200 pt-1 mt-1">
          {#each breakdown.addonLines as line}
            <div class="flex justify-between">
              <span class="text-slate-600">{line.label} × {line.qty}</span>
              <span class="font-mono font-medium">{fmt(line.retailTotal)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Subtotals + grand total -->
    <div class="border-t-2 border-slate-300 pt-2 space-y-1">
      {#if breakdown.productSubtotal > 0 && breakdown.addonSubtotal > 0}
        <div class="flex justify-between text-sm text-slate-500">
          <span>Products subtotal</span>
          <span class="font-mono">{fmt(breakdown.productSubtotal)}</span>
        </div>
        <div class="flex justify-between text-sm text-slate-500">
          <span>Add-ons subtotal</span>
          <span class="font-mono">{fmt(breakdown.addonSubtotal)}</span>
        </div>
      {/if}
      <div class="flex justify-between text-lg font-bold text-slate-900 pt-1 border-t border-slate-300">
        <span>Total (before tax)</span>
        <span class="font-mono">{fmt(breakdown.grandTotal)}</span>
      </div>
    </div>

    <!-- Internal cost view — hidden in client mode + hidden on print -->
    {#if !$clientMode}
      <div class="no-print mt-3 pt-3 border-t border-dashed border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Internal Cost View</p>
          
          
          {#if marginPct !== null}
            <span class="text-xs font-bold px-2 py-0.5 rounded-full
              {parseFloat(marginPct) >= 40
                ? 'bg-emerald-100 text-emerald-700'
                : parseFloat(marginPct) >= 25
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-600'}">
              {marginPct}% margin · {fmt(profitDollars)} profit
            </span>
            {/if}

        </div>
        <div class="text-xs text-slate-500 space-y-1 bg-slate-100 rounded-md p-2.5">
          {#each breakdown.productLines as line}
            <div class="flex justify-between">
              <span>{line.label} × {line.qty} ft</span>
              <span class="font-mono">
                {fmt(line.costEach * line.qty)} cost
                <span class="text-slate-400 ml-1">(×{$quoteStore.marginProducts.toFixed(2)})</span>
              </span>
            </div>
          {/each}
          {#each breakdown.addonLines as line}
            <div class="flex justify-between">
              <span>{line.label} × {line.qty}</span>
              <span class="font-mono">
                {fmt(line.costEach * line.qty)} cost
                <span class="text-slate-400 ml-1">(×{$quoteStore.marginAddons.toFixed(2)})</span>
              </span>
            </div>
          {/each}
          <div class="flex justify-between font-semibold pt-1 border-t border-slate-200 text-slate-600">
            <span>Total cost</span>
            <span class="font-mono">{fmt(totalCost)}</span>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
