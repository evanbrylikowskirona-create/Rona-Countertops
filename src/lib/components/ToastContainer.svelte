<script lang="ts">
  import { toastStore } from '$lib/stores';

  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const colors = {
    success: 'bg-slate-700',
    error:   'bg-red-700',
    info:    'bg-teal-700',
    warning: 'bg-amber-700'
  };
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
  {#each $toastStore as toast (toast.id)}
    <div
      class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg pointer-events-auto max-w-xs
             {colors[toast.type]} {toast.removing ? 'toast-leave' : 'toast-enter'}"
    >
      <span class="text-base">{icons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  {/each}
</div>
