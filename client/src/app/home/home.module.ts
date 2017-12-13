import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import {
    MatButtonModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule, MatTableModule
} from '@angular/material';
import { NewRuleSetDialogComponent } from './dialog/new-rule-set-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocialModule } from '../social/social.module';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { NewCampaignDialogComponent } from './dialog/new-campaign-dialog.component';
import { RuleSetModule } from '../rule-set/rule-set.module';
import { CampaignRepository } from '../repositories/campaign.repository';

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
        SocialModule
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
