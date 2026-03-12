<script lang="ts">
  import { quoteStore, unsaved } from '$lib/stores';
  import { activeGrades } from '$lib/pricing';

  $: grades = activeGrades($quoteStore.products);

  function isDisabled(addon: typeof $quoteStore.addons[0]): boolean {
    if (!addon.gradeRestriction) return false;
    return !grades.has(addon.gradeRestriction);
  }

  function toggle(id: string, checked: boolean) {
    quoteStore.updateAddon(id, { checked });
    unsaved.set(true);
  }

  function setQty(id: string, quantity: number) {
    quoteStore.updateAddon(id, { quantity: Math.max(1, quantity) });
    unsaved.set(true);
  }
</script>

<div class="section bg-slate-50 p-4 rounded-lg border border-slate-200">
  <h3 class="text-base font-semibold text-slate-700 mb-3 pb-2 border-b-2 border-slate-600">
    Add-ons &amp; Extras
  </h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {#each $quoteStore.addons as addon (addon.id)}
      {@const disabled = isDisabled(addon)}
      <div
        class="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md transition-opacity
               {disabled ? 'addon-disabled' : ''}"
      >
        <div class="flex items-center gap-2 min-w-0">
          <input
            type="checkbox"
            id={addon.id}
            checked={addon.checked}
            disabled={disabled}
            on:change={(e) => toggle(addon.id, e.currentTarget.checked)}
            class="w-4 h-4 accent-slate-600 shrink-0"
          />
          <label
            for={addon.id}
            class="text-xs font-medium text-slate-700 cursor-pointer truncate"
            title="{addon.label} (${addon.costPrice.toFixed(2)})"
          >
            {addon.label}
            <span class="text-slate-400">(${addon.costPrice.toFixed(2)})</span>
          </label>
        </div>
        <input
          type="number"
          min="1"
          value={addon.quantity}
          disabled={disabled || !addon.checked}
          on:input={(e) => setQty(addon.id, parseInt(e.currentTarget.value) || 1)}
          class="w-14 px-2 py-1 text-center border border-slate-300 rounded text-xs
                 {(!addon.checked || disabled) ? 'opacity-40 pointer-events-none' : ''}"
        />
      </div>
    {/each}
  </div>
</div>
