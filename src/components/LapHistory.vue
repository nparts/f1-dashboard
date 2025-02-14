<template>
  <v-card>
    <v-card-text>
      <!-- Lap History -->
      <v-table
        density="compact"
        class="mt-4"
      >
        <thead>
          <tr>
            <th>Lap</th>
            <th>S1</th>
            <th>S2</th>
            <th>S3</th>
            <th>Time</th>
            <th>Valid</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(lap, index) in lastTenLaps"
            :key="index"
            :class="{ 'best-lap': lap.m_lapTimeInMS === bestLapTime }"
          >
            <td>{{ currentLapNumber - index - 1 }}</td>
            <td :class="getHistoricalSectorColor(lap, 0)">
              {{ formatTime(lap.m_sector1TimeInMS) }}
            </td>
            <td :class="getHistoricalSectorColor(lap, 1)">
              {{ formatTime(lap.m_sector2TimeInMS) }}
            </td>
            <td :class="getHistoricalSectorColor(lap, 2)">
              {{ formatTime(lap.m_sector3TimeInMS) }}
            </td>
            <td>
              {{ formatTime(lap.m_lapTimeInMS) }}
            </td>
            <td>
              <v-icon
                :color="lap.m_lapValidBitFlags & 0x01 ? 'success' : 'error'"
                size="small"
              >
                {{ lap.m_lapValidBitFlags & 0x01 ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTelemetryStore } from '@/stores/telemetry';
import type { LapHistoryData } from '@/types/telemetry';

const store = useTelemetryStore();
const { sessionHistory, lapData } = storeToRefs(store);

// Get player lap data
const playerCarIndex = computed(() => lapData?.value?.m_header?.player_car_index ?? -1);
const playerLapData = computed(() => store.lapData?.m_lapData[playerCarIndex.value]);

// Get lap history data
const lapHistoryData = computed(() => sessionHistory.value?.m_lapHistoryData ?? []);

const currentLapNumber = computed(() => playerLapData.value?.m_currentLapNum || 0);

// Get last 10 laps
const lastTenLaps = computed(() => {
  return [...lapHistoryData.value]
    .filter(lap => lap.m_lapTimeInMS > 0)
    .slice(-10)
    .reverse();
});

const formatTime = (timeMs: number): string => {
  if (!timeMs) return '--:--:---';
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = timeMs % 1000;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

const getHistoricalSectorColor = (lap: LapHistoryData, sectorIndex: number): string => {
  const sectorTime = sectorIndex === 0 ? lap.m_sector1TimeInMS :
    sectorIndex === 1 ? lap.m_sector2TimeInMS :
      lap.m_sector3TimeInMS;

  const sectorValid = sectorIndex === 0 ? lap.m_lapValidBitFlags & 0x02 :
    sectorIndex === 1 ? lap.m_lapValidBitFlags & 0x04 :
      lap.m_lapValidBitFlags & 0x08;

  if (!sectorTime || !sectorValid) return '';

  const bestSectorTime = sectorIndex ?? bestSectorTimes.value[sectorIndex];
  if (bestSectorTime && sectorTime <= bestSectorTime) {
    return 'green';
  }

  return 'red';
};

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

const bestLapTime = computed(() => {
  if (!sessionHistory.value?.m_lapHistoryData) return 0;

  return sessionHistory.value.m_lapHistoryData.reduce((best, lap) => {
    if (lap.m_lapValidBitFlags & 0x01 && (!best || lap.m_lapTimeInMS < best)) {
      best = lap.m_lapTimeInMS;
    }
    return best;
  }, 0);
});

</script>

<style scoped>
.best-lap {
  background-color: rgba(0, 255, 0, 0.1);
}
</style>
