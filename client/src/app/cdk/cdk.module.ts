import { NgModule } from '@angular/core';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatMenuModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [
    DashboardCardComponent,
  ],
  providers: [

  ],
  exports: [
    DashboardCardComponent
  ]
})
export class AppCDKModule {

}