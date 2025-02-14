<template>
  <v-card
    v-if="lapData"
  >
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Lap {{ currentLapNumber }}</span>
      <span>Lap Information</span>
      <v-chip
        :color="currentLapValid ? 'success' : 'error'"
        size="small"
      >
        {{ currentLapValid ? 'Valid' : 'Invalid' }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <!-- Current Lap Time -->
      <div class="text-h4 text-center my-6">
        {{ formatTime(labTime) }}
      </div>

      <!-- Sector Times -->
      <v-row class="my-2">
        <v-col
          v-for="sector in sectors"
          cols="4"
        >
          <v-card
            variant="outlined"
            class="pa-2"
            :class="sector.color"
          >
            <div class="text-caption">
              {{ sector.name }}
            </div>
            <div class="text-body-1">
              {{ formatTime(sector.time) }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-card-text>
      <!-- No Data Message -->
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTelemetryStore } from '@/stores/telemetry';

const store = useTelemetryStore();
const { lapData, sessionHistory } = storeToRefs(store);

// Get player lap data
const playerCarIndex = computed(() => lapData?.value?.m_header?.player_car_index ?? -1);
const playerLapData = computed(() => store.lapData?.m_lapData[playerCarIndex.value]);

// Get current lap data
const labTime = computed(() => {
  if (!playerLapData.value) return 0;
  if (currentLapNumber.value !== 1 && currentLapTime.value < 5000) return playerLapData.value.m_lastLapTimeInMS;
  return currentLapTime.value;
});
const currentLapTime = computed(() => playerLapData.value?.m_currentLapTimeInMS || 0);
const currentLapNumber = computed(() => playerLapData.value?.m_currentLapNum || 0);
const currentSector = computed(() => playerLapData.value?.m_sector || 0);
const currentLapValid = computed(() => playerLapData.value?.m_currentLapInvalid === 0);

const showPreviousSectorTimes = ref(false);

const formatTime = (timeMs: number): string => {
  if (!timeMs) return '--:--:---';
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = timeMs % 1000;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

const sectors = computed(() => [
    {
      name: 'S1',
      time: getSectorTime(0),
      color: getSectorColor(0)
    },
    {
      name: 'S2',
      time: getSectorTime(1),
      color: getSectorColor(1)
    },
    {
      name: 'S3',
      time: getSectorTime(2),
      color: getSectorColor(2)
    }
  ]);

// Color helpers for sectors
const getSectorColor = (sectorIndex: number): string => {
  //  Don't color when no data
  if (!playerLapData.value) return '';

  // Don't color when lap not started
  if (currentSector.value === 0) return '';

  // Don't color current sector
  if (currentSector.value === sectorIndex) return '';

  const sectorTime = getSectorTime(sectorIndex)
  const bestSectorTime = bestSectorTimes.value[sectorIndex];

  // Don't color if sector time is 0
  if (!sectorTime) return '';

  // Check if this is the best sector
  if (sectorTime <= bestSectorTime) {
    return 'green';
  } else {
    return 'red';
  }
};

// Helper function to get sector time
const getSectorTime = (sectorIndex: number): number => {
  // Time 0 when no data
  if (!playerLapData.value) return 0;

  // When lap is not 0 and current sector is 0 and lap time is below 5 seconds show previous sector times.
  if (currentLapNumber.value !== 1 && currentSector.value === 0 && currentLapTime.value < 5000) {
    const lastLapData = sessionHistory.value?.m_lapHistoryData?.[currentLapNumber.value - 2];
    switch (sectorIndex) {
      case 0:
        return lastLapData?.m_sector1TimeInMS ?? 0;
      case 1:
        return lastLapData?.m_sector2TimeInMS ?? 0;
      case 2:
        return lastLapData?.m_sector3TimeInMS ?? 0;
      default:
        return 0;
    }
  } else {
    switch (sectorIndex) {
      case 0:
        return playerLapData.value.m_sector1TimeInMS;
      case 1:
        return playerLapData.value.m_sector2TimeInMS;
      default:
        return 0;
    }
  }
}

const bestSectorTimes = computed(() => {
  // If no lap history data, return 0 for all sectors
  if (!sessionHistory.value?.m_lapHistoryData) {
    return [0,0,0];
  }

  return sessionHistory.value.m_lapHistoryData.reduce((best, lap) => {
    if (lap.m_lapValidBitFlags & 0x02 && (!best[0] || lap.m_sector1TimeInMS < best[0])) {
      best[0] = lap.m_sector1TimeInMS;
    }
    if (lap.m_lapValidBitFlags & 0x04 && (!best[1] || lap.m_sector2TimeInMS < best[1])) {
      best[1] = lap.m_sector2TimeInMS;
    }
    if (lap.m_lapValidBitFlags & 0x08 && (!best[2] || lap.m_sector3TimeInMS < best[2])) {
      best[2] = lap.m_sector3TimeInMS;
    }
    return best;
  }, [0,0,0]);
});

</script>

<style scoped>
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
</style>
