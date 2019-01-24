import { DashboardCardOption } from './dashboard-card-option';

export interface DashboardCard {
  label?: string;
  menuOptions?: DashboardCardOption[];
}