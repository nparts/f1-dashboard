<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <LapTime />
        <LapHistory />
      </v-col>
      <v-col cols="4">
        <LiveTelemetry />
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
