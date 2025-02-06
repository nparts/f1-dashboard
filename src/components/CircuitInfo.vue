<template>
  <v-card>
    <v-card-title class="text-subtitle-1">
      Circuit of the Week
    </v-card-title>
    <v-card-text>
      <div class="circuit-layout">
        <v-img
          :src="circuit.imgUrl"
          class="me-2"
        ></v-img>
      </div>
      <div class="d-flex align-center mt-4">
        <v-img
          :src="circuit.flagUrl"
          width="32"
          aspect-ratio="16/9"
          class="me-2"
        ></v-img>
        <span class="text-h6">{{ circuit.name }}</span>
      </div>
      <div class="text-subtitle-2 mt-2">
        Length: {{ circuit.length }}km • Laps: {{ circuit.numberOfLaps }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Dummy data - will be replaced with Pinia store
const circuit = {
  name: 'Zandvoort',
  imgUrl: '/circuits/Netherlands_Circuit.png',
  flagUrl: '/flags/nl.svg',
  length: 5.891,
  numberOfLaps: 52
}
</script>
