<template>
    <div class="live-stats mt-4">
      <div class="text-h6 mb-4">Live Telemetry</div>
      
      <!-- Speed and RPM -->
      <div class="d-flex gap-4 mb-6">
        <v-card variant="flat" class="bg-grey-lighten-4 flex-grow-1">
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ stats.speed }}</div>
            <div class="text-caption text-grey">KM/H</div>
          </v-card-text>
        </v-card>
        
        <v-card variant="flat" class="bg-grey-lighten-4 flex-grow-1">
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ (stats.rpm / 1000).toFixed(1) }}</div>
            <div class="text-caption text-grey">RPM × 1000</div>
          </v-card-text>
        </v-card>
      </div>
  
      <!-- Gear and DRS -->
      <div class="d-flex gap-4 mb-6">
        <v-card 
          variant="flat" 
          :class="['flex-grow-1', stats.gear === -1 ? 'bg-red-lighten-4' : 'bg-grey-lighten-4']"
        >
          <v-card-text class="text-center">
            <div class="text-h2 font-weight-bold">
              {{ stats.gear === -1 ? 'R' : stats.gear === 0 ? 'N' : stats.gear }}
            </div>
            <div class="text-caption text-grey">GEAR</div>
          </v-card-text>
        </v-card>
  
        <v-card 
          variant="flat" 
          :class="['flex-grow-1', stats.drs === 'active' ? 'bg-green-lighten-4' : 'bg-grey-lighten-4']"
        >
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold">DRS</div>
            <div class="text-caption text-grey">{{ formatDRS(stats.drs) }}</div>
          </v-card-text>
        </v-card>
      </div>
  
      <!-- Throttle and Brake -->
      <div class="d-flex flex-column gap-2">
        <div>
          <div class="d-flex justify-space-between">
            <span class="text-caption text-grey">THROTTLE</span>
            <span class="text-caption">{{ stats.throttle }}%</span>
          </div>
          <v-progress-linear
            :model-value="stats.throttle"
            color="green"
            height="8"
            rounded
          ></v-progress-linear>
        </div>
  
        <div>
          <div class="d-flex justify-space-between">
            <span class="text-caption text-grey">BRAKE</span>
            <span class="text-caption">{{ stats.brake }}%</span>
          </div>
          <v-progress-linear
            :model-value="stats.brake"
            color="red"
            height="8"
            rounded
          ></v-progress-linear>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface LiveStatsProps {
    stats: {
      speed: number;
      gear: number;
      rpm: number;
      drs: 'available' | 'active' | 'not_available';
      throttle: number;
      brake: number;
    };
  }
  
  defineProps<LiveStatsProps>();
  
  const formatDRS = (drs: string): string => {
    switch (drs) {
      case 'active':
        return 'ACTIVE';
      case 'available':
        return 'READY';
      default:
        return 'DISABLED';
    }
  };
  </script>
  