<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { settingsStore, unsaved } from '$lib/stores';
  import { PROFILE_LABELS } from '$lib/constants';
  import type { ProductEntry, FinishGrade, ProfileType } from '$lib/types';

  export let product: ProductEntry;
  export let index: number;

  const dispatch = createEventDispatcher<{ remove: number; change: Partial<ProductEntry> }>();

  function change(fields: Partial<ProductEntry>) {
    dispatch('change', fields);
    unsaved.set(true);
  }

  $: productKeys = Object.keys($settingsStore.pricingData);

</script>

<div class="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">Product #{index + 1}</span>
    <button
      on:click={() => dispatch('remove', product.id)}
      class="text-slate-400 hover:text-red-500 transition-colors"
      title="Remove product"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>

  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
    <!-- Product line -->
    <div class="col-span-2 sm:col-span-1">
      <label class="block text-xs font-medium text-slate-600 mb-1">Product Line</label>
      <select
        value={product.productKey}
        on:change={(e) => change({ productKey: e.currentTarget.value })}
        class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        {#each productKeys as key}
          <option value={key}>{$settingsStore.pricingData[key].name}</option>
        {/each}
      </select>
    </div>

    <!-- Finish grade -->
    <div>
      <label class="block text-xs font-medium text-slate-600 mb-1">Finish Grade</label>
      <select
        value={product.grade}
        on:change={(e) => change({ grade: e.currentTarget.value as FinishGrade })}
        class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        <option value="regular">Regular (R)</option>
        <option value="special">Special (S)</option>
        <option value="ultra">Ultra (U)</option>
      </select>
    </div>

    <!-- Profile -->
    <div>
      <label class="block text-xs font-medium text-slate-600 mb-1">Profile</label>
      <select
        value={product.profile}
        on:change={(e) => change({ profile: e.currentTarget.value as ProfileType })}
        class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        {#each Object.entries(PROFILE_LABELS) as [key, label]}
          <option value={key}>{label}</option>
        {/each}
      </select>
    </div>

    <!-- Quantity -->
    <div>
      <label class="block text-xs font-medium text-slate-600 mb-1">Linear Feet</label>
      <input
        type="number"
        min="1"
        value={product.quantity}
        on:input={(e) => change({ quantity: Math.max(1, parseInt(e.currentTarget.value) || 1) })}
        class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-center"
      />
    </div>
  </div>
</div>
