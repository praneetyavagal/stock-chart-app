<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let enabledSMAs: Set<number> = new Set();

  const dispatch = createEventDispatcher();

  const smaOptions = [
    { period: 20, color: '#2196F3', label: 'SMA(20)' },
    { period: 50, color: '#9C27B0', label: 'SMA(50)' },
    { period: 100, color: '#FF9800', label: 'SMA(100)' },
    { period: 200, color: '#4CAF50', label: 'SMA(200)' }
  ];

  function toggleSMA(period: number) {
    const newSet = new Set(enabledSMAs);
    if (newSet.has(period)) {
      newSet.delete(period);
    } else {
      newSet.add(period);
    }
    dispatch('change', newSet);
  }
</script>

<div class="sma-toggles">
  <span class="toggles-label">Moving Averages:</span>
  <div class="toggle-buttons">
    {#each smaOptions as { period, color, label }}
      <button
        class="toggle-button"
        class:active={enabledSMAs.has(period)}
        style="--sma-color: {color}"
        on:click={() => toggleSMA(period)}
      >
        <span class="checkbox">
          {#if enabledSMAs.has(period)}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          {/if}
        </span>
        {label}
      </button>
    {/each}
  </div>
</div>

<style>
  .sma-toggles {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    flex-wrap: wrap;
  }

  .toggles-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .toggle-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .toggle-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-button:hover {
    border-color: var(--sma-color);
    color: var(--sma-color);
  }

  .toggle-button.active {
    background: var(--sma-color);
    border-color: var(--sma-color);
    color: white;
  }

  .checkbox {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 2px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .toggle-button:hover .checkbox {
    border-color: var(--sma-color);
  }

  .toggle-button.active .checkbox {
    background: white;
    border-color: white;
  }

  .checkbox svg {
    display: block;
  }

  .toggle-button.active .checkbox svg path {
    stroke: var(--sma-color);
  }
</style>