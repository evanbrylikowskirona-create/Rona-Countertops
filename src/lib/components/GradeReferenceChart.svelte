<script lang="ts">
  import { COLOR_LOOKUP_DATA, COLOR_AMBIGUOUS } from '$lib/constants';

  let collapsed = false;
  let query = '';
  let result: { color: string; text: string } | null = null;

  function lookup() {
    const raw = query.trim().toUpperCase();
    if (!raw) { result = null; return; }

    if (COLOR_AMBIGUOUS[raw]) {
      result = { color: 'border-amber-400 bg-amber-50 text-amber-800', text: `${raw} can be: ${COLOR_AMBIGUOUS[raw].join(' or ')}` };
      return;
    }

    for (const g of COLOR_LOOKUP_DATA) {
      if (g.codes.includes(raw)) {
        result = { color: g.color, text: `Grade ${g.grade} — ${g.label}` };
        return;
      }
    }

    result = { color: 'border-red-300 bg-red-50 text-red-700', text: `Code "${raw}" not found. Check the table below.` };
  }

  function clear() {
    query = '';
    result = null;
  }
</script>

<div class="section no-print bg-slate-50 p-5 rounded-lg border border-slate-200">
  <button
    class="w-full text-left flex items-center justify-between text-base font-semibold text-slate-700 pb-2 border-b-2 border-slate-600 mb-4"
    on:click={() => (collapsed = !collapsed)}
  >
    <span>Finish Grade Reference Chart</span>
    <span class="text-slate-500 text-sm">{collapsed ? '▶' : '▼'}</span>
  </button>

  {#if !collapsed}
    <div class="bg-white border border-slate-200 rounded-lg p-3 mb-4">
      <label for="color-lookup" class="block text-xs font-semibold text-slate-500 tracking-wider mb-2">Look Up Colour Code</label>
      <div class="flex gap-2 items-center">
        <input
          id="color-lookup"
          type="text"
          placeholder="e.g. 38, DI, FXNG, SDU…"
          bind:value={query}
          on:input={lookup}
          class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        {#if query}
          <button on:click={clear} aria-label="Clear" class="text-slate-400 hover:text-slate-600 text-xl leading-none px-1">×</button>
        {/if}
      </div>
      {#if result}
        <div class="mt-2 px-3 py-2 rounded-md border text-sm font-semibold {result.color}">
          {result.text}
        </div>
      {/if}
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-slate-100">
            <th class="border border-slate-200 p-2 text-left font-semibold">Grade</th>
            <th class="border border-slate-200 p-2 text-left font-semibold">Codes</th>
          </tr>
        </thead>
        <tbody>
          {#each COLOR_LOOKUP_DATA as g}
            <tr class="{g.color}">
              <td class="p-2 border border-slate-200 font-semibold whitespace-nowrap">{g.grade} – {g.label}</td>
              <td class="p-2 border border-slate-200 font-mono text-xs">{g.codes.join(', ')}</td>
            </tr>
          {/each}
          <tr class="bg-amber-50 text-amber-800">
            <td class="p-2 border border-slate-200 font-semibold whitespace-nowrap">IM / VL</td>
            <td class="p-2 border border-slate-200 font-mono text-xs">Special or Ultra (Arborite)</td>
          </tr>
        </tbody>
      </table>
    </div>
  {/if}
</div>
