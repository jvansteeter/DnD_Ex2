import { NgModule } from '@angular/core';
import { CampaignComponent } from './campaign.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
    MatButtonModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatListModule,
    MatTableModule
} from '@angular/material';
import { SocialModule } from '../social/social.module';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from '../repositories/campaign.repository';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        MatListModule,
        MatButtonModule,
        MatExpansionModule,
        MatTableModule,
        MatCheckboxModule,
        SocialModule,
        MatDialogModule
    ],
    declarations: [
        CampaignComponent
    ],
    exports: [
        CampaignComponent
    ],
    providers: [
        CampaignRepository,
        CampaignService
    ]
})
export class CampaignModule {

}