<template>
    <v-card class="h-100">
      <v-card-title class="text-subtitle-1">
        Leaderboard
      </v-card-title>
      <v-card-text class="h-100">
        <div class="leaderboard-container" ref="containerRef">
          <v-table>
            <thead>
              <tr>
                <th>POS</th>
                <th>DRIVER</th>
                <th class="text-center">BEST LAP</th>
                <th class="text-center">S1</th>
                <th class="text-center">S2</th>
                <th class="text-center">S3</th>
                <th class="text-right">GAP</th>
                <th class="text-right">LAPS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in leaderboardEntries"
                :key="entry.driver"
                :class="{'purple--text': index === 0}"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ entry.driver }}</td>
                <td class="text-center">{{ formatTime(entry.bestLap) }}</td>
                <td :class="getSectorClass(entry.sectors.sector1, 1)">
                  {{ formatTime(entry.sectors.sector1) }}
                </td>
                <td :class="getSectorClass(entry.sectors.sector2, 2)">
                  {{ formatTime(entry.sectors.sector2) }}
                </td>
                <td :class="getSectorClass(entry.sectors.sector3, 3)">
                  {{ formatTime(entry.sectors.sector3) }}
                </td>
                <td class="text-right">{{ formatGap(entry.gapToLeader) }}</td>
                <td class="text-right">{{ entry.totalLaps }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  // Dummy data - will be replaced with Pinia store
  const leaderboardEntries = [
    {
      driver: 'Max Verstappen',
      bestLap: 80456,
      sectors: {
        sector1: 26123,
        sector2: 28456,
        sector3: 25877
      },
      gapToLeader: 0,
      totalLaps: 12,
      purpleSectors: [1, 3]
    },
    // Add more dummy entries...
  ]
  
  // Auto-scroll functionality
  const containerRef = ref<HTMLElement | null>(null)
  const currentScroll = ref(0)
  const scrolling = ref(false)
  
  onMounted(() => {
    startScrolling()
  })
  
  const startScrolling = () => {
    if (!containerRef.value) return
    
    const scroll = () => {
      if (!scrolling.value || !containerRef.value) return
      
      currentScroll.value += 1
      containerRef.value.scrollTop = currentScroll.value
      
      if (containerRef.value.scrollTop + containerRef.value.clientHeight >= 
          containerRef.value.scrollHeight) {
        // Reset scroll after waiting
        setTimeout(() => {
          if (containerRef.value) {
            currentScroll.value = 0
            containerRef.value.scrollTop = 0
          }
        }, 5000)
      }
      
      requestAnimationFrame(scroll)
    }
    
    scrolling.value = true
    scroll()
  }
  
  const formatTime = (time: number | null): string => {
    if (time === null) return '--:--.---'
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000))
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }
  
  const formatGap = (gap: number): string => {
    return gap === 0 ? '-' : `+${(gap / 1000).toFixed(3)}`
  }
  
  const getSectorClass = (time: number | null, sector: number): string => {
    if (!time) return ''
    return leaderboardEntries[0].purpleSectors.includes(sector) ? 'text-purple text-center' : 'text-center'
  }
  </script>
  
  <style scoped>
  .leaderboard-container {
    height: calc(100% - 48px);
    overflow-y: auto;
    scroll-behavior: smooth;
  }
  
  .text-purple {
    color: #9C27B0;
  }
  </style>
  