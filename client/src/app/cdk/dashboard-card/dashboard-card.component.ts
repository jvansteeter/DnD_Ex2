import { Component, Input } from '@angular/core';
import { DashboardCard } from './dashboard-card';

@Component({
  selector: 'dashboard-card',
  templateUrl: 'dashboard-card.component.html',
  styleUrls: ['dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() dashboardCard: DashboardCard;
}