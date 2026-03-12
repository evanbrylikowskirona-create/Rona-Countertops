<script lang="ts">
  import { quoteStore, unsaved } from '$lib/stores';

  function update(field: keyof typeof $quoteStore.customerInfo, value: string) {
    quoteStore.setCustomerInfo({ [field]: value });
    unsaved.set(true);
  }
</script>

<div class="section bg-slate-50 p-5 rounded-lg border border-slate-200 no-print">
  <h3 class="text-base font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-slate-600">
    Customer Information
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
      <input
        type="text"
        placeholder="Enter customer name"
        value={$quoteStore.customerInfo.name}
        on:input={(e) => update('name', e.currentTarget.value)}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
      <input
        type="tel"
        placeholder="(705) 555-0100"
        value={$quoteStore.customerInfo.phone}
        on:input={(e) => update('phone', e.currentTarget.value)}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
      <input
        type="email"
        placeholder="customer@example.com"
        value={$quoteStore.customerInfo.email}
        on:input={(e) => update('email', e.currentTarget.value)}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
      <input
        type="text"
        placeholder="123 Main St"
        value={$quoteStore.customerInfo.address}
        on:input={(e) => update('address', e.currentTarget.value)}
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  </div>
</div>

<!-- Print-only customer block -->
<div class="print-only bg-slate-100 p-4 rounded-lg mb-4">
  <h3 class="text-base font-semibold mb-2">Customer Information</h3>
  <div class="text-sm leading-relaxed">
    {#if $quoteStore.customerInfo.name}<p><strong>Name:</strong> {$quoteStore.customerInfo.name}</p>{/if}
    {#if $quoteStore.customerInfo.phone}<p><strong>Phone:</strong> {$quoteStore.customerInfo.phone}</p>{/if}
    {#if $quoteStore.customerInfo.email}<p><strong>Email:</strong> {$quoteStore.customerInfo.email}</p>{/if}
    {#if $quoteStore.customerInfo.address}<p><strong>Address:</strong> {$quoteStore.customerInfo.address}</p>{/if}
  </div>
</div>
