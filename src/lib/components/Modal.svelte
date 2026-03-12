<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let title = '';
  export let maxWidth = 'max-w-2xl';

  const dispatch = createEventDispatcher();

  function close() { dispatch('close'); }

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 pt-10 overflow-y-auto"
  on:click={onBackdrop}
>
  <div class="bg-white rounded-xl shadow-2xl w-full {maxWidth} max-h-[85vh] flex flex-col">
    <!-- Header -->
    <div class="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between items-center shrink-0">
      <h2 class="text-lg font-semibold">{title}</h2>
      <button
        on:click={close}
        class="text-slate-400 hover:text-white text-2xl leading-none transition-colors"
      >&times;</button>
    </div>

    <!-- Body (scrollable) -->
    <div class="overflow-y-auto flex-1 p-6">
      <slot />
    </div>
  </div>
</div>
