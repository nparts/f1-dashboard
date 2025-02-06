// src/components/TelemetryDisplay.vue
<template>
  <div>
    <v-row>
      <!-- Status Card -->
      <v-col cols="12">
        <v-card class="status-card">
          <v-card-text class="d-flex justify-space-between align-center">
            <div class="text-h6">Status</div>
            <v-chip 
              :color="isConnected ? 'success' : 'error'"
              size="small"
            >
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Live Data -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Live Telemetry</v-card-title>
          <v-card-text>
            <v-row v-if="telemetry">
              <!-- Speed -->
              <v-col cols="6" lg="3">
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="text-overline mb-1">SPEED</div>
                    <div class="text-h4">{{ telemetry.m_speed }}</div>
                    <div class="text-caption">KM/H</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- RPM -->
              <v-col cols="6" lg="3">
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="text-overline mb-1">RPM</div>
                    <div class="text-h4">{{ Math.round(telemetry.m_engineRPM).toLocaleString() }}</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Gear -->
              <v-col cols="6" lg="3">
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="text-overline mb-1">GEAR</div>
                    <div class="text-h4">{{ formatGear(telemetry.m_gear) }}</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- DRS -->
              <v-col cols="6" lg="3">
                <v-card 
                  variant="outlined"
                  :color="telemetry.m_drs ? 'success' : undefined"
                >
                  <v-card-text>
                    <div class="text-overline mb-1">DRS</div>
                    <div class="text-h4">{{ telemetry.m_drs ? 'ACTIVE' : 'OFF' }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Throttle and Brake -->
            <v-row v-if="telemetry" class="mt-4">
              <v-col cols="12">
                <!-- Throttle -->
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-subtitle-2">Throttle</span>
                  <span class="text-body-2">{{ Math.round(telemetry.m_throttle * 100) }}%</span>
                </div>
                <v-progress-linear
                  :model-value="telemetry.m_throttle * 100"
                  color="green"
                  height="20"
                  rounded
                ></v-progress-linear>

                <!-- Brake -->
                <div class="d-flex justify-space-between align-center mb-1 mt-4">
                  <span class="text-subtitle-2">Brake</span>
                  <span class="text-body-2">{{ Math.round(telemetry.m_brake * 100) }}%</span>
                </div>
                <v-progress-linear
                  :model-value="telemetry.m_brake * 100"
                  color="red"
                  height="20"
                  rounded
                ></v-progress-linear>
              </v-col>
            </v-row>

            <!-- No Data Message -->
            <v-alert
              v-if="!telemetry"
              type="info"
              variant="tonal"
              class="mt-2"
            >
              Waiting for telemetry data...
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Lap Info -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Lap Information</v-card-title>
          <v-card-text v-if="lapData">
            <div class="text-h6 mb-2">Lap {{ lapData.m_currentLapNum }}</div>
            <v-chip
              :color="lapData.m_currentLapInvalid === 0 ? 'success' : 'error'"
              class="mb-4"
            >
              {{ lapData.m_currentLapInvalid === 0 ? 'Valid' : 'Invalid' }}
            </v-chip>

            <div class="text-subtitle-1 mt-4">Current Time</div>
            <div class="text-h5 mb-4">{{ formatTime(lapData.m_currentLapTimeInMS) }}</div>

            <div class="text-subtitle-1">Last Lap</div>
            <div class="text-h5">{{ formatTime(lapData.m_lastLapTimeInMS) }}</div>
          </v-card-text>
          <v-card-text v-else>
            <v-alert
              type="info"
              variant="tonal"
            >
              Waiting for lap data...
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useTelemetryStore } from '@/stores/telemetry';
import { storeToRefs } from 'pinia';

const store = useTelemetryStore();
const { telemetry, lapData, isConnected } = storeToRefs(store);

function formatGear(gear: number): string {
  if (gear === -1) return 'R';
  if (gear === 0) return 'N';
  return gear.toString();
}

function formatTime(ms: number): string {
  if (!ms) return '--:--:---';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}
</script>

<style scoped>
.status-card {
  background-color: #1E1E1E !important;
  color: white;
}
</style>