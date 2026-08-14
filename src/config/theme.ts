// "Climate Intelligence" palette, chosen for the Uttarakhand Vulnerability Atlas.
export const palette = {
  primary: '#006D77', // Deep Teal
  secondary: '#83C5BE', // Aqua
  accent: '#3F51B5', // Indigo
  highlight: '#E9C46A', // Gold
  danger: '#E76F51', // Vermilion
  background: '#F8FAFC', // Mist White
  card: '#FFFFFF',
  text: '#1F2937', // Dark Slate
} as const;

// Shared "Climate Indicator Coding" status colors, used consistently for
// alerts, badges, and as the severity ramp for every choropleth/dot layer.
export const statusColors = {
  safe: '#2E7D32',
  watch: '#FBC02D',
  alert: '#F57C00',
  emergency: '#D32F2F',
  information: '#1976D2',
  inactive: '#B0BEC5',
} as const;

export const severityRamp = [statusColors.safe, statusColors.watch, statusColors.alert, statusColors.emergency];

export const wordmark = 'Uttarakhand Vulnerability Atlas';
