export interface TelemetryData {
    m_speed: number;              // Speed of car in kilometres per hour
    m_throttle: number;           // Amount of throttle applied (0.0 to 1.0)
    m_brake: number;              // Amount of brake applied (0.0 to 1.0)
    m_gear: number;               // Gear selected (1-8, N=0, R=-1)
    m_engineRPM: number;          // Engine RPM
    m_drs: number;                // 0 = off, 1 = on
}

export interface LapData {
    m_lastLapTimeInMS: number;          // Last lap time in milliseconds
    m_currentLapTimeInMS: number;       // Current time around the lap in milliseconds
    m_sector1TimeInMS: number;          // Sector 1 time in milliseconds
    m_sector1TimeMinutes: number;       // Sector 1 whole minute part
    m_sector2TimeInMS: number;          // Sector 2 time in milliseconds
    m_sector2TimeMinutes: number;       // Sector 2 whole minute part
    m_currentLapNum: number;            // Current lap number
    m_sector: number;                   // 0 = sector1, 1 = sector2, 2 = sector3
    m_currentLapInvalid: number;        // Current lap invalid - 0 = valid, 1 = invalid
}

export interface CarSetupData {
    m_frontWing: number;                // Front wing aero
    m_rearWing: number;                 // Rear wing aero
    m_onThrottle: number;               // Differential adjustment on throttle (percentage)
    m_offThrottle: number;              // Differential adjustment off throttle (percentage)
    m_brakeBias: number;                // Brake bias (percentage)
}
