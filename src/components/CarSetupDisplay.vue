<template>
  <v-card>
    <v-card-title>Car Setup</v-card-title>
    <v-card-text>
      <template v-if="carSetup">
        <v-row>
          <!-- Wings -->
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-subtitle-2 mb-2">Aero Settings</div>
                <v-row>
                  <v-col cols="6">
                    <div class="text-caption">Front Wing</div>
                    <v-slider v-model="carSetup.m_frontWing" :min="1" :max="10" :step="1" readonly
                      density="comfortable">
                      <template v-slot:append>
                        <div class="text-body-2">{{ carSetup.m_frontWing }}</div>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption">Rear Wing</div>
                    <v-slider v-model="carSetup.m_rearWing" :min="1" :max="10" :step="1" readonly density="comfortable">
                      <template v-slot:append>
                        <div class="text-body-2">{{ carSetup.m_rearWing }}</div>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Differential -->
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-subtitle-2 mb-2">Differential</div>
                <v-row>
                  <v-col cols="6">
                    <div class="text-caption">On Throttle</div>
                    <v-slider v-model="carSetup.m_onThrottle" :min="0" :max="100" readonly density="comfortable">
                      <template v-slot:append>
                        <div class="text-body-2">{{ carSetup.m_onThrottle }}%</div>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption">Off Throttle</div>
                    <v-slider v-model="carSetup.m_offThrottle" :min="0" :max="100" readonly density="comfortable">
                      <template v-slot:append>
                        <div class="text-body-2">{{ carSetup.m_offThrottle }}%</div>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Brake Bias -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-subtitle-2 mb-2">Brake Bias</div>
                <v-slider v-model="carSetup.m_brakeBias" :min="0" :max="100" readonly density="comfortable">
                  <template v-slot:append>
                    <div class="text-body-2">{{ carSetup.m_brakeBias }}%</div>
                  </template>
                </v-slider>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <v-alert v-else type="info" variant="tonal">
        Waiting for car setup data...
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useTelemetryStore } from '@/stores/telemetry';
import { storeToRefs } from 'pinia';

const store = useTelemetryStore();
const { carSetups } = storeToRefs(store);

const carSetup = computed(() => carSetups.value?.m_carSetups[0] ?? null);

</script>