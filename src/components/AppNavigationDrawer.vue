<template>
  <v-app-bar
    color="transparent"
    height="72"
    flat
    app
  >
    <v-img
      class="mx-auto"
      src="../assets/logo/f1_logo_red.svg"
      max-height="25"
      max-width="125"
    />
    <v-app-bar-title style="
    font-size: 35px;
    font-family: 'Formula1-Bold';"
    >
      Dashboard
    </v-app-bar-title>
    <v-spacer />
    <div>
      <v-chip
        :color="isConnected ? 'success' : 'error'"
        size="large"
        class="mr-6"
      >
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </v-chip>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import {useTelemetryStore} from '@/stores/telemetry';
import {storeToRefs} from 'pinia';

const store = useTelemetryStore();
const {isConnected} = storeToRefs(store);

</script>

<style scoped lang="sass">
</style>
