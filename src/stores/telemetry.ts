// src/stores/telemetry.ts
import { defineStore } from "pinia";
import { socket } from "@/services/socket";
import type { TelemetryData, LapData, CarSetupData } from '@/types/telemetry';

interface TelemetryState {
  telemetry: TelemetryData | null;
  lapData: LapData | null;
  carSetup: CarSetupData | null;
  isConnected: boolean;
}

export const useTelemetryStore = defineStore("telemetry", {
  state: (): TelemetryState => ({
    telemetry: null,
    lapData: null,
    carSetup: null,
    isConnected: false
  }),

  actions: {
    bindEvents() {
      // Handle connection status
      socket.on("connect", () => {
        this.isConnected = true;
      });

      socket.on("disconnect", () => {
        this.isConnected = false;
      });

      // Listen for car telemetry updates
      socket.on("carTelemetry", (message) => {
          this.telemetry = message.m_carTelemetryData?.[0];
      });

      // Listen for lap data updates
      socket.on("lapData", (message) => {
        if (message.type === 'PACKET_LAP_DATA') {
          this.lapData = message.data;
        }
      });

      // Listen for car setup updates
      socket.on("carSetup", (message) => {
        if (message.type === 'PACKET_CAR_SETUP') {
          this.carSetup = message.data;
        }
      });
    },

    disconnect() {
      socket.disconnect();
    },

    connect() {
      socket.connect();
    }
  },

  getters: {
    isDriverActive: (state) => state.telemetry !== null,
    currentSpeed: (state) => state.telemetry?.m_speed ?? 0,
    currentLap: (state) => state.lapData?.m_currentLapNum ?? 0,
    lastLapTime: (state) => state.lapData?.m_lastLapTimeInMS ?? 0,
    currentLapTime: (state) => state.lapData?.m_currentLapTimeInMS ?? 0,
    isLapValid: (state) => state.lapData?.m_currentLapInvalid === 0
  }
});