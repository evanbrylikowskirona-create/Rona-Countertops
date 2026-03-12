<script lang="ts">
  import { onMount } from 'svelte';
  import { settingsStore, toastStore } from '$lib/stores';
  import { loadSettings, saveSettings } from '$lib/db';
  import { DEFAULT_PRICING, DEFAULT_MARGIN_PRODUCTS, DEFAULT_MARGIN_ADDONS } from '$lib/constants';
  import type { FinishGrade, ProfileType } from '$lib/types';

  let loading = true;
  let saving = false;
  let settings = { ...$settingsStore };

  const grades: FinishGrade[] = ['regular', 'special', 'ultra'];
  const profiles: ProfileType[] = ['vanity', 'bar32', 'bar36'];
  const profileLabels = { vanity: 'Vanity/Kitchen (25½")', bar32: 'Bar Top 32"', bar36: 'Bar Top 36"' };

  onMount(async () => {
    try {
      const remote = await loadSettings();
      if (remote) {
        settings = remote;
        settingsStore.set(remote);
      }
    } catch {}
    loading = false;
  });

  async function handleSave() {
    saving = true;
    try {
      await saveSettings(settings);
      settingsStore.set(settings);
      toastStore.show('Settings saved!', 'success');
    } catch {
      toastStore.show('Failed to save settings.', 'error');
    } finally {
      saving = false;
    }
  }

  function handleReset() {
    if (!confirm('Reset all pricing to factory defaults?')) return;
    settings = {
      pricingData: structuredClone(DEFAULT_PRICING),
      marginProducts: DEFAULT_MARGIN_PRODUCTS,
      marginAddons: DEFAULT_MARGIN_ADDONS
    };
  }

  function addProduct() {
    const key = `custom_${Date.now()}`;
    settings.pricingData = {
      ...settings.pricingData,
      [key]: {
        name: 'New Product',
        regular: { vanity: 0, bar32: 0, bar36: 0 },
        special: { vanity: 0, bar32: 0, bar36: 0 },
        ultra:   { vanity: 0, bar32: 0, bar36: 0 }
      }
    };
  }

  function removeProduct(key: string) {
    if (!confirm('Remove this product line?')) return;
    const { [key]: _, ...rest } = settings.pricingData;
    settings.pricingData = rest;
  }

  function updatePrice(key: string, grade: FinishGrade, profile: ProfileType, val: string) {
    settings.pricingData = {
      ...settings.pricingData,
      [key]: {
        ...settings.pricingData[key],
        [grade]: {
          ...settings.pricingData[key][grade],
          [profile]: parseFloat(val) || 0
        }
      }
    };
  }

  function updateName(key: string, name: string) {
    settings.pricingData = {
      ...settings.pricingData,
      [key]: { ...settings.pricingData[key], name }
    };
  }
</script>

<svelte:head><title>Settings | RONA</title></svelte:head>

<div class="max-w-4xl mx-auto space-y-6">

  <!-- Margins card -->
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="bg-slate-700 text-white px-6 py-4">
      <h2 class="text-lg font-semibold">Markup Multipliers</h2>
      <p class="text-sm text-slate-300 mt-0.5">Applied to cost prices when generating retail quotes</p>
    </div>
    <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-medium text-slate-700 mb-1">Products multiplier (×)</label>
        <input
          type="number" step="0.01" min="1"
          bind:value={settings.marginProducts}
          class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <p class="text-xs text-slate-400 mt-1">Default: 1.99 (≈ 100% markup)</p>
      </div>
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-medium text-slate-700 mb-1">Add-ons multiplier (×)</label>
        <input
          type="number" step="0.01" min="1"
          bind:value={settings.marginAddons}
          class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <p class="text-xs text-slate-400 mt-1">Default: 1.50 (≈ 50% markup)</p>
      </div>
    </div>
  </div>

  <!-- Pricing data card -->
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="bg-slate-700 text-white px-6 py-4 flex justify-between items-center">
      <div>
        <h2 class="text-lg font-semibold">Product Pricing (Cost per Linear Foot)</h2>
        <p class="text-sm text-slate-300 mt-0.5">Prices are your cost — retail is calculated by the multiplier above</p>
      </div>
      <button
        on:click={addProduct}
        class="px-3 py-1.5 bg-slate-600 border border-slate-500 text-white text-sm rounded hover:bg-slate-500 transition-colors"
      >+ Add Product</button>
    </div>

    <div class="p-5 space-y-6">
      {#if loading}
        <p class="text-center text-slate-400 py-8">Loading…</p>
      {:else}
        {#each Object.entries(settings.pricingData) as [key, product]}
          <div class="border border-slate-200 rounded-lg overflow-hidden">
            <!-- Product name header -->
            <div class="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
              <input
                type="text"
                value={product.name}
                on:input={(e) => updateName(key, e.currentTarget.value)}
                class="font-semibold text-slate-800 bg-transparent border-0 border-b-2 border-transparent focus:border-slate-400 focus:outline-none text-sm w-full max-w-xs"
              />
              <button
                on:click={() => removeProduct(key)}
                class="text-red-400 hover:text-red-600 text-xs ml-4 shrink-0"
              >Remove</button>
            </div>

            <!-- Price grid -->
            <div class="p-4 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th class="text-left pb-2 pr-4">Grade</th>
                    {#each profiles as profile}
                      <th class="text-center pb-2 px-2">{profileLabels[profile]}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {#each grades as grade}
                    <tr>
                      <td class="py-2 pr-4 font-medium text-slate-700 capitalize">{grade}</td>
                      {#each profiles as profile}
                        <td class="py-2 px-2 text-center">
                          <div class="flex items-center justify-center">
                            <span class="text-slate-400 text-xs mr-1">$</span>
                            <input
                              type="number"
                              step="0.01" min="0"
                              value={product[grade][profile]}
                              on:input={(e) => updatePrice(key, grade, profile, e.currentTarget.value)}
                              class="w-20 px-2 py-1 text-center border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                            />
                          </div>
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- Action bar -->
  <div class="flex justify-between items-center pb-8">
    <button
      on:click={handleReset}
      class="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
    >Reset to Defaults</button>
    <button
      on:click={handleSave}
      disabled={saving}
      class="px-6 py-2 bg-slate-700 text-white rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
    >{saving ? 'Saving…' : 'Save Settings'}</button>
  </div>
</div>
