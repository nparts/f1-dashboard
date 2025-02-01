<template>
    <div class="car-config">
      <div class="text-h6 mb-4">Car Configuration</div>
      <v-row dense>
        <v-col cols="6" v-for="(value, key) in config" :key="key">
          <v-card variant="flat" class="bg-grey-lighten-4">
            <v-card-text>
              <div class="text-caption text-grey">{{ formatKey(key) }}</div>
              <div class="text-body-1">{{ formatValue(key, value) }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup lang="ts">
  interface CarConfigProps {
    config: {
      frontWing: number;
      rearWing: number;
      brakeBias: number;
      differential: number;
      tires: string;
    };
  }
  
  const props = defineProps<CarConfigProps>();
  
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };
  
  const formatValue = (key: string, value: number | string): string => {
    switch (key) {
      case 'brakeBias':
      case 'differential':
        return `${value}%`;
      case 'frontWing':
      case 'rearWing':
        return value.toString();
      default:
        return value.toString();
    }
  };
  </script>
  