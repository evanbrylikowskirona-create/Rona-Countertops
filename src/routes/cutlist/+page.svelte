<script lang="ts">
  import { goto } from '$app/navigation';
  import { quoteStore, toastStore, unsaved } from '$lib/stores';
  import { STOCK_LENGTHS, CUT_COLORS } from '$lib/constants';
  import type { CutBoard } from '$lib/types';

  let inputVal = '';
  let cuts: number[] = [];
  let boards: CutBoard[] = [];
  let hasResults = false;

  const MAX_STOCK = Math.max(...STOCK_LENGTHS);

  function addCut() {
    const val = parseFloat(inputVal);
    if (!val || val <= 0 || val > MAX_STOCK) {
      toastStore.show(`Enter a value between 1 and ${MAX_STOCK}".`, 'warning');
      return;
    }
    cuts = [...cuts, val];
    inputVal = '';
  }

  function removeCut(i: number) {
    cuts = cuts.filter((_, idx) => idx !== i);
    if (!cuts.length) { hasResults = false; boards = []; }
  }

  function resetCutlist() {
    cuts = [];
    boards = [];
    hasResults = false;
    inputVal = '';
  }

  function optimize() {
    if (!cuts.length) return;
    const sorted = [...cuts].sort((a, b) => b - a);
    let result: CutBoard[] = [];

    sorted.forEach((cut) => {
      let best = -1, minWaste = Infinity;
      result.forEach((b, i) => {
        if (b.remaining >= cut && b.remaining - cut < minWaste) {
          minWaste = b.remaining - cut;
          best = i;
        }
      });
      if (best !== -1) {
        result[best].cuts.push(cut);
        result[best].remaining -= cut;
      } else {
        const stock = Math.min(...STOCK_LENGTHS.filter((s) => s >= cut));
        result.push({ total: stock, cuts: [cut], remaining: stock - cut });
      }
    });

    let changed = true;
    let iter = 0;
    const MAX_ITER = result.length * result.length + 10;
    while (changed && iter++ < MAX_ITER) {
      changed = false;
      outer: for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const combined = [...result[i].cuts, ...result[j].cuts];
          const total = combined.reduce((a, b) => a + b, 0);
          const stock = STOCK_LENGTHS.find((s) => s >= total);
          if (stock && stock <= result[i].total + result[j].total) {
            result[i] = { total: stock, cuts: combined, remaining: stock - total };
            result.splice(j, 1);
            changed = true;
            break outer;
          }
        }
      }
    }

    boards = result;
    hasResults = true;
  }

  function sendToCalculator() {
    if (!boards.length) { toastStore.show('Run the optimizer first.', 'warning'); return; }
    const totalFt = boards.reduce((sum, b) => sum + Math.ceil(b.total / 12), 0);

    quoteStore.update((q) => {
      const first = q.products[0];
      const updated = first
        ? { ...first, quantity: totalFt }
        : { id: 1, productKey: '2300_2700_Nova', grade: 'regular' as const, profile: 'vanity' as const, quantity: totalFt };
      return { ...q, products: [updated] };
    });

    unsaved.set(true);
    toastStore.show(`Sent ${boards.length} board(s) → ${totalFt} linear feet to calculator.`, 'info', 4000);
    goto('/');
  }

  $: totalStock   = boards.reduce((s, b) => s + b.total, 0);
  $: totalWaste   = boards.reduce((s, b) => s + b.remaining, 0);
  $: wastePercent = totalStock > 0 ? ((totalWaste / totalStock) * 100).toFixed(1) : '0.0';
</script>

<svelte:head><title>Cut List Optimizer | RONA</title></svelte:head>

