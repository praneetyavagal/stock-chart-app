<script lang="ts">
  import { selectedPeriod, periodOptions } from '../stores/stockData';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let showCustomDialog = false;
  let customStartDate = '';
  let customEndDate = '';
  
  function selectPeriod(option: typeof periodOptions[0]) {
    if (option.value === 'custom') {
      showCustomDialog = true;
      const end = new Date();
      const start = new Date();
      start.setFullYear(end.getFullYear() - 1);
      
      customEndDate = end.toISOString().split('T')[0];
      customStartDate = start.toISOString().split('T')[0];
    } else {
      selectedPeriod.set(option);
      dispatch('periodChange', option);
    }
  }
  
  function applyCustomPeriod() {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const customOption = {
      label: 'Custom',
      value: 'custom',
      days,
      startDate: start,
      endDate: end
    };
    
    selectedPeriod.set(customOption);
    dispatch('periodChange', customOption);
    showCustomDialog = false;
  }
</script>

<div class="flex gap-2 items-center flex-wrap">
  <span class="text-sm font-medium text-gray-700">Period:</span>
  <div class="flex gap-1">
    {#each periodOptions as option}
      <button
        class="px-3 py-1 text-sm rounded-md border transition-all duration-200
          {$selectedPeriod.value === option.value 
            ? 'bg-blue-500 text-white border-blue-500' 
            : 'bg-white border-gray-300 hover:bg-gray-50'}"
        on:click={() => selectPeriod(option)}
      >
        {option.label}
      </button>
    {/each}
  </div>
</div>

{#if showCustomDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Select Date Range</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            bind:value={customStartDate}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            bind:value={customEndDate}
            max={new Date().toISOString().split('T')[0]}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div class="flex gap-2 mt-6">
        <button
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          on:click={applyCustomPeriod}
        >
          Apply
        </button>
        <button
          class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          on:click={() => showCustomDialog = false}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}