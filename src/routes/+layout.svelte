<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import { unsaved, clientMode, quoteStore, toastStore } from '$lib/stores';
  import { nextQuoteNumber, saveQuote } from '$lib/db';

  const navLinks = [
    { href: '/',         label: 'Calculator' },
    { href: '/cutlist',  label: 'Cut List'   },
    { href: '/quotes',   label: 'Quotes'     },
    { href: '/settings', label: 'Settings'   }
  ];

  $: onCalculator = $page.url.pathname === '/';

  // ── Quote actions (only wired up on calculator page) ─────────────────────
  let saving = false;

  async function handleSave() {
    saving = true;
    try {
      const q = $quoteStore;
      const id = q.id ?? crypto.randomUUID();
      const quoteNumber = q.quoteNumber ?? nextQuoteNumber();
      const now = Date.now();
      await saveQuote({ ...q, id, quoteNumber, createdAt: q.createdAt ?? now, updatedAt: now });
      quoteStore.update((s) => ({ ...s, id, quoteNumber, createdAt: s.createdAt ?? now }));
      unsaved.set(false);
      toastStore.show(`Quote ${quoteNumber} saved!`, 'success');
    } catch {
      toastStore.show('Failed to save. Check your connection.', 'error');
    } finally {
      saving = false;
    }
  }

  function handlePrint() { window.print(); }

  function handleNew() {
    if ($unsaved && !confirm('Discard unsaved changes and start a new quote?')) return;
    // Signal the calculator page to reset via a custom event
    window.dispatchEvent(new CustomEvent('rona:newquote'));
  }

  // ── Client mode toggle + Escape shortcut ─────────────────────────────────
  function toggleClientMode() {
    clientMode.update((v) => !v);
    toastStore.show(
      $clientMode ? 'Client mode — internal info hidden' : 'Staff mode — all info visible',
      'info',
      2000
    );
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') toggleClientMode();
  }

  // ── Quote label for navbar ────────────────────────────────────────────────
  $: quoteLabel = $quoteStore.quoteNumber
    ? $quoteStore.customerInfo.name
      ? `${$quoteStore.quoteNumber} · ${$quoteStore.customerInfo.name}`
      : $quoteStore.quoteNumber
    : $quoteStore.customerInfo.name || null;
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="min-h-screen bg-slate-100 flex flex-col">

  <!-- ── Top nav ─────────────────────────────────────────────────────────── -->
  <nav class="bg-slate-800 text-white shadow-md no-print sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

      <!-- Brand -->
      <span class="font-bold text-base tracking-tight whitespace-nowrap mr-1">RONA Countertops</span>

      <!-- Nav tabs -->
      <div class="flex items-center gap-0.5">
        {#each navLinks as link}
          <a
            href={link.href}
            class="px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap
                   {$page.url.pathname === link.href
                     ? 'bg-slate-600 text-white'
                     : 'text-slate-300 hover:bg-slate-700 hover:text-white'}"
          >{link.label}</a>
        {/each}
      </div>

      <!-- Quote name badge -->
      {#if quoteLabel}
        <span class="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-700/60 border border-slate-600 rounded-full px-3 py-1 max-w-50 truncate">
          <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="truncate">{quoteLabel}</span>
        </span>
      {/if}

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Unsaved badge -->
      {#if $unsaved}
        <span class="hidden sm:flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-300/10 border border-amber-300/30 rounded-full px-2.5 py-1 whitespace-nowrap">
          ● Unsaved
        </span>
      {/if}

      <!-- Context buttons — only on calculator page -->
      {#if onCalculator}
        <div class="flex items-center gap-1">
          <button
            on:click={handleSave}
            disabled={saving}
            title="Save quote (Ctrl+S)"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded text-xs font-medium transition-colors disabled:opacity-50"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            on:click={handlePrint}
            title="Print quote"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded text-xs font-medium transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Print
          </button>
          <button
            on:click={handleNew}
            title="New quote"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded text-xs font-medium transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New
          </button>
        </div>
      {/if}

      <!-- Client mode toggle — always visible -->
      <button
        on:click={toggleClientMode}
        title="{$clientMode ? 'Switch to staff view (Esc)' : 'Switch to client view (Esc)'}"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors whitespace-nowrap
               {$clientMode
                 ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                 : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white'}"
      >
        {#if $clientMode}
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Client View
        {:else}
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
          </svg>
          Staff View
        {/if}
      </button>

    </div>
  </nav>

  <!-- Print-only header -->
  <div class="print-only text-center font-semibold py-2 text-lg">
    Rona McGaughey North Bay — 705-474-4400
  </div>

  <!-- Page content -->
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
    <slot />
  </main>
</div>

<ToastContainer />
