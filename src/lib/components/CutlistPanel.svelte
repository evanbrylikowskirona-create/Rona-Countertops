<script lang="ts">
  import { quoteStore, toastStore, unsaved } from '$lib/stores';
  import { STOCK_LENGTHS, CUT_COLORS } from '$lib/constants';
  import type { CutBoard } from '$lib/types';

  let open = false;
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

    // Consolidation pass
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

    // Replace all products with a single row at the total linear footage
    quoteStore.update((q) => {
      const firstProduct = q.products[0];
      const newProduct = firstProduct
        ? { ...firstProduct, quantity: totalFt }
        : { id: 1, productKey: Object.keys(q.products)[0] ?? '2300_2700_Nova', grade: 'regular' as const, profile: 'bar36' as const, quantity: totalFt };
      return { ...q, products: [newProduct] };
    });

    unsaved.set(true);
    toastStore.show(`Sent ${boards.length} board(s) → ${totalFt} linear feet.`, 'info', 4000);
  }

  $: totalStock = boards.reduce((s, b) => s + b.total, 0);
  $: totalWaste  = boards.reduce((s, b) => s + b.remaining, 0);
  $: wastePercent = totalStock > 0 ? ((totalWaste / totalStock) * 100).toFixed(1) : '0.0';
</script>

<div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-6">
  <!-- Toggle header -->
  <button
    class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
    on:click={() => (open = !open)}
  >
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 6h16M4 10h16M4 14h8M4 18h8" />
      </svg>
      <span class="font-semibold text-slate-700">Cut List Optimizer</span>
      {#if cuts.length > 0}
        <span class="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{cuts.length} cut{cuts.length !== 1 ? 's' : ''}</span>
      {/if}
    </div>
    <span class="text-slate-400 text-sm">{open ? '▲' : '▼'}</span>
  </button>

  {#if open}
    <div class="p-5 space-y-4">
      <!-- Input row -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Add Cut Length (inches, max {MAX_STOCK}")
        </label>
        <div class="flex gap-2">
          <input
            type="number"
            placeholder='e.g. 72"'
            bind:value={inputVal}
            on:keydown={(e) => e.key === 'Enter' && addCut()}
            class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            on:click={addCut}
            class="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
          >Add</button>
        </div>
      </div>

      <!-- Cut list chips -->
      {#if cuts.length > 0}
        <div class="space-y-2">
          {#each cuts as cut, i}
            <div class="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-slate-200">
              <span class="font-mono font-medium text-sm">{cut}"</span>
              <button on:click={() => removeCut(i)} class="text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Action buttons -->
      <div class="flex gap-2">
        <button
          on:click={optimize}
          disabled={!cuts.length}
          class="flex-1 bg-slate-600 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-md font-bold text-sm transition-colors"
        >OPTIMIZE CUTS</button>
        <button
          on:click={resetCutlist}
          class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-md font-medium border border-slate-300 text-sm transition-colors"
        >Clear</button>
      </div>

      <!-- Results -->
      {#if hasResults}
        <!-- Stats -->
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-3 gap-3 text-center">
          <div>
            <p class="text-[10px] font-bold text-slate-500 uppercase">Total Stock</p>
            <p class="text-lg font-mono font-bold text-slate-900">{totalStock}"</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-500 uppercase">Waste</p>
            <p class="text-lg font-mono font-bold text-orange-600">{totalWaste.toFixed(1)}"</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-500 uppercase">Waste %</p>
            <p class="text-lg font-mono font-bold text-slate-900">{wastePercent}%</p>
          </div>
        </div>

        <button
          on:click={sendToCalculator}
          class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-md font-bold text-sm transition-colors"
        >↑ Send to Calculator</button>

        <!-- Board diagrams -->
        <div class="space-y-4">
          {#each boards as board, bIdx}
            <div>
              <div class="flex justify-between items-end mb-1">
                <span class="text-xs font-bold text-slate-700">Top #{bIdx + 1}</span>
                <span class="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600">{board.total}" Stock</span>
              </div>
              <div class="w-full bg-slate-100 rounded-md overflow-hidden flex border border-slate-200 shadow-sm h-10">
                {#each board.cuts as cut, cIdx}
                  <div
                    class="cut-segment flex items-center justify-center text-white text-xs font-bold border-r border-white/20 {CUT_COLORS[cIdx % CUT_COLORS.length]}"
                    style="width: {(cut / board.total * 100).toFixed(2)}%"
                  >{cut}"</div>
                {/each}
                {#if board.remaining > 0}
                  <div
                    class="flex items-center justify-center text-slate-500 text-[10px] font-medium italic bg-slate-200"
                    style="width: {(board.remaining / board.total * 100).toFixed(2)}%"
                  >{board.remaining.toFixed(1)}"</div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center text-slate-400">
          <svg class="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm">Add cuts and hit Optimize</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
