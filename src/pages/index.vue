<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <LiveTelemetry />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <LapTiming />
      </v-col>
      <v-col cols="12" md="6">
        <CarSetupDisplay />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
  import { onMounted, onUnmounted } from 'vue';
  import { useTelemetryStore } from '@/stores/telemetry';

  const store = useTelemetryStore();

  onMounted(() => {
    store.bindEvents();
  });

  onUnmounted(() => {
    store.disconnect();
  });
</script>