<div class="max-w-2xl mx-auto space-y-4">

  <div class="bg-slate-600 text-white px-5 py-4 rounded-lg">
    <h1 class="text-xl font-semibold text-center">Cut List Optimizer</h1>
    <p class="text-slate-300 text-sm text-center mt-1">
      Enter your required cut lengths — the optimizer minimizes waste across stock sizes ({STOCK_LENGTHS.join('", ')}").
    </p>
  </div>

  <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-4">
    <div>
      <label for="cut-input" class="block text-sm font-semibold text-slate-700 mb-2">
        Add Cut Length <span class="font-normal text-slate-400">(inches, max {MAX_STOCK}")</span>
      </label>
      <div class="flex gap-2">
        <input
          id="cut-input"
          type="number"
          placeholder='e.g. 72"'
          bind:value={inputVal}
          on:keydown={(e) => e.key === 'Enter' && addCut()}
          class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          on:click={addCut}
          class="px-5 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >Add</button>
      </div>
    </div>

    {#if cuts.length > 0}
      <div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Cut List <span class="font-normal normal-case text-slate-400">({cuts.length} cut{cuts.length !== 1 ? 's' : ''})</span>
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {#each cuts as cut, i}
            <div class="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-md border border-slate-200">
              <span class="font-mono font-medium text-sm">{cut}"</span>
              <button
                on:click={() => removeCut(i)}
                aria-label="Remove {cut} inch cut"
                class="text-slate-400 hover:text-red-500 transition-colors ml-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="flex gap-2 pt-1">
      <button
        on:click={optimize}
        disabled={!cuts.length}
        class="flex-1 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-md font-bold text-sm transition-colors"
      >OPTIMIZE CUTS</button>
      {#if cuts.length > 0}
        <button
          on:click={resetCutlist}
          class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-md font-medium border border-slate-300 text-sm transition-colors"
        >Clear All</button>
      {/if}
    </div>
  </div>

  {#if hasResults}
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-4">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Stock</p>
          <p class="text-2xl font-mono font-bold text-slate-900 mt-1">{totalStock}"</p>
        </div>
        <div>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Waste</p>
          <p class="text-2xl font-mono font-bold text-orange-500 mt-1">{totalWaste.toFixed(1)}"</p>
        </div>
        <div>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Waste %</p>
          <p class="text-2xl font-mono font-bold mt-1
            {parseFloat(wastePercent) < 10 ? 'text-emerald-600' : parseFloat(wastePercent) < 20 ? 'text-amber-500' : 'text-red-500'}"
          >{wastePercent}%</p>
        </div>
      </div>

      <button
        on:click={sendToCalculator}
        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md font-bold text-sm transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Send to Calculator
      </button>

      <div class="space-y-4 pt-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Cut Plan — {boards.length} board{boards.length !== 1 ? 's' : ''}
        </p>
        {#each boards as board, bIdx}
          <div>
            <div class="flex justify-between items-end mb-1.5">
              <span class="text-sm font-bold text-slate-700">Top #{bIdx + 1}</span>
              <span class="text-xs font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                {board.total}" stock · {board.remaining.toFixed(1)}" waste
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200 h-12 shadow-sm">
              {#each board.cuts as cut, cIdx}
                <div
                  class="cut-segment flex items-center justify-center text-white text-xs font-bold border-r border-white/20 {CUT_COLORS[cIdx % CUT_COLORS.length]}"
                  style="width: {(cut / board.total * 100).toFixed(2)}%"
                  title='{cut}"'
                >{cut}"</div>
              {/each}
              {#if board.remaining > 0}
                <div
                  class="flex items-center justify-center text-slate-400 text-xs italic bg-slate-200"
                  style="width: {(board.remaining / board.total * 100).toFixed(2)}%"
                >{board.remaining.toFixed(1)}"</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if cuts.length === 0}
    <div class="bg-white rounded-lg border-2 border-dashed border-slate-300 p-16 text-center text-slate-400">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="font-medium">Add cut lengths above to get started</p>
      <p class="text-sm mt-1">Stock sizes available: {STOCK_LENGTHS.join('", ')}"</p>
    </div>
  {/if}

</div>
