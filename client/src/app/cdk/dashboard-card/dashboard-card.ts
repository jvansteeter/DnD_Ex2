import { DashboardCardOption } from './dashboard-card-option';

export interface DashboardCard {
  title?: string;
  menuOptions?: DashboardCardOption[];
}