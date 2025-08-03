<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import dayjs from 'dayjs';
  import type { PeriodOption } from '../types/stock';

  export let startDate: Date;
  export let endDate: Date;

  const dispatch = createEventDispatcher();

  const periodOptions: PeriodOption[] = [
    { label: '1D', value: '1D', days: 1 },
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '6M', value: '6M', days: 180 },
    { label: '1Y', value: '1Y', days: 365 },
    { label: '2Y', value: '2Y', days: 730 },
    { label: '5Y', value: '5Y', days: 1825 }
  ];

  let selectedPeriod = '1Y';
  let showCustomDatePicker = false;
  let customStartDate = dayjs(startDate).format('YYYY-MM-DD');
  let customEndDate = dayjs(endDate).format('YYYY-MM-DD');

  function selectPeriod(option: PeriodOption) {
    selectedPeriod = option.value;
    showCustomDatePicker = false;
    const end = new Date();
    const start = dayjs(end).subtract(option.days, 'day').toDate();
    dispatch('change', { startDate: start, endDate: end });
  }

  function openCustomDatePicker() {
    showCustomDatePicker = true;
    selectedPeriod = '';
  }

  function applyCustomDates() {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    dispatch('change', { startDate: start, endDate: end });
    showCustomDatePicker = false;
  }

  function cancelCustomDates() {
    showCustomDatePicker = false;
    customStartDate = dayjs(startDate).format('YYYY-MM-DD');
    customEndDate = dayjs(endDate).format('YYYY-MM-DD');
  }
</script>

<div class="period-selector">
  <div class="period-buttons">
    {#each periodOptions as option}
      <button
        class="period-button"
        class:active={selectedPeriod === option.value}
        on:click={() => selectPeriod(option)}
      >
        {option.label}
      </button>
    {/each}
    <button
      class="period-button custom-button"
      class:active={showCustomDatePicker}
      on:click={openCustomDatePicker}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
      </svg>
      Custom
    </button>
  </div>

  {#if showCustomDatePicker}
    <div class="custom-date-picker">
      <div class="date-inputs">
        <div class="date-input-group">
          <label for="start-date">From:</label>
          <input
            id="start-date"
            type="date"
            bind:value={customStartDate}
            max={customEndDate}
          />
        </div>
        <div class="date-input-group">
          <label for="end-date">To:</label>
          <input
            id="end-date"
            type="date"
            bind:value={customEndDate}
            min={customStartDate}
            max={dayjs().format('YYYY-MM-DD')}
          />
        </div>
      </div>
      <div class="date-actions">
        <button class="apply-button" on:click={applyCustomDates}>Apply</button>
        <button class="cancel-button" on:click={cancelCustomDates}>Cancel</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .period-selector {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
  }

  .period-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .period-button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .period-button:hover {
    border-color: #2196F3;
    color: #2196F3;
  }

  .period-button.active {
    background: #2196F3;
    border-color: #2196F3;
    color: white;
  }

  .custom-button {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .custom-date-picker {
    margin-top: 15px;
    padding: 15px;
    background: white;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  .date-inputs {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  .date-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .date-input-group label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .date-input-group input {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
  }

  .date-input-group input:focus {
    outline: none;
    border-color: #2196F3;
  }

  .date-actions {
    display: flex;
    gap: 10px;
  }

  .apply-button,
  .cancel-button {
    padding: 8px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .apply-button {
    background: #2196F3;
    color: white;
    border: none;
  }

  .apply-button:hover {
    background: #1976D2;
  }

  .cancel-button {
    background: white;
    color: #666;
    border: 1px solid #ddd;
  }

  .cancel-button:hover {
    background: #f5f5f5;
  }
</style>