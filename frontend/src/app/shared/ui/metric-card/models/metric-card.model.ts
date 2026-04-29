export type MetricCardTone = 'primary' | 'success' | 'warning' | 'info' | 'danger';

export interface MetricCardData {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: MetricCardTone;
  trend?: string;
}