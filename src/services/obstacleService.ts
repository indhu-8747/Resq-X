export type ObstacleState = 'clear' | 'caution' | 'danger';

export interface ObstacleTelemetry {
  distanceCm: number;
  status: ObstacleState;
  statusLabel: string;
  minWarningThreshold: number; // 35 cm
  criticalThreshold: number;   // 18 cm
  maxRangeCm: number;          // 80 cm scale
  lastUpdated: string;
  isDemoData: boolean;
  history: number[];
}

export function getObstacleStatus(distanceCm: number): {
  status: ObstacleState;
  statusLabel: string;
  color: string;
  badgeClass: string;
} {
  if (distanceCm < 18) {
    return {
      status: 'danger',
      statusLabel: 'OBSTACLE DETECTED',
      color: '#ef4444',
      badgeClass: 'text-red-400 bg-red-950/50 border-red-500/50',
    };
  } else if (distanceCm <= 35) {
    return {
      status: 'caution',
      statusLabel: 'CAUTION',
      color: '#f59e0b',
      badgeClass: 'text-amber-300 bg-amber-950/40 border-amber-500/40',
    };
  } else {
    return {
      status: 'clear',
      statusLabel: 'CLEAR',
      color: '#10b981',
      badgeClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/40',
    };
  }
}

export const INITIAL_OBSTACLE_TELEMETRY: ObstacleTelemetry = {
  distanceCm: 42,
  status: 'clear',
  statusLabel: 'CLEAR',
  minWarningThreshold: 35,
  criticalThreshold: 18,
  maxRangeCm: 80,
  lastUpdated: '14:32:18',
  isDemoData: true,
  history: [68, 55, 48, 45, 43, 42],
};
