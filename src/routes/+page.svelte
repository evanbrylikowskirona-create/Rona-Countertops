<script lang="ts">
  import { quoteStore, settingsStore, unsaved, clientMode } from '$lib/stores';
  import ProductRow from '$lib/components/ProductRow.svelte';
  import AddonGrid from '$lib/components/AddonGrid.svelte';
  import PricingSummary from '$lib/components/PricingSummary.svelte';
  import CustomerForm from '$lib/components/CustomerForm.svelte';
  import GradeReferenceChart from '$lib/components/GradeReferenceChart.svelte';
  import { onMount } from 'svelte';
  import type { ProductEntry } from '$lib/types';

  let productIdCounter = 1;

  function addProduct() {
    const keys = Object.keys($settingsStore.pricingData);
    quoteStore.addProduct({
      id: productIdCounter++,
      productKey: keys[0] ?? '2300_2700_Nova',
      grade: 'regular',
      profile: 'bar36',
      quantity: 1
    });
    unsaved.set(true);
  }

  function reset() {
    quoteStore.reset();
    productIdCounter = 1;
    unsaved.set(false);
    addProduct();
  }

  onMount(() => {
    if ($quoteStore.products.length === 0) addProduct();
    // Listen for New Quote triggered from the navbar
    window.addEventListener('rona:newquote', reset);
    return () => window.removeEventListener('rona:newquote', reset);
  });

  $: pageTitle = $quoteStore.customerInfo.name
    ? `Quote – ${$quoteStore.customerInfo.name}`
    : 'Laminate Countertop Calculator';
</script>

<svelte:head>
  <title>{pageTitle} | RONA</title>
</svelte:head>

<div class="space-y-4">
  <GradeReferenceChart />
  <CustomerForm />

  <!-- Products -->
  <div class="section bg-slate-50 p-4 rounded-lg border border-slate-200">
    <div class="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-600">
      <h2 class="text-base font-semibold text-slate-700">Products</h2>
      <span class="text-sm text-slate-500">
        {$quoteStore.products.length} product{$quoteStore.products.length !== 1 ? 's' : ''}
      </span>
    </div>
    <div class="space-y-3">
      {#each $quoteStore.products as product, i (product.id)}
        <ProductRow
          {product}
          index={i}
          on:remove={(e) => { quoteStore.removeProduct(e.detail); unsaved.set(true); }}
          on:change={(e) => { quoteStore.updateProduct(product.id, e.detail); unsaved.set(true); }}
        />
      {/each}
    </div>
    <button
      on:click={addProduct}
      class="w-full mt-3 py-2.5 bg-slate-500 text-white rounded-md font-medium hover:bg-slate-600 transition-colors no-print text-sm"
    >+ Add Another Product</button>
  </div>

  <AddonGrid />
  <PricingSummary />

  <!-- Notes — hidden in client mode -->
  {#if !$clientMode}
    <div class="section bg-slate-50 p-4 rounded-lg border border-slate-200 no-print">
      <h2 class="text-base font-semibold text-slate-700 mb-2 pb-2 border-b-2 border-slate-600">
        Internal Notes
        <span class="ml-2 text-xs font-normal text-slate-400 normal-case">(staff only)</span>
      </h2>
      <textarea
        rows="3"
        placeholder="Notes hidden from client view…"
        value={$quoteStore.notes}
        on:input={(e) => { quoteStore.setNotes(e.currentTarget.value); unsaved.set(true); }}
        class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
      ></textarea>
    </div>
  {/if}
</div>
