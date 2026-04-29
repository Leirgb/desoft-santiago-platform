import { MetricCardData } from '../../../shared/ui/metric-card/models/metric-card.model';

export interface DashboardFeaturedProject {
  id: string;
  name: string;
  owner: string;
  status: string;
  progress: number;
}

export interface DashboardActivity {
  id: string;
  icon: string;
  description: string;
  meta: string;
}

export interface DashboardViewModel {
  metrics: MetricCardData[];
  featuredProjects: DashboardFeaturedProject[];
  recentActivity: DashboardActivity[];
}