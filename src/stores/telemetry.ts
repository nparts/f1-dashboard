import { defineStore } from "pinia";
import { socket } from "@/services/socket";
import type { PacketCarDamageData, PacketCarSetupData, PacketCarStatusData, PacketCarTelemetryData, PacketEventData, PacketFinalClassificationData, PacketLapData, PacketLobbyInfoData, PacketMotionData, PacketMotionExData, PacketParticipantsData, PacketSessionData, PacketSessionHistoryData, PacketTyreSetsData } from '@/types/telemetry';

interface TelemetryState {
  event: PacketEventData | null,
  motion: PacketMotionData | null,
  session: PacketSessionData | null,
  lapData: PacketLapData | null,
  participants: PacketParticipantsData | null,
  carSetups: PacketCarSetupData | null,
  carTelemetry: PacketCarTelemetryData | null,
  carStatus: PacketCarStatusData | null,
  finalClassification: PacketFinalClassificationData | null,
  lobbyInfo: PacketLobbyInfoData | null,
  carDamage: PacketCarDamageData | null,
  sessionHistory: PacketSessionHistoryData | null,
  tyreSets: PacketTyreSetsData | null,
  motionEx: PacketMotionExData | null,
  isConnected: boolean;
}

export const useTelemetryStore = defineStore("telemetry", {
  state: (): TelemetryState => ({
    event: null,
    motion: null,
    session: null,
    lapData: null,
    participants: null,
    carSetups: null,
    carTelemetry: null,
    carStatus: null,
    finalClassification: null,
    lobbyInfo: null,
    carDamage: null,
    sessionHistory: null,
    tyreSets: null,
    motionEx: null,
    isConnected: false,
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
      socket.on("event", (data) => {
          this.event = data;
      });
      socket.on("motion", (data) => {
          this.motion = data;
      });
      socket.on("session", (data) => {
          this.session = data;
      });
      socket.on("lapData", (data) => {
          this.lapData = data;
      });
      socket.on("participants", (data) => {
          this.participants = data;
      });
      socket.on("carSetups", (data) => {
          this.carSetups = data;
      });
      socket.on("carTelemetry", (data) => {
          this.carTelemetry = data;
      });
      socket.on("carStatus", (data) => {
          this.carStatus = data;
      });
      socket.on("finalClassification", (data) => {
          this.finalClassification = data;
      });
      socket.on("lobbyInfo", (data) => {
          this.lobbyInfo = data;
      });
      socket.on("carDamage", (data) => {
          this.carDamage = data;
      });
      socket.on("sessionHistory", (data) => {
        if(data.m_carIdx == data.m_header.player_car_index ) {
          this.sessionHistory = data;
        }
      });
      socket.on("tyreSets", (data) => {
          this.tyreSets = data;
      });
      socket.on("motionEx", (data) => {
          this.motionEx = data;
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
  }
});
