<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTelemetryStore } from '@/stores/telemetry';
import type { LapHistoryData } from '@/types/telemetry';

const store = useTelemetryStore();
const { lapData } = storeToRefs(store);
const playerCarIndex = computed(() => lapData?.value?.m_header?.player_car_index ?? 0);

interface SectorTimes {
  s1: number;
  s2: number;
  s3: number;
}

const previousSectorTimes = ref<SectorTimes>({ s1: 0, s2: 0, s3: 0 });
const showPreviousSectorTimes = ref(false);
const transitionTimer = ref<number | null>(null);

const formatTime = (timeMs: number): string => {
  if (!timeMs) return '--:--:---';
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = timeMs % 1000;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

const playerLapData = computed(() => store.lapData?.m_lapData[playerCarIndex.value]);

// Helper function to get sector time safely with proper typing
const getSectorTime = (sectorNumber: 1 | 2 | 3): number => {
  if (!playerLapData.value) return 0;
  
  const sectorTimeMap = {
    1: playerLapData.value.m_sector1TimeInMS,
    2: playerLapData.value.m_sector2TimeInMS,
    3: playerLapData.value.m_currentLapTimeInMS - 
       (playerLapData.value.m_sector1TimeInMS + playerLapData.value.m_sector2TimeInMS) // Calculate sector 3 time
  };
  
  return sectorTimeMap[sectorNumber] || 0;
};

const currentLapTime = computed(() => playerLapData.value?.m_currentLapTimeInMS || 0);
const currentLapNumber = computed(() => playerLapData.value?.m_currentLapNum || 0);
const isCurrentLapValid = computed(() => playerLapData.value?.m_currentLapInvalid === 0);
const currentSector = computed(() => playerLapData.value?.m_sector || 0);

// Calculate current sector time
const currentSectorTime = computed(() => {
  if (!playerLapData.value) return 0;

  switch (currentSector.value) {
    case 0: // Sector 1
      return playerLapData.value.m_currentLapTimeInMS;
    case 1: // Sector 2
      return playerLapData.value.m_currentLapTimeInMS - playerLapData.value.m_sector1TimeInMS;
    case 2: // Sector 3
      return playerLapData.value.m_currentLapTimeInMS -
        playerLapData.value.m_sector1TimeInMS -
        playerLapData.value.m_sector2TimeInMS;
    default:
      return 0;
  }
});

// Function to determine sector color
const getCurrentSectorColor = (sector: number): string => {
  if (currentSector.value === sector) {
    return 'green';
  }
  return '';
};
</script>

<template>
  <v-card
    v-if="lapData"
    class="lap-data-card"
  >
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Lap {{ currentLapNumber }}</span>
      <span>Lap Information</span>
      <v-chip
        :color="isCurrentLapValid ? 'success' : 'error'"
        size="small"
      >
        {{ isCurrentLapValid ? 'Valid' : 'Invalid' }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <!-- Current Lap Time -->
      <div class="text-h4 text-center my-2">
        {{ formatTime(currentLapTime) }}
      </div>

      <!-- Sector Times -->
      <v-row class="my-2">
        <v-col
          v-for="sector in [1, 2, 3]"
          :key="sector"
          cols="4"
        >
          <v-card
            variant="outlined"
            class="pa-2"
            :class="getCurrentSectorColor(sector - 1)"
          >
            <div class="text-caption">
              S{{ sector }}
            </div>
            <div class="text-body-1">
              <template v-if="currentSector === sector - 1">
                {{ formatTime(currentSectorTime) }}
              </template>
              <template v-else-if="showPreviousSectorTimes && sector - 1 < currentSector">
                {{ formatTime(previousSectorTimes[`s${sector}` as keyof SectorTimes]) }}
              </template>
              <template v-else>
                {{ formatTime(getSectorTime(sector as 1 | 2 | 3)) }}
              </template>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-card-text>
      <v-alert
        type="info"
        variant="tonal"
        class="mt-2"
      >
        Waiting for lap data...
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.lap-data-card {
  height: 100%;
}

.green {
  color: rgb(0, 255, 0) !important;
  border: 2px solid rgb(0, 255, 0) !important;
}

.red {
  color: rgb(255, 0, 0) !important;
  border: 2px solid rgb(255, 0, 0) !important;
}

.purple {
  color: rgb(128, 0, 128) !important;
  border: 2px solid rgb(128, 0, 128) !important;
}

.best-lap {
  background-color: rgba(0, 255, 0, 0.1);
}
</style>