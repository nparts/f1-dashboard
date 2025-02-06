<template>
    <v-card class="h-100">
      <v-card-title class="text-subtitle-1">
        Current Status
      </v-card-title>
      <v-card-text>
        <template v-if="hasActiveDriver">
          <DriverInfo :driver="currentDriver" />
          <CarConfig :config="carConfig" />
          <LiveStats :stats="liveStats" />
        </template>
        <template v-else>
          <v-alert
            type="info"
            variant="tonal"
            class="mt-4"
          >
            <div class="text-h6 mb-2">Simulator Available!</div>
            <div>Ready for the next champion to set a new record.</div>
          </v-alert>
        </template>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  // Dummy data - will be replaced with Pinia store
  const currentDriver = {
    name: 'Max Verstappen',
    currentLap: {
      lapNumber: 5,
      currentTime: 82345,
      sector1Time: 28456,
      sector2Time: null,
      sector3Time: null,
      currentSector: 2,
      deltaToPersonalBest: -234,
      deltaToBestEver: 567,
      invalidated: false
    }
  }
  
  const carConfig = {
    frontWing: 7,
    rearWing: 6,
    brakeBias: 54,
    differential: 75,
    tires: 'Soft'
  }

  interface LiveStats {
    speed: number;
    gear: number;
    rpm: number;
    drs: 'available' | 'active' | 'not_available';
    throttle: number;
    brake: number;
  }

  const liveStats = ref<LiveStats>({
    speed: 0,
    gear: 0,
    rpm: 0,
    drs: 'not_available',
    throttle: 0,
    brake: 0
  });
  
  const hasActiveDriver = computed(() => true) // Will be connected to store
  </script>
  
  