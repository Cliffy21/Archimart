export const COLORS = {
  primary: '#4f46e5',
  secondary: '#6366f1',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  light: '#f3f4f6',
  dark: '#1f2937',
} as const;

export const CHART_COLORS = [
  '#8884d8',
  '#83a6ed',
  '#8dd1e1',
  '#82ca9d',
  '#a4de6c'
] as const;

export type ColorKey = keyof typeof COLORS;
export type ChartColorIndex = 0 | 1 | 2 | 3 | 4; 