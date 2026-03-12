<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { loadQuotes, deleteQuote, updateQuoteMeta } from '$lib/db';
  import { quoteStore, toastStore, unsaved } from '$lib/stores';
  import Modal from '$lib/components/Modal.svelte';
  import type { SavedQuote } from '$lib/types';

  let quotes: SavedQuote[] = [];
  let loading = true;
  let error = '';
  let search = '';
  let editingQuote: SavedQuote | null = null;
  let editNotes = '';

  onMount(async () => {
    try {
      quotes = await loadQuotes();
    } catch (e) {
      error = 'Failed to load quotes. Check your connection.';
    } finally {
      loading = false;
    }
  });

  $: filtered = quotes.filter((q) => {
    const s = search.toLowerCase();
    return (
      (q.quoteNumber ?? '').toLowerCase().includes(s) ||
      (q.customerInfo?.name ?? '').toLowerCase().includes(s) ||
      (q.customerInfo?.phone ?? '').toLowerCase().includes(s) ||
      (q.notes ?? '').toLowerCase().includes(s)
    );
  });

  function loadIntoCalculator(quote: SavedQuote) {
    quoteStore.set(quote);
    unsaved.set(false);
    toastStore.show(`Loaded quote ${quote.quoteNumber}`, 'success');
    goto('/');
  }

  async function handleDelete(id: string, quoteNumber: string) {
    if (!confirm(`Delete quote ${quoteNumber}? This cannot be undone.`)) return;
    try {
      await deleteQuote(id);
      quotes = quotes.filter((q) => q.id !== id);
      toastStore.show(`Quote ${quoteNumber} deleted.`, 'info');
    } catch {
      toastStore.show('Failed to delete quote.', 'error');
    }
  }

  function openEdit(quote: SavedQuote) {
    editingQuote = { ...quote };
    editNotes = quote.notes ?? '';
  }

  async function saveEdit() {
    if (!editingQuote) return;
    try {
      await updateQuoteMeta(editingQuote.id, {
        notes: editNotes,
        customerInfo: editingQuote.customerInfo
      });
      quotes = quotes.map((q) =>
        q.id === editingQuote!.id ? { ...q, notes: editNotes, customerInfo: editingQuote!.customerInfo } : q
      );
      toastStore.show('Quote updated.', 'success');
      editingQuote = null;
    } catch {
      toastStore.show('Failed to update quote.', 'error');
    }
  }

  function fmt(ts: number) {
    return new Date(ts).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<svelte:head><title>Saved Quotes | RONA</title></svelte:head>

<div class="max-w-3xl mx-auto">
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="bg-slate-700 text-white px-6 py-4">
      <h1 class="text-xl font-semibold">Saved Quotes</h1>
    </div>

    <div class="p-5">
      <!-- Search -->
      <div class="mb-4">
        <input
          type="search"
          placeholder="Search by name, quote #, phone or notes…"
          bind:value={search}
          class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {#if loading}
        <p class="text-center text-slate-400 py-10">Loading quotes…</p>
      {:else if error}
        <p class="text-center text-red-500 py-10">{error}</p>
      {:else if filtered.length === 0}
        <div class="text-center text-slate-400 py-16">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>{search ? 'No quotes match your search.' : 'No saved quotes yet.'}</p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each filtered as quote (quote.id)}
            <div class="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-mono font-semibold text-slate-800">{quote.quoteNumber}</span>
                    <span class="text-xs text-slate-400">{fmt(quote.updatedAt)}</span>
                  </div>
                  {#if quote.customerInfo?.name}
                    <p class="text-sm font-medium text-slate-700">{quote.customerInfo.name}</p>
                  {/if}
                  {#if quote.customerInfo?.phone}
                    <p class="text-xs text-slate-500">{quote.customerInfo.phone}</p>
                  {/if}
                  {#if quote.notes}
                    <p class="text-xs text-slate-400 mt-1 italic truncate max-w-xs">{quote.notes}</p>
                  {/if}
                </div>
                <div class="flex gap-2 shrink-0">
                  <button
                    on:click={() => loadIntoCalculator(quote)}
                    class="px-3 py-1.5 bg-slate-600 text-white text-xs font-medium rounded hover:bg-slate-700 transition-colors"
                  >Load</button>
                  <button
                    on:click={() => openEdit(quote)}
                    class="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-50 transition-colors"
                  >Edit</button>
                  <button
                    on:click={() => handleDelete(quote.id, quote.quoteNumber)}
                    class="px-3 py-1.5 bg-white border border-red-200 text-red-500 text-xs font-medium rounded hover:bg-red-50 transition-colors"
                  >Delete</button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Edit modal -->
{#if editingQuote}
  <Modal title="Edit Quote {editingQuote.quoteNumber}" on:close={() => (editingQuote = null)}>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>

          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
          <input
            type="text"
            bind:value={editingQuote.customerInfo.name}
            class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>

          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="text"
            bind:value={editingQuote.customerInfo.phone}
            class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          rows="4"
          bind:value={editNotes}
          class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
        ></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button
          on:click={() => (editingQuote = null)}
          class="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
        >Cancel</button>
        <button
          on:click={saveEdit}
          class="px-4 py-2 bg-slate-700 text-white rounded-md text-sm font-medium hover:bg-slate-800"
        >Save Changes</button>
      </div>
    </div>
  </Modal>
{/if}
