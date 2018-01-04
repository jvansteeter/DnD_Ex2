import { NgModule } from '@angular/core';
import { CampaignComponent } from './campaign.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
    MatButtonModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatListModule,
    MatTableModule
} from '@angular/material';
import { AlertModule } from '../alert/alert.module';
import { SocialModule } from '../social/social.module';


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

    ]
})
export class CampaignModule {

}