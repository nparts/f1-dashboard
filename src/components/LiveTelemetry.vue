<template>
  <v-card v-if="telemetry">
    <v-card-title>Live Telemetry</v-card-title>
    <v-card-text>
      <v-row>
        <!-- Speed -->
        <v-col cols="6">
          <v-card variant="outlined">
            <v-card-text>
              <div class="text-overline mb-1">
                SPEED
              </div>
              <div class="text-h4">
                {{ telemetry.m_speed }}
              </div>
              <div class="text-caption">
                KM/H
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- RPM -->
        <v-col cols="6">
          <v-card variant="outlined">
            <v-card-text>
              <div class="text-overline mb-1">
                RPM
              </div>
              <div class="text-h4">
                {{ Math.round(telemetry.m_engineRPM).toLocaleString() }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gear -->
        <v-col cols="6">
          <v-card variant="outlined">
            <v-card-text>
              <div class="text-overline mb-1">
                GEAR
              </div>
              <div class="text-h4">
                {{ formatGear(telemetry.m_gear) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- DRS -->
        <v-col cols="6">
          <v-card
            variant="outlined"
            :color="telemetry.m_drs ? 'success' : undefined"
          >
            <v-card-text>
              <div class="text-overline mb-1">
                DRS
              </div>
              <div class="text-h4">
                {{ telemetry.m_drs ? 'ACTIVE' : 'OFF' }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Throttle and Brake -->
      <v-row
        v-if="telemetry"
        class="mt-4"
      >
        <v-col cols="12">
          <!-- Throttle -->
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-subtitle-2">
              Throttle
            </span>
            <span class="text-body-2">
              {{ Math.round(telemetry.m_throttle * 100) }}%
            </span>
          </div>
          <v-progress-linear
            :model-value="telemetry.m_throttle * 100"
            color="green"
            height="20"
            rounded
          />

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
          />
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
        Waiting for telemetry data...
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useTelemetryStore} from '@/stores/telemetry';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';

const store = useTelemetryStore();
const {carTelemetry} = storeToRefs(store);

// Computed property to get the first car's telemetry data
const telemetry = computed(() => carTelemetry.value?.m_carTelemetryData[0] ?? null);

function formatGear(gear: number): string {
  if (gear === -1) return 'R';
  if (gear === 0) return 'N';
  return gear.toString();
}
</script>

<style scoped>
</style>
