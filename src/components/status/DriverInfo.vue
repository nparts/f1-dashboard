<template>
    <div class="driver-info">
      <div class="text-h4 text-red-darken-4 font-weight-bold mb-2">
        {{ driver.name }}
      </div>
      <div class="d-flex gap-4 mb-4">
        <div>
          <div class="text-subtitle-2 text-grey">Current Lap</div>
          <div class="text-h6">{{ driver.currentLap.lapNumber }}</div>
        </div>
        <div>
          <div class="text-subtitle-2 text-grey">Sector</div>
          <div class="text-h6">S{{ driver.currentLap.currentSector }}</div>
        </div>
      </div>
      <v-chip
        v-if="driver.currentLap.invalidated"
        color="error"
        size="small"
        class="mb-4"
      >
        Lap Invalidated
      </v-chip>
    </div>
  </template>
  
  <script setup lang="ts">
  interface DriverProps {
    driver: {
      name: string;
      currentLap: {
        lapNumber: number;
        currentSector: number;
        invalidated: boolean;
      };
    };
  }
  
  defineProps<DriverProps>();
  </script>