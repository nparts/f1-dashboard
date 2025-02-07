<template>
    <v-card>
      <v-card-title>Lap Timing</v-card-title>
      <v-card-text>
        <template v-if="currentLapData">
          <v-row>
            <!-- Current Lap -->
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="text-subtitle-2">Current Lap</div>
                  <div class="text-h5">{{ currentLapData.m_currentLapNum }}</div>
                  <div class="text-subtitle-1">
                    {{ formatTime(currentLapData.m_currentLapTimeInMS) }}
                  </div>
                  <v-chip
                    :color="currentLapData.m_currentLapInvalid ? 'error' : 'success'"
                    size="small"
                    class="mt-2"
                  >
                    {{ currentLapData.m_currentLapInvalid ? 'Invalid' : 'Valid' }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Last Lap -->
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="text-subtitle-2">Last Lap</div>
                  <div class="text-h5">
                    {{ formatTime(currentLapData.m_lastLapTimeInMS) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
  
          <!-- Sector Times -->
          <v-row class="mt-4">
            <v-col cols="12">
              <div class="text-subtitle-1 mb-2">Sector Times</div>
              <v-row>
                <v-col v-for="(sector, index) in sectors" :key="index" cols="4">
                  <v-card
                    variant="outlined"
                    :color="currentLapData.m_sector === index ? 'primary' : undefined"
                  >
                    <v-card-text class="text-center">
                      <div class="text-subtitle-2">S{{ index + 1 }}</div>
                      <div class="text-body-1">
                        {{ formatTime(getSectorTime(index)) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
  
        <v-alert
          v-else
          type="info"
          variant="tonal"
        >
          Waiting for lap data...
        </v-alert>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
    import { useTelemetryStore } from '@/stores/telemetry';
    import { storeToRefs } from 'pinia';
  import { computed } from 'vue';
  
  const store = useTelemetryStore();
  const { lapData } = storeToRefs(store);
  
  const sectors = [0, 1, 2];
  
  const currentLapData = computed(() => lapData.value?.m_lapData[0] ?? null);
  
  function formatTime(ms: number): string {
    if (!ms) return '--:--:---';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
  
  function getSectorTime(sector: number): number {
    if (!currentLapData.value) return 0;
    switch (sector) {
      case 0:
        return currentLapData.value.m_sector1TimeInMS;
      case 1:
        return currentLapData.value.m_sector2TimeInMS;
      case 2:
        const total = currentLapData.value.m_currentLapTimeInMS;
        const s1 = currentLapData.value.m_sector1TimeInMS;
        const s2 = currentLapData.value.m_sector2TimeInMS;
        return currentLapData.value.m_sector === 2 ? total - s1 - s2 : 0;
      default:
        return 0;
    }
  }
  </script>
  