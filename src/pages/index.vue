<template>
      <v-container fluid class="pa-0 fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Left Column (1/3) -->
          <v-col cols="4" class="grey-lighten-4">
            <div class="pa-4 fill-height d-flex flex-column">
              <!-- Current Status Component -->
              <CurrentStatus class="flex-grow-1"/>
              <!-- Circuit Info Component -->
              <CircuitInfo class="mt-4"/>
            </div>
          </v-col>

          <!-- Right Column (2/3) -->
          <v-col cols="8">
            <div class="pa-4 fill-height">
              <Leaderboard />
            </div>
          </v-col>
        </v-row>
      </v-container>
</template>
<script lang="ts" setup>
  //
</script>
