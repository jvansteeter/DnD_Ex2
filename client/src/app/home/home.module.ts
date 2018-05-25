import { HomeComponent } from './home.component';
import { NewRuleSetDialogComponent } from './dialog/new-rule-set-dialog.component';
import { SocialModule } from '../social/social.module';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { NewCampaignDialogComponent } from './dialog/new-campaign-dialog.component';
import { RuleSetModule } from '../rule-set/rule-set.module';
import { CampaignRepository } from '../repositories/campaign.repository';
import {
  MatButtonModule, MatCardModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatTableModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppCDKModule } from '../cdk/cdk.module';

@NgModule({
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    RuleSetModule,
    SocialModule,
    MatGridListModule,
    MatCardModule,
    AppCDKModule,
  ],
  declarations: [
    HomeComponent,
    NewRuleSetDialogComponent,
    NewCampaignDialogComponent
  ],
  providers: [
    RuleSetRepository,
    CampaignRepository
  ],
  exports: [
    HomeComponent
  ],
  entryComponents: [
    NewRuleSetDialogComponent,
    NewCampaignDialogComponent
  ]
})
export class HomeModule {

}
